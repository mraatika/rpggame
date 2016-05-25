import {expect} from 'chai';
import Treasure from '../../src/sprites/treasure';
import SpriteBase from '../../src/sprites/spritebase';
import GameMock from '../mocks/game.mock';

describe('Treasure', () => {

    let treasure;

    beforeEach(function () {
        treasure = new Treasure(new GameMock(), 0, 0);
    });

    describe('Initializing', function () {
        it('should be an instance of SpriteBase', function () {
            expect(treasure).to.be.instanceof(SpriteBase);
        });
    });
});