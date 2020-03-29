import { Card } from './card';
import { Tichu } from './tichu-deck';

export type SerializedPlayer = {
  id: string;
  name: string;
  hand: number[];
  secondDeal: number[];
  tricks: number[];
}

export class Player {
  public readonly id: string;

  public name: string;

  public hand: Set<Card>;
  
  public secondDeal: Set<Card>;

  public tricks: Card[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hand = new Set([]);
    this.secondDeal = new Set([]);
    this.tricks = [];
  }

  public serialize(): SerializedPlayer {
    return {
      id: this.id,
      name: this.name,
      hand: Array.from(this.hand).map((card) => card.serializedId),
      secondDeal: Array.from(this.secondDeal).map((card) => card.serializedId),
      tricks: this.tricks.map((card) => card.serializedId),
    }
  }

  static deserialize(data: SerializedPlayer) {
    const player = new Player(data.id, data.name);
    player.hand = new Set(data.hand.map((cardId) => Tichu[cardId]));
    player.secondDeal = new Set(data.secondDeal.map((cardId) => Tichu[cardId]));
    player.tricks = data.tricks.map((id) => Tichu[id]);
    return player;
  }
}
