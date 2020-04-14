import 'mocha';
import { expect } from 'chai';
import { Game } from '@/logic/game';
import { Player } from '@/logic/player';

describe('Game', () => {
  
    describe('#serialize()', () => {
      it('should be able to deserialize the result', () => {
        const game = new Game('testgame', 'tichu', {
            north: new Player('p1', 'p1'),
            south: new Player('p2', 'p2'),
            east: new Player('p3', 'p3'),
            west: new Player('p4', 'p4'),
        });

        const serialized = game.serialize();
        expect(serialized).to.not.be.undefined;
        const deserialized = Game.deserialize(serialized);
  
        expect(deserialized).to.not.be.undefined;
        expect(deserialized.id).to.equal(game.id);
        expect(deserialized.seats.north).to.not.be.undefined;
        expect(deserialized.cardsPassedTo.north).to.be.empty;
      });
    });
});