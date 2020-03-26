import { Player } from './player';
import { Deck } from './deck';
import { Tichu } from './tichu-deck';
import { Card } from './card';

export type Seat = 'north' | 'south' | 'east' | 'west';

export class Game {
  public readonly id: string;

  public readonly seats: { readonly [k in Seat]: Player };

  public readonly currentTrick: [Seat, ReadonlyArray<Card>][]

  constructor(id: string, seats: { [k in Seat]: Player }) {
    this.id = id;
    this.seats = seats;
    this.currentTrick = [];
    this.deal();
  }

  public play(seat: Seat, cards: Card[]): void {
    for (const card of cards) {
      this.seats[seat].hand.delete(card);
    }

    this.currentTrick.push([seat, cards.sort((c0, c1) => c0.rank - c1.rank)]);
  }

  private deal(): void {
    const seats = Object.keys(this.seats) as Seat[];
    const deal = Deck.deal(Tichu, ...seats);
    
    for (const seat of seats) {
      this.seats[seat].hand = new Set(deal[seat].sort((a, b) => a.rank - b.rank));
    }
  }
}
