import {expect} from 'chai';
import Actor from '../../src/sprites/actor';
import GameMock from '../mocks/game.mock';
import sinon from 'sinon';
import {extend} from 'lodash';

const props = {
    attack: 2,
    defence: 3,
    movement: 4,
    health: 10
};

const DiceMock = function DiceMock() {};

describe('Actor', function () {
    let actor;

    beforeEach(function () {
        DiceMock.prototype.throw = sinon.stub();

        Actor.__Rewire__('Dice', DiceMock);
        actor = new Actor(new GameMock());
        extend(actor, props);
    });

    describe('Throwing dices', function () {

        it('should count the number of successes', function () {
            // not success
            DiceMock.prototype.throw.onCall(0).returns(4);
            // success
            DiceMock.prototype.throw.onCall(1).returns(5);

            // number of successes should be one
            expect(actor.throwAttack()).to.equal(1);
        });

        describe('Throwing attack', function () {
            it('should throw as many dices as the attack value is', function () {
                actor.throwAttack();
                // should have thrown 2 times
                expect(DiceMock.prototype.throw.callCount).to.equal(props.attack);
            });
        });

        describe('Throwing defence', function () {
            it('should throw as many dices as the defence value is', function () {
                actor.throwDefence();
                // should have thrown 3 times
                expect(DiceMock.prototype.throw.callCount).to.equal(props.defence);
            });
        });

        describe('Throwing for movement', function () {
            it('should throw as many dices as the movement value is', function () {
                actor.throwMovement();
                // should have thrown 4 times
                expect(DiceMock.prototype.throw.callCount).to.equal(props.movement);
            });
        });
    });

    describe('Damaging the actor', function () {
        it('should reduce health equal to the amount of damage', function () {
            const dmg = 5;
            actor.damage(dmg);
            expect(actor.health).to.equal(props.health - dmg);
        });
    });
});