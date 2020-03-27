import { Player } from './player';
import { Deck } from './deck';
import { Tichu } from './tichu-deck';
import { Card } from './card';

export type Seat = 'north' | 'south' | 'east' | 'west';

export type Trick = [Seat, ReadonlyArray<Card>][];

export class Game {
  public readonly id: string;

  public readonly seats: { readonly [k in Seat]: Player };

  public currentTrick: Trick;

  constructor(id: string, seats: { [k in Seat]: Player }) {
    this.id = id;
    this.seats = seats;
    this.currentTrick = [];
  }

  public play(seat: Seat, cards: Card[]): void {
    for (const card of cards) {
      this.seats[seat].hand.delete(card);
    }

    this.currentTrick.push([seat, cards.sort((c0, c1) => c0.rank - c1.rank)]);
  }

  public take(seat: Seat, trick: Trick): void {
    this.seats[seat].tricks.push(...trick.flatMap((play) => play[1]));
    this.currentTrick = [];
  }

  public deal(): void {
    const seats = Object.keys(this.seats) as Seat[];
    const deal = Deck.deal(Tichu, ...seats);
    
    for (const seat of seats) {
      this.seats[seat].hand = new Set(deal[seat].sort((a, b) => a.rank - b.rank));
    }
  }

  public serialize() {
    return {
      id: this.id,
      currentTrick: this.currentTrick.map((play) => (play[0], play[1].map((card) => card.id))),
      seats: this.seats
    }
  }
}
