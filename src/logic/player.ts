import { Card } from './card';

export class Player {
  public readonly id: string;

  public name: string;

  public hand: Card[];

  public tricks: Card[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.tricks = [];
  }
}
