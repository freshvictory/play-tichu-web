import { Game, Seat, SeatMap, GameType } from './game';
import { Player, SerializedPlayer } from './player';

export type SerializedLobby = {
  id: string;
  type: GameType;
  seats: SeatMap<SerializedPlayer | undefined>;
};

export class Lobby {
  public readonly id: string;
  public readonly type: GameType;

  public seats: SeatMap<Player | undefined>;

  public get full(): boolean {
    return Object.values(this.seats).every((x) => !!x);
  }

  constructor(id: string, type: GameType) {
    this.id = id;
    this.type = type;
    this.seats = {
      north: undefined,
      south: undefined,
      east: undefined,
      west: undefined,
    };
  }

  public join(seat: Seat, name: string, id: string): void {
    this.seats[seat] = new Player(id, name);
  }

  public start(): Game {
    return new Game(this.id, this.type, this.seats as SeatMap<Player>);
  }
  
  public serialize(): SerializedLobby {
    return {
      id: this.id,
      type: this.type,
      seats: {
        north: this.seats.north?.serialize(),
        south: this.seats.south?.serialize(),
        east: this.seats.east?.serialize(),
        west: this.seats.west?.serialize(),
      }
    }
  }

  static deserialize(data: SerializedLobby) {
    const lobby = new Lobby(data.id, data.type);
    for(const seat in lobby.seats) {
      const dataseat = data.seats[seat as Seat];
      if(dataseat) lobby.join(seat as Seat, dataseat.name, dataseat.id)
    }
    return lobby;
  }

  static getId(): string {
    return Date.now().toString(35).slice(-6).replace('0','z').toUpperCase();
  }
}
