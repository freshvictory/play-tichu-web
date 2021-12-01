import { Game } from "./logic/game";
import { SerializedState } from "./logic/state";
import { Handlers, GameServer } from "./server";

type StateMessage = {
  id: string;
  version: number;
  state: SerializedState;
}

export const WebsocketHost = 'play-tichu-worker.nslowes.workers.dev';

export class WebsocketServer implements GameServer {  
  private readonly hostname: string;
  private websocket: WebSocket | null;
  private handlers: Handlers | null;
  private userId: string | null;

  constructor(hostname: string) {
    this.hostname = hostname;
    this.websocket = null;
    this.handlers = null;
    this.userId = null;
  }

  start(userId: string, handlers: Handlers): Promise<void> {
    this.handlers = handlers;
    this.userId = userId;
    return Promise.resolve();
  }

  joinGame(gameId: string, userId: string): Promise<any> {
    this.userId = userId;
    const ws = new WebSocket(`wss://${this.hostname}/api/room/${gameId}/websocket`);

    const ping = async () => {
      while(ws.OPEN) {
        await new Promise(resolve => setTimeout(resolve, 29000));
        ws.send(JSON.stringify({id: userId}));
      }
    } 

    ws.addEventListener("open", evt => {
      this.websocket = ws;
      ws.send(JSON.stringify({id: this.userId}));
      ping();
    });

    ws.addEventListener("message", msg => {
      const data: any = JSON.parse(msg.data);
      if(data.error) {
        console.log("Received error from websocket:", data.error);
      }
      if(data.state) {
        const newState: StateMessage = data;
        this.handlers?.onReceiveState(newState.state);
      }
    });

    const startTime = Date.now();
    let rejoined = false;
    const rejoin = async () => {
      if(rejoined) return;
      rejoined = true;
      this.websocket = null;

      // Don't try to reconnect too rapidly.
      const timeSinceLastJoin = Date.now() - startTime;
      if (timeSinceLastJoin < 10000) {
        // Less than 5 seconds elapsed since last join. Pause a bit.
        await new Promise(resolve => setTimeout(resolve, 5000 - timeSinceLastJoin));
      }

      this.joinGame(gameId, userId);
    };   

    ws.addEventListener("close", evt => {
      console.log("Websocket closed, reconnecting: ", evt.code, evt.reason, evt);
      rejoin();
    });
    ws.addEventListener("error", evt => {
      console.log("Websocket error, reconnecting: ", evt);
      rejoin();
    });

    return Promise.resolve();
  }

  leaveAllGames(userId: string): Promise<any> {
    if(this.websocket)
    {
      this.websocket.close();
      this.websocket = null;
    }
    return Promise.resolve();
  }

  pushState(gameId: string, state: SerializedState): Promise<any> {
    if(!this.websocket){
      console.log("Error: no open websocket to push state");
      return Promise.resolve();
    }
    if(!this.userId) {
      console.log("Error: no userid to push state");
      return Promise.resolve();
    }

    const gameState: StateMessage = {id: this.userId, version: state.stageState.sequence, state: state}
    const gameStr = JSON.stringify(gameState);
    this.websocket.send(gameStr);
    return Promise.resolve();
  }
}