import { Game, Seat } from './game';
import { Player } from './player';

export class Lobby {
  public readonly id: string;

  public seats: { [k in Seat]: Player | undefined };

  public get full(): boolean {
    return Object.values(this.seats).every((x) => !!x);
  }

  constructor(name: string) {
    this.id = Lobby.getId();
    this.seats = {
      north: new Player(Lobby.getId(), name),
      south: undefined,
      east: undefined,
      west: undefined,
    };
  }

  public join(seat: Seat, name: string): void {
    this.seats[seat] = new Player(Lobby.getId(), name);
  }

  public start(): Game {
    return new Game(this.id, this.seats as { [k in Seat]: Player });
  }

  private static getId(): string {
    return Math.ceil(Math.random() * 100).toString();
  }
}
