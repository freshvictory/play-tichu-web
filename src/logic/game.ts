import { Player } from './player';
import { Deck } from './deck';
import { Tichu } from './tichu-deck';
import { Card } from './card';

export type Seat = 'north' | 'south' | 'east' | 'west';

export type Trick = [Seat, ReadonlyArray<Card>][];

export type SerializedGame = {
  id: string;
  seats: {[k in Seat]: {
    id: string;
    name: string;
    hand: number[];
  }};
  currentTrick: [string, number[]][];
};

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

  public serialize(): SerializedGame {
    return {
      id: this.id,
      currentTrick: this.currentTrick.map((play) => [play[0] as string, play[1].map((card) => card.serializedId)]),
      seats: {
        north: this.seats.north.serialize(),
        south: this.seats.south.serialize(),
        east: this.seats.east.serialize(),
        west: this.seats.west.serialize(),
      }
    }
  }

  static deserialize(data: SerializedGame) {
    const seats = {
      north: Player.deserialize(data.seats.north),
      south: Player.deserialize(data.seats.south),
      east: Player.deserialize(data.seats.east),
      west: Player.deserialize(data.seats.west),
    };
    const game = new Game(data.id, seats);
    game.currentTrick = data.currentTrick.map((play) => [play[0] as Seat, play[1].map( (cardId) => Tichu[cardId] ) ]) as Trick
    return game;
  }
}
