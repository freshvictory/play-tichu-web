import { Player, SerializedPlayer } from './player';
import { Deck } from './deck';
import { Tichu } from './tichu-deck';
import { Card } from './card';

export type Seat = 'north' | 'south' | 'east' | 'west';

export type SeatMap<T> = { [key in Seat]: T };

export type Trick = [Seat, ReadonlyArray<Card>][];

export type SerializedGame = {
  id: string;
  lastAction: string;
  seats: SeatMap<SerializedPlayer>;
  cardsPassedTo: SeatMap<number[]>;
  currentTrick: [string, number[]][];
  dealCount: number;
  sequence: number;
};

export class Game {
  public readonly id: string;

  public lastAction: string;

  public readonly seats: SeatMap<Player>;

  public cardsPassedTo: SeatMap<Set<Card>>;

  public currentTrick: Trick;

  public dealCount: number;
  public sequence: number;
  
  public get allCardsPassed(): boolean {
    let passCount = 0;
    for(const seat in this.cardsPassedTo){
      passCount += this.cardsPassedTo[seat as Seat].size;
    }
    return passCount === 12;
  }

  constructor(id: string, seats: SeatMap<Player>) {
    this.id = id;
    this.lastAction = 'new game';
    this.seats = seats;
    this.cardsPassedTo = Game.emptyCardsPassed;
    this.currentTrick = [];
    this.dealCount = 0;
    this.sequence = 0;
  }

  public play(seat: Seat, cards: Card[]): void {
    this.lastAction = this.seats[seat].name + ' plays';
    for (const card of cards) {
      this.seats[seat].hand.delete(card);
    }

    this.currentTrick.push([seat, cards.sort((c0, c1) => c0.rank - c1.rank)]);
  }

  public take(seat: Seat, trick: Trick): void {
    this.lastAction = this.seats[seat].name + ' takes trick';
    this.seats[seat].tricks.push(...trick.flatMap((play) => play[1]));
    this.currentTrick = [];
  }

  public deal(): void {
    this.dealCount++;
    this.lastAction = 'new deal';
    const seats = Object.keys(this.seats) as Seat[];
    const deal = Deck.deal(Tichu, ...seats);
    this.currentTrick = []
    this.cardsPassedTo = Game.emptyCardsPassed;
    
    for (const seat of seats) {
      const player = this.seats[seat];
      player.secondDeal = new Set(deal[seat].slice(8));
      player.hand = new Set(deal[seat].sort((a, b) => a.rank - b.rank));
      player.passedCards = false;
      player.tricks = [];
    }
  }

  public pass<S extends Seat, T extends Exclude<Seat, S>>(
    fromSeat: S,
    to: Omit<SeatMap<Card>, S>
  ) {
    this.lastAction = 'pass from '+ this.seats[fromSeat].name;
    for(const seat in to) {
      const card = to[seat as T];
      this.seats[fromSeat].hand.delete(card)
      this.seats[fromSeat].passedCards = true;
      this.cardsPassedTo[seat as T].add(card);
    }
  }

  public pickUpPassedCards() {
    this.lastAction = 'everybody picks up';
    for(const seat in this.seats) {
      for(const card of this.cardsPassedTo[seat as Seat]) {
        this.seats[seat as Seat].hand.add(card)
      }
      this.seats[seat as Seat].hand = new Set(
        [...this.seats[seat as Seat].hand]
        .sort((a, b) => a.rank - b.rank)
      );
      this.cardsPassedTo[seat as Seat].clear();
    }
  }

  public score(): SeatMap<{ tricks: number; hand: number }> {
    const getTrickScore = (seat: Seat) => {
      return this.seats[seat]
        .tricks
        .reduce((n, c) => n + c.value, 0);
    }

    const getHandScore = (seat: Seat) => {
      return [...this.seats[seat].hand]
        .reduce((n, c) => n + c.value, 0);
    }

    return {
      north: { tricks: getTrickScore('north'), hand: getHandScore('north') },
      east: { tricks: getTrickScore('east'), hand: getHandScore('east') },
      south: { tricks: getTrickScore('south'), hand: getHandScore('south') },
      west: { tricks: getTrickScore('west'), hand: getHandScore('west') }
    };
  }

  public serialize(): SerializedGame {
    const game = {seats: {}, cardsPassedTo: {}, lastAction: this.lastAction} as SerializedGame;
    for(const seat in this.seats) {
      game.seats[seat as Seat] = this.seats[seat as Seat].serialize();
      game.cardsPassedTo[seat as Seat] = Array.from(this.cardsPassedTo[seat as Seat]).map((card) => card.serializedId);
    }
    game.id = this.id;
    game.currentTrick = this.currentTrick.map((play) => [play[0] as string, play[1].map((card) => card.serializedId)]);
    game.dealCount = this.dealCount;
    game.sequence = this.sequence+1;
    return game;
  }

  static deserialize(data: SerializedGame) {
    const seats = {
      north: Player.deserialize(data.seats.north),
      south: Player.deserialize(data.seats.south),
      east: Player.deserialize(data.seats.east),
      west: Player.deserialize(data.seats.west),
    };
    const game = new Game(data.id, seats);
    for(const seat in data.seats) {
      data.cardsPassedTo[seat as Seat].forEach(cardId => 
        game.cardsPassedTo[seat as Seat].add(Tichu[cardId]));
    }
    game.currentTrick = data.currentTrick.map((play) => [play[0] as Seat, play[1].map( (cardId) => Tichu[cardId] ) ]) as Trick
    game.dealCount = data.dealCount;
    game.sequence = data.sequence;
    game.lastAction = data.lastAction; // ?
    return game;
  }

  static get emptyCardsPassed(): SeatMap<Set<Card>> {
    return {
      north: new Set<Card>(),
      south: new Set<Card>(),
      east: new Set<Card>(),
      west: new Set<Card>(),
    };
  }
}
