import axios from 'axios';
import { HubConnectionBuilder, LogLevel, HubConnection } from "@aspnet/signalr";

export type Handlers = {
  onReceiveState: (state: any) => void;
  onRequestState: () => void;
}

export interface GameServer {
  start(userId: string, handlers: Handlers): Promise<void>;
  joinGame(gameId: string, userId: string): Promise<any>;
  leaveAllGames(userId: string): Promise<any>;
  pushState(gameId: string, state: any): Promise<any>;
}

export class Server implements GameServer {
  private readonly url: string;
  private connection!: HubConnection;

  constructor(url: string) {
    this.url = url;
  }

  private buildConnection(userId: string) {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this.url}/api?userid=${userId}`)
      .configureLogging(LogLevel.Information)
      .build();

    this.connection = connection;
  }

  private setupEventHandlers(handlers: Handlers) { 
    // this.connection.on('ping', newMessage);
    this.connection.on('newState', (state) => handlers.onReceiveState(state));
    this.connection.on('requestState', () => handlers.onRequestState());
    this.connection.onclose(() => console.log('disconnected'));
  }

  public start(userId: string, handlers: Handlers) {
    this.buildConnection(userId);
    this.setupEventHandlers(handlers);
    return this.connection.start();
  }

  public joinGame(gameId: string, userId: string) {
    return axios.post(`${this.url}/api/game/${gameId}/join?userid=${userId}`);
  }

  public leaveAllGames(userId: string) {
    return axios.post(`${this.url}/api/reset/${userId}`);
  }

  public pushState(gameId: string, state: any) {
    return axios.post(`${this.url}/api/game/${gameId}/state`, state);
  }
}

export const ApiBaseUrl = 'https://play-tichu-api.azurewebsites.net';
// export const ApiBaseUrl = 'http://localhost:7071';


