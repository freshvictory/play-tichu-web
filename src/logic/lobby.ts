import { Game, Seat } from './game';
import { Player, SerializedPlayer } from './player';

export type SerializedLobby = {
  id: string;
  seats: {[k in Seat]: SerializedPlayer | undefined};
};

export class Lobby {
  public readonly id: string;

  public seats: { [k in Seat]: Player | undefined };

  public get full(): boolean {
    return Object.values(this.seats).every((x) => !!x);
  }

  constructor(id: string) {
    this.id = id;
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
    return new Game(this.id, this.seats as { [k in Seat]: Player });
  }
  
  public serialize(): SerializedLobby {
    return {
      id: this.id,
      seats: {
        north: this.seats.north?.serialize(),
        south: this.seats.south?.serialize(),
        east: this.seats.east?.serialize(),
        west: this.seats.west?.serialize(),
      }
    }
  }

  static deserialize(data: SerializedLobby) {
    const lobby = new Lobby(data.id);
    for(const seat in lobby.seats) {
      const dataseat = data.seats[seat as Seat];
      if(dataseat) lobby.join(seat as Seat, dataseat.name, dataseat.id)
    }
    return lobby;
  }

  static getId(): string {
    return Math.ceil(Math.random() * 1000).toString();
  }
}
