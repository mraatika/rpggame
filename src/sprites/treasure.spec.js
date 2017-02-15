import Treasure from './treasure';
import SpriteBase from './spritebase';
import Game from '../game/game';

jest.mock('./spritebase');
jest.mock('../game/game');

describe('Treasure', () => {
    let treasure;

    beforeEach(() => {
        treasure = new Treasure(new Game(), 0, 0);
    });

    describe('Initializing', () => {
        it('should be an instance of SpriteBase', () => {
            expect(treasure).toBeInstanceOf(SpriteBase);
        });
    });
});
