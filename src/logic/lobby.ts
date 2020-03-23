import { Game, Seat } from './game';
import { Player } from './player';

export class Lobby {
  public readonly id: string;

  public seats: { [k in Seat]: Player | undefined };

  constructor(name: string) {
    this.id = this.getId();
    this.seats = {
      north: new Player(this.getId(), name),
      south: undefined,
      east: undefined,
      west: undefined,
    };
  }

  public join(seat: Seat, playerId: string, name: string): void {
    this.seats[seat] = new Player(playerId, name);
  }

  public start(): Game {
    return new Game(this.id, this.seats as { [k in Seat]: Player });
  }

  private getId(): string {
    return Math.ceil(Math.random() * 100).toString();
  }
}
