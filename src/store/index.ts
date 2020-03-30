import Vue from 'vue';
import Vuex from 'vuex';
import { Seat, Game, Trick, SerializedGame, SeatMap } from '@/logic/game';
import { Lobby, SerializedLobby } from '@/logic/lobby';
import { State as SharedState, SerializedState } from '@/logic/state';
import { Player } from '@/logic/player';
import { Card } from '@/logic/card';
import { Server, ApiBaseUrl } from '@/server';
import { ClientState } from '@/logic/client';

Vue.use(Vuex);

const server = new Server(ApiBaseUrl);

export default new Vuex.Store<{
  sharedState: SharedState;
  clientState: ClientState;
  stateHistory: SerializedState[];
}>({
  state: {
    sharedState: { stage: 'none' },   
    clientState: {
      userId: undefined,
      connected: false,
      host: false,
      name: undefined,
      gameId: undefined,
      handState: {
        passedCards: false,
        pickedUpSecondDeal: false,
        showEndHandModal: false
      }
      // host: true, userId: '5', name: 'Nick', gameId: '1',
    },
    stateHistory: []
  },
  mutations: {
    setGame: (state, { gameId }: { gameId: string }) => {
      // See if gameId is truthy as a cheap check that it was actually set to something
      state.clientState.gameId = gameId || undefined;
    },
    setUserId: (state, { userId }: {userId: string}) => {
      state.clientState.userId = userId;
    },
    connected: (state) => {
      state.clientState.connected = true;
    },
    startLobby: (state) => {
      state.clientState.host = true;
      const lobby = new Lobby(Lobby.getId());
      state.sharedState = { stage: 'lobby', stageState: lobby };
      state.clientState.gameId = lobby.id;
    },
    joinLobby: (state, payload: { name: string; game: string }) => {
      const ghostPlayer = payload.name.toLowerCase() === 'ghost';

      if(state.clientState.userId === undefined) {
        let userId = undefined;
        if(!ghostPlayer) userId = localStorage.getItem('playtichu:userid') ?? undefined;
        if(userId === undefined) userId = Player.getId(payload.name);

        state.clientState.userId = userId;
        if(!ghostPlayer) localStorage.setItem('playtichu:userid',userId);
      }

      state.clientState.name = ghostPlayer ? state.clientState.userId : payload.name;
      state.clientState.gameId = payload.game;
    },
    newGame: (state) => {
      if (state.sharedState.stage === 'game') {
        const players = { ...state.sharedState.stageState.seats };
        for (const player in players) {
          players[player as Seat].hand = new Set([]);
          players[player as Seat].tricks = [];
        }
        state.sharedState.stageState = new Game(state.sharedState.stageState.id, players);
      }
    },
    toggleEndHandModal: (state) => {
      state.clientState.handState.showEndHandModal =
        !state.clientState.handState.showEndHandModal;
    },
    pickUpSecondDeal: (state) => {
      state.clientState.handState.pickedUpSecondDeal = true;
    },
    deserialize: (state, { newState }: { newState: SerializedState }) => {
      console.log('received new state for game '+newState.stageState.id);

      // Check the game ID to guard against old SignalR subscriptions
      if(state.clientState.gameId != newState.stageState.id) return;

      let stageState = null;
      if(newState.stage === 'game') { 
        stageState = Game.deserialize(newState.stageState as SerializedGame);
        if(state.sharedState.stage === 'game' && 
          stageState.dealCount > state.sharedState.stageState.dealCount) { 
            state.clientState.handState = {
              passedCards: false,
              pickedUpSecondDeal: false,
              showEndHandModal: false
            };
          }
      }
      else if(newState.stage === 'lobby') stageState = Lobby.deserialize(newState.stageState as SerializedLobby)
      else console.log('could not deserialize state for unknown stage')
      
      if(stageState != null) { 
        state.stateHistory.push(newState);
        console.log(`${state.stateHistory.length} items in history after push`);
        state.sharedState = {stage: newState.stage, stageState: stageState} as SharedState;
      }
    }
  },
  getters: {
    gameRoute: (state): string => {
      if (state.sharedState.stage !== 'none') {
        return `game/${state.sharedState.stageState.id}`;
      }

      return '/';
    },
    mySeat: (state): Seat | undefined => {
      if(state.sharedState.stage != 'none' && state.clientState.userId != undefined) {
        const seats = state.sharedState.stageState.seats;
        for (const seat in seats) {
          if (seats[seat as Seat]?.id === state.clientState.userId) return seat as Seat;
        }
      }
      return undefined;
    },
    player: (state) => (seat: Seat): Player | undefined => {
      switch (state.sharedState.stage) {
        case 'game':
        case 'lobby':
          return state.sharedState.stageState.seats[seat];
        default:
          return undefined;
      }
    },
    currentTrick: (state): [Seat, ReadonlyArray<Card>][] => {
      if (state.sharedState.stage === 'game') {
        return state.sharedState.stageState.currentTrick;
      }

      return [];
    },
    allCardsPassed: (state): boolean => {
      if(state.sharedState.stage != 'game') return false;
      return state.sharedState.stageState.allCardsPassed;
    },
    score: (state) => {
      if (state.sharedState.stage === 'game') {
        return state.sharedState.stageState.score();
      }
    },
    seats: (state) => {
      if (state.sharedState.stage === 'game') {
        return state.sharedState.stageState.seats;
      }

      return {};
    },
    seatsOut: (state) => {
      const seats = [];
      if (state.sharedState.stage === 'game') {
        for (const seat in state.sharedState.stageState.seats) {
          if (state.sharedState.stageState.seats[seat as Seat].hand.size === 0) {
            seats.push(seat);
          }
        }
      }

      return seats;
    }
  },
  actions: {
    connect: async ({ dispatch, commit, state }, { gameId }: { gameId: string }) => {
      if(state.clientState.connected) return;
      if(state.clientState.userId === undefined) throw 'User ID is not set, cannot connect';

        const handlers = {
          onReceiveState: (newState: { stage: string; stageState: SerializedGame }) => {
            commit('deserialize', { newState })
          },
          onRequestState: async () => { 
            if(state.clientState.host === true) {
              console.log("Received state request, sending because I'm the host");
              await dispatch('sendState');
            }
            else console.log("Received state request, ignoring because I'm not the host");
          }
        }

        console.log(`Joining game ${gameId} as ${state.clientState.userId}...`);
        // Connect user to the server
        await server.start(state.clientState.userId, handlers);
        // Remove all subscriptions for this user, in case they are lingering
        await server.leaveAllGames(state.clientState.userId);
        // Subscribe user to the game and request current state
        await server.joinGame(gameId, state.clientState.userId);
        commit('connected');
    },
    takeSeat: async ({ dispatch, state }, { seat }: { seat: Seat }) => {
      if(state.sharedState.stage === 'lobby') {        
        if(state.clientState.userId === undefined ||
          state.clientState.name === undefined ||
          state.sharedState.stageState.seats[seat] != undefined) return;
        
        state.sharedState.stageState.join(
          seat,
          state.clientState.name,
          state.clientState.userId
        );
        await dispatch('sendState');
      }
    },    
    ghostSeat: async (
      { dispatch, state },
      { seat }: { seat: Seat }
    ) => {
      if(state.sharedState.stage === 'lobby') {        
        if(state.sharedState.stageState.seats[seat] != undefined) return;
        
        const id = Lobby.getId();
        state.sharedState.stageState.join(seat, 'ghost'+id, id);
        await dispatch('sendState');
      }
    },
    startGame: async({ dispatch, state }) => {
      if (state.sharedState.stage === 'lobby') {
        if (state.sharedState.stageState.full) {
          console.log('Starting game...');
          const game = state.sharedState.stageState.start();
          state.sharedState = { stage: 'game', stageState: game };

          // Deal will take care of sending state
          await dispatch('deal');
        }
      }
    },
    async passCards(
      { dispatch, state },
      pass: { fromSeat: Seat; to: SeatMap<Card> }) {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.pass(pass.fromSeat, pass.to);
        state.clientState.handState.passedCards = true;
        await dispatch('sendState');
      }
    },
    pickUpPassedCards: async ({ dispatch, state }) => {
      if (state.sharedState.stage === 'game' && state.sharedState.stageState.allCardsPassed) {
        state.sharedState.stageState.pickUpPassedCards();
        await dispatch('sendState');
      }
    },
    play: async ({dispatch, state}, { seat, cards }: { seat: Seat; cards: Card[]}) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.play(seat, cards);
        await dispatch('sendState');
      }
    },
    take: async ({dispatch, state}, { seat, cards }: { seat: Seat; cards: Trick }) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.take(seat, cards);
        await dispatch('sendState');
      }
    },
    deal: async ({ dispatch, state }) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.deal();
        state.clientState.handState = {
          passedCards: false,
          pickedUpSecondDeal: false,
          showEndHandModal: false
        };
        await dispatch('sendState');
      }
    },
    rewind: async({ state }) => {
      // Discard the top of the history because that is the current state
      state.stateHistory.pop();
      // Then remove the previous history, because we'll get it back, and send it through pushState
      const lastState = state.stateHistory.pop();
      if(lastState != undefined) {
        console.log('sending state for game ' + lastState.stageState.id);
        await server.pushState(lastState.stageState.id, lastState);
      }
    },
    sendState: async ({ state }) => {
      if(state.sharedState.stage != 'none') {
        console.log('sending state for game ' + state.sharedState.stageState.id);
        const serialized = {
          stage: state.sharedState.stage,
          stageState: state.sharedState.stageState.serialize()
        };
        await server.pushState(state.sharedState.stageState.id, serialized);
      }
    }
  }
});
