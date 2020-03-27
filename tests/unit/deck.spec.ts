import 'mocha';
import { expect } from 'chai';
import { Card } from '@/logic/card';
import { Deck } from '@/logic/deck';

const baseDeck: ReadonlyArray<Card> = [
  {
    id: '3#spade',
    name: 'Three of spades',
    value: 0,
    rank: 0,
    suit: 'spade',
    serializedId: 0
  },
  {
    id: '10#heart',
    name: 'Ten of hearts',
    value: 0,
    rank: 0,
    suit: 'heart',
    serializedId: 1
  },
  {
    id: 'J#club',
    name: 'Jack of clubs',
    value: 0,
    rank: 0,
    suit: 'club',
    serializedId: 2
  },
  {
    id: 'dragon',
    name: 'Dragon',
    value: 0,
    rank: 0,
    suit: 'special',
    serializedId: 3
  }
];

const largeDeck: ReadonlyArray<Card> = [
  {
    id: '3#spade',
    name: 'Three of spades',
    value: 0,
    rank: 0,
    suit: 'spade',
    serializedId: 0
  },
  {
    id: '10#heart',
    name: 'Ten of hearts',
    value: 0,
    rank: 0,
    suit: 'heart',
    serializedId: 1
  },
  {
    id: 'J#club',
    name: 'Jack of clubs',
    value: 0,
    rank: 0,
    suit: 'club',
    serializedId: 2
  },
  {
    id: 'dragon',
    name: 'Dragon',
    value: 0,
    rank: 0,
    suit: 'special',
    serializedId: 3
  },
  {
    id: '4#diamonds',
    name: 'Four of diamonds',
    value: 0,
    rank: 0,
    suit: 'diamond',
    serializedId: 4
  },
  {
    id: 'K#clubs',
    name: 'King of clubs',
    value: 0,
    rank: 0,
    suit: 'club',
    serializedId: 5
  },
  {
    id: '2#spade',
    name: 'Two of spades',
    value: 0,
    rank: 0,
    suit: 'spade',
    serializedId: 6
  },
  {
    id: '7#club',
    name: 'Seven of clubs',
    value: 0,
    rank: 0,
    suit: 'club',
    serializedId: 7
  }
];

describe('Deck', () => {
  
  describe('#shuffle()', () => {
    it('should return an array of the same length', () => {
      const shuffled = Deck.shuffle(baseDeck);

      expect(shuffled).to.exist;
      expect(shuffled.length).to.equal(baseDeck.length);
    });
  });


  describe('#deal', () => {

    it('should fail if deck cannot be dealt evenly', () => {
      expect(Deck.deal.bind(Deck, baseDeck, 'player1', 'player2', 'player3'))
        .to.throw();
    });


    it('should not fail if deck can be dealt evenly', () => {
      expect(Deck.deal.bind(Deck, baseDeck, 'player1', 'player2'))
        .to.not.throw();
    });


    it('should deal to each player', () => {
      const players = ['player1', 'player2'];
      const deal = Deck.deal(baseDeck, ...players);

      expect(Object.keys(deal).length).to.equal(players.length);
    });


    it ('should deal evenly to each player', () => {
      const players = ['player1', 'player2'];
      const deal = Deck.deal(baseDeck, ...players);

      for (const player in deal) {
        expect(deal[player].length).to.equal(baseDeck.length / players.length);
      }
    });


    it('should deal different cards to each player', () => {
      const players = ['player1', 'player2'];
      const deal = Deck.deal(baseDeck, ...players);

      for (const card1 of deal['player1']) {
        for (const card2 of deal['player2']) {
          expect(card1.id).to.not.eql(card2.id);
        }
      }
    });

  });


  describe('#dealSplit', () => {

    it('should fail if deck cannot be dealt evenly', () => {
      expect(Deck.dealSplit.bind(
        Deck,
        baseDeck,
        [3, 3],
        'player1',
        'player2'
      )).to.throw();
    });


    it('should deal the correct cards to all players', () => {
      const players = ['player1', 'player2'];
      const splits = [[3, 1], [2, 2], [1, 3], [1, 2, 1]];

      for (const split of splits) {
        const deal = Deck.dealSplit(
          largeDeck,
          split,
          'player1',
          'player2'
        );

        for (const player of players) {
          expect(deal[player].length).to.equal(split.length);
          
          for (let i = 0; i < split.length; i++) {
            expect(deal[player][i].length).to.equal(split[i]);
          }
        }
      }

      
    });

  });

});
