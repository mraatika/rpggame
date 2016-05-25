import {expect} from 'chai';
import Player from '../../src/sprites/player';
import Actor from '../../src/sprites/actor';
import Purse from '../../src/classes/purse';
import GameMock from '../mocks/game.mock';
import gameConfig from 'json!../../src/assets/config/gameconfig.json';
import sinon from 'sinon';

Actor.__Rewire__('Dice', class DiceMock {
    throw() { return 6; }
});

describe('Player', () => {
    let player;

    beforeEach(function() {
        player = new Player(new GameMock(), 0, 0);
        sinon.stub(player.purse, 'getEquippedItems');
    });

    afterEach(function() {

    });

    describe('Initializing', function () {
        it('should be an instance of Actor', function () {
            expect(player).to.be.instanceof(Actor);
        });

        it('should have a purse', function () {
            expect(player.purse).to.be.instanceof(Purse);
        });

        it('should have initial health', function () {
            expect(player.health).to.equal(gameConfig.player.initialHealth);
        });
    });

    describe('Calculating attack', function () {
        it('should have initial attack value', function () {
            expect(player.attack).to.equal(gameConfig.player.initialAttack);
        });

        it('should add attack modifiers from equipment', function () {
            player.purse.getEquippedItems.returns([
                { attackModifier: 1 },
                { attackModifier: 2 }
            ]);

            expect(player.attack).to.equal(gameConfig.player.initialAttack + 3);
        });
    });

    describe('Calculating defence', function () {
        it('should have initial defence value', function () {
            expect(player.defence).to.equal(gameConfig.player.initialDefence);
        });

        it('should add attack modifiers from equipment', function () {
            player.purse.getEquippedItems.returns([
                { defenceModifier: 2 },
                { defenceModifier: 3 }
            ]);

            expect(player.defence).to.equal(gameConfig.player.initialDefence + 5);
        });
    });

    describe('Calculating movement', function () {
        it('should have initial movement value', function () {
            expect(player.movement).to.equal(gameConfig.player.initialMovement);
        });

        it('should add attack modifiers from equipment', function () {
            player.purse.getEquippedItems.returns([
                { movementModifier: -3 }
            ]);

            expect(player.movement).to.equal(gameConfig.player.initialMovement + -3);
        });
    });

    describe('Throwing for attack', function () {
        it('should throw as many dices as attack value is', function () {
            player.purse.getEquippedItems.returns([
                { attackModifier: 6 }
            ]);

            expect(player.throwAttack()).to.equal(6 + gameConfig.player.initialAttack);
        });
    });

    describe('Throwing for defence', function () {
        it('should throw as many dices as defence value is', function () {
            player.purse.getEquippedItems.returns([
                { defenceModifier: 6 }
            ]);

            expect(player.throwDefence()).to.equal(6 + gameConfig.player.initialDefence);
        });
    });

    describe('Throwing for movement', function () {
        it('should throw as many dices as movement value is and calculate sum of dice results', function () {
            player.purse.getEquippedItems.returns([
                { movementModifier: 6 }
            ]);

            expect(player.throwMovement()).to.equal((6 + gameConfig.player.initialMovement) * 6);
        });
    });

    describe('Damaging the player', function () {
        it('should reduce health equal to the amount of damage', function () {
            const dmg = 4;
            player.damage(dmg);
            expect(player.health).to.equal(gameConfig.player.initialHealth - dmg);
        });
    });
});