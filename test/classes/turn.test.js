import {expect} from 'chai';
import _ from 'lodash';
import sinon from 'sinon';
import Turn from '../../src/classes/turn';
import Actor from '../../src/sprites/actor';
import SignalMock from '../mocks/signal.mock';
import MovementStrategyMock from '../mocks/movementstrategy.mock';
import CommandTypes from '../../src/commands/commandtypes';

const MoverMock = function() {};
MoverMock.prototype.moveTo = sinon.stub();

describe('Turn', function () {

    beforeEach(function () {
        Turn.__Rewire__('Signal', SignalMock);
        Turn.__Rewire__('Mover', MoverMock);
    });

    describe('Initialization', function () {
        it('should require actor to be an instance of Actor class', function () {
            expect(() => {
                new Turn({}, {});
            }).to.throw('InvalidArgumentsException: Actor invalid or missing!');

            expect(() => {
                new Turn({}, {}, {});
            }).to.throw('InvalidArgumentsException: Actor invalid or missing!');

            expect(() => {
                new Turn({}, {}, new Actor());
            }).not.to.throw();
        });

        it('should create a queue from turn phases', function () {
            const turn = new Turn({}, {}, new Actor());
            const phases = _.toArray(Turn.Phases);
            let i = 0;

            expect(turn.phases.size()).to.equal(_.size(Turn.Phases));

            for (let phase of turn.phases) {
                expect(phase).to.equal(phases[i++]);
            }
        });
    });

    describe('Starting a phase', function () {
        let turn;
        let actor;
        let movementStrategy;

        beforeEach(function () {
            actor = new Actor();
            movementStrategy = new MovementStrategyMock();
            sinon.stub(actor, 'getMovementStrategy').returns(function() { return movementStrategy; });
            sinon.stub(actor, 'throwMovement');
            turn = new Turn({}, {}, actor);
            sinon.stub(turn, '_markEndPoint');
        });

        afterEach(() => {
            turn.dispose();
        });

        it('should call turnDone if phases queue is empty', function () {
            turn.phases.empty();

            turn.start();

            expect(turn.turnDone.dispatch.called).to.be.ok;
        });

        describe('Move phase', function () {
            it('should start move phase by getting a movement strategy', function () {
                const throwResult = 3;
                actor.throwMovement.returns(throwResult);

                turn.start();

                expect(actor.getMovementStrategy.calledWith(turn.allActors)).to.be.ok;
            });

            it('should reduce movement points equal to path length - 1 (start pos) after move command', function () {
                const throwResult = 5;
                const path = [{}, {}, {}];
                const command = { type: CommandTypes.MOVE_COMMAND, props: { path: path }};

                actor.throwMovement.returns(throwResult);
                movementStrategy.moveDone.add.callsArgWith(0, command);

                turn.start();

                expect(turn.movementPoints).to.equal(throwResult - path.length + 1);
            });

            it('should not move to the next phase when movement points are still available ', function () {
                const throwResult = 4;
                const path = [{}, {}, {}];
                const command = { type: CommandTypes.MOVE_COMMAND, props: { path: path }};

                actor.throwMovement.returns(throwResult);

                movementStrategy.moveDone.add.callsArgWith(0, command);
                turn._mover.moveTo.callsArg(1);

                turn.start();

                expect(turn.currentPhase).to.equal(Turn.Phases.PHASE_MOVE);

                // reduce last two points
                movementStrategy.moveDone.add.callArgWith(0, command);

                expect(turn.currentPhase).to.equal(Turn.Phases.PHASE_ACTION);
            });

            it('should end move phase if there\'s isFinished flag in the command\'s props', function () {
                const throwResult = 4;
                const path = [{}, {}];
                const command = { type: CommandTypes.MOVE_COMMAND, props: { path: path, isMovementFinished: true }};

                actor.throwMovement.returns(throwResult);
                movementStrategy.moveDone.add.callsArgWith(0, command);
                turn._mover.moveTo.callsArg(1);

                turn.start();

                expect(turn.currentPhase).to.equal(Turn.Phases.PHASE_ACTION);
            });

            it('should reject command if there aren\'t enough movement points available for that command', function () {
                const throwResult = 3;
                const path = [{x:1}, {x:2}, {x:3}, {x:4}, {x:5}];
                const command = { type: CommandTypes.MOVE_COMMAND, props: { path: path, isMovementFinished: false }};

                movementStrategy.moveDone.add.callsArgWith(0, command);

                actor.throwMovement.returns(throwResult);

                turn.start();

                expect(turn.movementPoints).to.equal(throwResult);

                expect(turn.currentPhase).to.equal(Turn.Phases.PHASE_MOVE);
            });
        });
    });
});