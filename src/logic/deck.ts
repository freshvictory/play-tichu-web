import { Card } from './card';

export class Deck {
  static deal(
    deck: ReadonlyArray<Card>,
    ...players: string[]
  ): { [k: string]: Card[] } {
    if (deck.length % players.length !== 0) {
      throw new Error(`Cannot deal evenly to ${players.length} players.`);
    }

    const dealt: { [k: string]: Card[] } = {};

    const shuffled = Deck.shuffle(deck);

    let offset = 0;
    for (const player of players) {
      const end = offset + deck.length / players.length;
      dealt[player] = shuffled.slice(offset, end);
      offset = end;
    }

    return dealt;
  }


  static dealSplit(
    deck: ReadonlyArray<Card>,
    nums: number[],
    ...players: string[]
  ): { [k: string]: Card[][] } {
    if (nums.reduce((i, j) => i + j, 0) * players.length !== deck.length) {
      throw new Error(
        `Not enough cards left to deal ${nums} cards to ${players.length} players.`
      );
    }

    const deal = Deck.deal(deck, ...players);
    const splitDeal: { [k: string]: Card[][] } = {};

    for (const player in deal) {
      const playerDeal = [];
      const fullDeal = deal[player];

      for (const n of nums) {
        playerDeal.push(fullDeal.splice(fullDeal.length - n));
      }

      splitDeal[player] = playerDeal;
    }

    return splitDeal;
  }


  /**
   * Fisher-Yates inside-out shuffle.
   */
  static shuffle(deck: ReadonlyArray<Card>): ReadonlyArray<Card> {
    const shuffled: Card[] = [];

    for (let i = 0; i < deck.length; i++) {
      const j = Math.floor(Math.random() * Math.floor(i));

      if (j !== i) {
        shuffled[i] = shuffled[j];
      }

      shuffled[j] = deck[i];
    }

    return shuffled;
  }
}
