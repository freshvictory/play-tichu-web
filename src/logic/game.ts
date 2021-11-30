import { Player, SerializedPlayer } from './player';
import { Deck } from './deck';
import { Card } from './card';
import { Suit } from './gems-deck';

export type Seat = 'north' | 'south' | 'east' | 'west';

export type SeatMap<T> = { [key in Seat]: T };

export type Trick = [Seat, ReadonlyArray<Card>][];

export type GameType = 'tichu' | 'gems';

export type SuitMap<T> = {[key in Suit]: T}

export type PlayerScore = { seat: Seat; tricks: number; hand: number; gems: SuitMap<number> | undefined; bonus: number | undefined };
export type TeamScore = {players: PlayerScore[]; points: number; gems: Suit[]};

export type SerializedGame = {
  id: string;
  type: GameType;
  lastAction: string;
  seats: SeatMap<SerializedPlayer>;
  cardsPassedTo: SeatMap<number[]>;
  currentTrick: [string, number[]][];
  out: Seat[];
  dealCount: number;
  sequence: number;
};

export class Game {
  public readonly id: string;

  public readonly type: GameType;

  public lastAction: string;

  public readonly seats: SeatMap<Player>;

  public cardsPassedTo: SeatMap<Set<Card>>;

  public currentTrick: Trick;

  public out: Seat[];

  public dealCount: number;
  public sequence: number;
  
  public get allCardsPassed(): boolean {
    let passCount = 0;
    for(const seat in this.cardsPassedTo){
      passCount += this.cardsPassedTo[seat as Seat].size;
    }
    return passCount === 12;
  }

  public get firstOut(): Seat | undefined {
    return this.out[0];
  }
  
  public get secondOut(): Seat | undefined {
    return this.out[1];
  }
  
  public get lastOut(): Seat | undefined {
    return this.out[3];
  }

  public get playersOut(): number {
    let out = 0;
    for(const seat in this.seats) {      
      if(this.seats[seat as Seat].hand.size === 0) out++;
    }
    return out;
  }

  constructor(id: string, type: GameType, seats: SeatMap<Player>, sequence: number) {
    this.id = id;
    this.type = type;
    this.lastAction = 'new game';
    this.seats = seats;
    this.cardsPassedTo = Game.emptyCardsPassed;
    this.currentTrick = [];
    this.out = [];
    this.dealCount = 0;
    this.sequence = sequence;
  }

  public play(seat: Seat, cards: Card[]): void {
    if(cards.length === 0) return;
    if(this.seats[seat].hand.size === 0) return;

    this.lastAction = this.seats[seat].name + ' plays';
    const hand = this.seats[seat].hand;
    for (const card of cards) {
      if(hand.has(card)) {
        hand.delete(card);
      }
      else {
        throw `Seat ${seat} does not have card ${card.id}`;
      }
    }

    this.currentTrick.push([seat, cards]);

    // Resolve any tracking of first and last player out
    if(this.seats[seat].hand.size === 0) {
      this.out.push(seat);
      if(this.out.length === 3) {
        for(const lastSeat in this.seats) {
          if(this.seats[lastSeat as Seat].hand.size > 0) {
            this.out.push(lastSeat as Seat);
            break;
          }
        }
      }
    }    
  }

  public take(seat: Seat, trick: Trick): void {
    this.lastAction = this.seats[seat].name + ' takes trick';
    this.seats[seat].tricks.push(...trick.flatMap((play) => play[1]));
    this.currentTrick = [];
  }

  public deal(): void {
    this.dealCount++;
    this.lastAction = 'new deal';
    const seats = Object.keys(this.seats) as Seat[];
    const deal = Deck.dealByType(this.type, ...seats);
    this.currentTrick = []
    this.cardsPassedTo = Game.emptyCardsPassed;
    this.out = [];
    
    for (const seat of seats) {
      const player = this.seats[seat];

      if(this.type === 'tichu') {
        player.secondDeal = new Set(deal[seat].slice(8));
        player.hand = new Set(deal[seat]);
      }
      if(this.type === 'gems') {
        player.secondDeal = new Set();
        // Only deal 10 of the 11 cards to the player
        deal[seat].pop();
        player.hand = new Set(deal[seat]);
      }

      player.passedCards = false;
      player.tricks = [];
    }
  }

  public pass<S extends Seat, T extends Exclude<Seat, S>>(
    fromSeat: S,
    to: Omit<SeatMap<Card>, S>
  ) {
    this.lastAction = 'pass from '+ this.seats[fromSeat].name;
    for(const seat in to) {
      const card = to[seat as T];
      this.seats[fromSeat].hand.delete(card)
      this.seats[fromSeat].passedCards = true;
      this.cardsPassedTo[seat as T].add(card);
    }
  }

  public pickUpPassedCards() {
    this.lastAction = 'everybody picks up';
    for(const seat in this.seats) {
      for(const card of this.cardsPassedTo[seat as Seat]) {
        this.seats[seat as Seat].hand.add(card)
      }
      this.seats[seat as Seat].hand = new Set(
        [...this.seats[seat as Seat].hand]
        .sort((a, b) => a.rank - b.rank)
      );
      this.cardsPassedTo[seat as Seat].clear();
    }
  }

  public score(): TeamScore[] {
    const getTrickScore = (seat: Seat) => {
      return this.seats[seat]
        .tricks
        .reduce((n, c) => n + c.value, 0);
    }

    const getHandScore = (seat: Seat) => {
      return [...this.seats[seat].hand]
        .reduce((n, c) => n + c.value, 0);
    }

    const getBonusScore = (seat: Seat) => {
      if(this.type === 'tichu') return undefined;
      if(this.out[0] === seat) return 20;
      if(this.out[1] === seat) return 10;
      return 0;
    }

    const getGems = (seat: Seat) => {
      if(this.type === 'tichu') return undefined;
      const counts: { [key in Suit]: number } = {
        green: 0,
        blue: 0,
        red: 0,
        black: 0
      }
      this.seats[seat].tricks
      .forEach((card) => {
        if(card.name != 'G') return;
        counts[card.suit as Suit]++;
      });
      return counts;
    }

    const scoreSeat = (seat: Seat): PlayerScore => {
      return { 
        seat: seat,
        tricks: getTrickScore(seat), 
        hand: getHandScore(seat), 
        gems: getGems(seat),
        bonus: getBonusScore(seat)
      }
    }

    const scoreTeams = (players: SeatMap<PlayerScore>) => {
      const teams = {
        north: 0,
        south: 0,
        east: 1,
        west: 1
      };
      const scores: TeamScore[] = [
        {players: [], points: 0, gems: []},
        {players: [], points: 0, gems: []},
      ];
      
      for(const seatString in players) {
        const seat = seatString as Seat;
        const score = scores[teams[seat]];
        const player = players[seat];

        score.players.push(player);
        score.points += (player.bonus??0);

        if(this.out[3] === seat && this.type === 'tichu') {          
          scores[(teams[seat]+1) % 2].points += player.hand;
          scores[teams[this.out[0]]].points += player.tricks
        }
        else {          
          score.points += player.tricks;
        }
      }

      if(this.type === 'gems') {
        for(const score of scores) {
          if(score.players.length != 2) continue;
          if(score.players[1].gems === undefined) continue;
          for(const suitString in score.players[0].gems){
            const suit = suitString as Suit;
            if(score.players[0].gems[suit] + score.players[1].gems[suit] === 4) {
              score.gems.push(suit);
            }
          }
        }
      }

      return scores;
    };

    const teamScores = scoreTeams({
      north: scoreSeat('north'),
      east: scoreSeat('east'),
      south: scoreSeat('south'),
      west: scoreSeat('west')
    });

    return teamScores;
  }

  public serialize(): SerializedGame {
    const game = {seats: {}, cardsPassedTo: {}, lastAction: this.lastAction} as SerializedGame;
    for(const seat in this.seats) {
      game.seats[seat as Seat] = this.seats[seat as Seat].serialize();
      game.cardsPassedTo[seat as Seat] = Array.from(this.cardsPassedTo[seat as Seat]).map((card) => card.serializedId);
    }
    game.id = this.id;
    game.type = this.type;
    game.currentTrick = this.currentTrick.map((play) => [play[0] as string, play[1].map((card) => card.serializedId)]);
    game.out = this.out;
    game.dealCount = this.dealCount;
    game.sequence = this.sequence+1;
    return game;
  }

  static deserialize(data: SerializedGame) {
    const deck = Deck.getDeckByType(data.type);
    const seats = {
      north: Player.deserialize(data.seats.north, deck),
      south: Player.deserialize(data.seats.south, deck),
      east: Player.deserialize(data.seats.east, deck),
      west: Player.deserialize(data.seats.west, deck),
    };
    const game = new Game(data.id, data.type, seats, data.sequence);

    for(const seat in data.seats) {
      data.cardsPassedTo[seat as Seat].forEach(cardId => 
        game.cardsPassedTo[seat as Seat].add(deck[cardId]));
    }
    game.currentTrick = data.currentTrick.map((play) => [play[0] as Seat, play[1].map( (cardId) => deck[cardId] ) ]) as Trick
    game.out = data.out;
    game.dealCount = data.dealCount;
    game.lastAction = data.lastAction; // ?
    return game;
  }

  static get emptyCardsPassed(): SeatMap<Set<Card>> {
    return {
      north: new Set<Card>(),
      south: new Set<Card>(),
      east: new Set<Card>(),
      west: new Set<Card>(),
    };
  }
}
