import Player from './player';
import Actor from './actor';
import Purse from '../classes/purse';
import gameConfig from '../config/gameconfig.json';
import Dice from '../classes/dice';
import Game from '../game/game';

jest.mock('./spritebase');
jest.mock('../classes/dice');
jest.mock('../classes/purse');
jest.mock('../game/game');

Dice.prototype.throw = jest.fn(() => 6);

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player(new Game(), 0, 0);
        player.purse.getEquippedItems.mockReturnValue([]);
    });

    describe('Initializing', () => {
        it('should be an instance of Actor', () => {
            expect(player).toBeInstanceOf(Actor);
        });

        it('should have a purse', () => {
            expect(player.purse).toBeInstanceOf(Purse);
        });

        it('should have initial health', () => {
            expect(player.health).toBe(gameConfig.player.initialHealth);
        });

        it('should have a default name if none give', () => {
            expect(player.name).toBe(gameConfig.player.name);
        });

        it('should take name in the props object', () => {
            const props = { name: 'KILLER QUEEN' };
            const p = new Player(new Game(), 0, 0, props);
            expect(p.name).toBe(props.name);
        });
    });

    describe('Calculating attack', () => {
        it('should have initial attack value', () => {
            expect(player.attack).toBe(gameConfig.player.initialAttack);
        });

        it('should add attack modifiers from equipment', () => {
            player.purse.getEquippedItems.mockReturnValueOnce([
                { attackModifier: 1 },
                { attackModifier: 2 },
            ]);

            expect(player.attack).toBe(gameConfig.player.initialAttack + 3);
        });
    });

    describe('Calculating defence', () => {
        it('should have initial defence value', () => {
            expect(player.defence).toBe(gameConfig.player.initialDefence);
        });

        it('should add attack modifiers from equipment', () => {
            player.purse.getEquippedItems.mockReturnValueOnce([
                { defenceModifier: 2 },
                { defenceModifier: 3 },
            ]);

            expect(player.defence).toBe(gameConfig.player.initialDefence + 5);
        });
    });

    describe('Calculating movement', () => {
        it('should have initial movement value', () => {
            expect(player.movement).toBe(gameConfig.player.initialMovement);
        });

        it('should add attack modifiers from equipment', () => {
            player.purse.getEquippedItems.mockReturnValueOnce([
                { movementModifier: -3 },
            ]);

            expect(player.movement).toBe(gameConfig.player.initialMovement + -3);
        });
    });

    describe('Throwing for attack', () => {
        it('should throw as many dices as attack value is', () => {
            player.purse.getEquippedItems.mockReturnValueOnce([
                { attackModifier: 6 },
            ]);

            expect(player.throwAttack()).toBe(6 + gameConfig.player.initialAttack);
        });
    });

    describe('Throwing for defence', () => {
        it('should throw as many dices as defence value is', () => {
            player.purse.getEquippedItems.mockReturnValueOnce([
                { defenceModifier: 6 },
            ]);

            expect(player.throwDefence()).toBe(6 + gameConfig.player.initialDefence);
        });
    });

    describe('Throwing for movement', () => {
        it('should throw as many dices as movement value is and calculate sum of dice results', () => {
            player.purse.getEquippedItems.mockReturnValueOnce([
                { movementModifier: 6 },
            ]);

            expect(player.throwMovement()).toBe((6 + gameConfig.player.initialMovement) * 6);
        });
    });
});
