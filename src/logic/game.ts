import { Player } from './player';
import { Deck } from './deck';
import { Tichu } from './tichu-deck';

export type Seat = 'north' | 'south' | 'east' | 'west';

export class Game {
  public readonly id: string;

  public seats: { readonly [k in Seat]: Player };

  constructor(id: string, seats: { [k in Seat]: Player }) {
    this.id = id;
    this.seats = seats;
    this.deal();
  }

  private deal(): void {
    const seats = Object.keys(this.seats) as Seat[];
    const deal = Deck.deal(Tichu, ...seats);
    
    for (const seat of seats) {
      this.seats[seat].hand = deal[seat].sort((a, b) => a.rank - b.rank);
    }
  }
}
