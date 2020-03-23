import { Player } from './player';

export type Seat = 'north' | 'south' | 'east' | 'west';

export class Game {
  public readonly id: string;

  public seats: { readonly [k in Seat]: Player };

  constructor(id: string, seats: { [k in Seat]: Player }) {
    this.id = id;
    this.seats = seats;
  }
}
