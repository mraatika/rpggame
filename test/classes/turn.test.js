import {expect} from 'chai';
import _ from 'lodash';
import sinon from 'sinon';
import Turn from '../../src/common/turn';
import Actor from '../../src/sprites/actor';
import Treasure from '../../src/sprites/treasure';
import SignalMock from '../mocks/signal.mock';
import Commands from '../../src/commands/commands';
import EventTypes from '../../src/common/eventtypes';
import TurnPhases from '../../src/common/turnphases';
import MovementAction from '../../src/actions/movementaction';
import AttackAction from '../../src/actions/attackaction';
import EndActionAction from '../../src/actions/endactionaction';
import LootAction from '../../src/actions/lootaction';

const CommandDispatcherMock = new SignalMock();
const EventDispatcherMock = new SignalMock();

describe('Turn', function () {

    beforeEach(function () {
        Turn.__Rewire__('Signal', SignalMock);
        Turn.__Rewire__('CommandDispatcher', CommandDispatcherMock);
        Turn.__Rewire__('EventDispatcher', EventDispatcherMock);
    });

    afterEach(() => {
        EventDispatcherMock.dispatch.reset();
        CommandDispatcherMock.add.reset();
    });

    describe('Initialization', function () {
        it('should require actor to be an instance of Actor class', function () {
            expect(() => {
                new Turn({}, {});
            }).to.throw('InvalidArgumentsException: Actor invalid or missing!');

            expect(() => {
                new Turn({}, new Actor(), []);
            }).not.to.throw();
        });

        it('should create a queue from turn phases', function () {
            const turn = new Turn({}, new Actor(), []);
            const phases = _.toArray(TurnPhases);
            let i = 0;

            expect(turn.phases.size()).to.equal(_.size(TurnPhases));

            for (let phase of turn.phases) {
                expect(phase).to.equal(phases[i++]);
            }
        });
    });

    describe('Starting a phase', function () {
        let turn;
        let actor;

        beforeEach(function () {
            actor = new Actor();
            sinon.stub(actor, 'throwMovement');
            turn = new Turn({}, actor, [ actor ]);
        });

        afterEach(() => {
            turn.dispose();
        });

        it('should be done if phases queue is empty', function () {
            turn.phases.empty();

            turn.start();

            expect(turn.isDone).to.be.ok;
        });

        it('should not dispatch a turn start event if phases is empty', function () {
            turn.phases.empty();

            turn.start();

            expect(EventDispatcherMock.dispatch.calledWith(EventTypes.START_TURN_EVENT)).not.to.be.ok;
        });

        it('should dispatch a turn end event if current turn is done', function () {
            turn.phases.empty();

            turn.start();

            expect(EventDispatcherMock.dispatch.calledWith(EventTypes.END_TURN_EVENT)).to.be.ok;
        });

        it('should set the currentPhase when started', function () {
            const firstPhase = turn.phases.peek();

            turn.start();

            expect(turn.currentPhase).to.equal(firstPhase);
        });

        it('should dispatch a turn start event when started', function () {
            turn.start();
            expect(EventDispatcherMock.dispatch.calledWith(EventTypes.START_TURN_EVENT)).to.be.ok;
        });

        it('should ask the actor to throw for movement', function () {
            turn.start();
            expect(actor.throwMovement.called).to.be.ok;
            expect(EventDispatcherMock.dispatch.calledWith(EventTypes.ATTRIBUTE_CHANGE_EVENT)).to.be.ok;
        });
    });

    describe('Adding actions from commands', function () {
        let turn;
        let actor;
        let otherActor;

        beforeEach(function () {
            actor = new Actor();
            otherActor = new Actor();

            sinon.stub(actor, 'throwMovement');
            turn = new Turn({}, actor, [ actor ]);
            turn.start();
        });

        it('should not add actions to command\'s actor is other than turn\'s actor', function () {
            CommandDispatcherMock.add.callArgOnWith(0, turn, new Commands.MoveCommand({ actor: otherActor }));
            expect(turn.actions.size()).to.equal(0);
        });

        it('should add a move action to the actions queue if a move command is received', function () {
            CommandDispatcherMock.add.callArgOnWith(0, turn, new Commands.MoveCommand({ actor }));
            expect(turn.actions.size()).to.equal(1);
            expect(turn.actions.peek()).to.be.instanceof(MovementAction);
        });

        it('should not add a movement action if it\'s not move phase', function () {
            turn.currentPhase = TurnPhases.ACTION_PHASE;
            CommandDispatcherMock.add.callArgOnWith(0, turn, new Commands.MoveCommand({ actor }));
            expect(turn.actions.size()).to.equal(0);
        });

        it('should add an attack command to the actions queue if an attack command is received', function () {
            turn.currentPhase = TurnPhases.ACTION_PHASE;
            CommandDispatcherMock.add.callArgOnWith(0, turn, new Commands.AttackCommand({ actor, target: otherActor }));
            expect(turn.actions.size()).to.equal(1);
            expect(turn.actions.peek()).to.be.instanceof(AttackAction);
        });

        it('should not add an attack action if it\'s not action phase', function () {
            CommandDispatcherMock.add.callArgOnWith(0, turn, new Commands.AttackCommand({ actor, target: otherActor }));
            expect(turn.actions.size()).to.equal(0);
        });

        it('should add a loot action to the actions queue if a loot command is received', function () {
            CommandDispatcherMock.add.callArgOnWith(0, turn, new Commands.LootCommand({ actor, treasure: new Treasure() }));
            expect(turn.actions.size()).to.equal(1);
            expect(turn.actions.peek()).to.be.instanceof(LootAction);
        });

        it('should add an end action action to the actions queue if a loot command is received', function () {
            CommandDispatcherMock.add.callArgOnWith(0, turn, new Commands.EndActionCommand({ actor }));
            expect(turn.actions.size()).to.equal(1);
            expect(turn.actions.peek()).to.be.instanceof(EndActionAction);
        });
    });

    describe('Updating turn', function () {
        let turn;
        let actor;

        beforeEach(function () {
            actor = new Actor();
            actor.alive = true;
            sinon.stub(actor, 'throwMovement');
            turn = new Turn({}, actor, [ actor ]);
            turn.start();
        });

        it('should be done if the actor is not alive', function () {
            actor.alive = false;
            turn.update();
            expect(turn.isDone).to.be.ok;
        });

        it('should ask for action if there\'s no action and npc actor is in turn', function () {
            actor.isPlayerControlled = false;
            sinon.spy(actor, 'decideAction');

            turn.update();

            expect(actor.decideAction.called).to.be.ok;
        });

        it('should not execute action if there is a pending action in the queue', function () {
            const action = new AttackAction({});
            action.pending = true;

            sinon.spy(action, 'execute');
            turn.actions.add(action);

            turn.update();

            expect(action.execute.called).not.to.be.ok;
        });

        it('should dispatch an end action event when a action is successfully resolved', function () {
            const action = new AttackAction({});
            sinon.stub(action, 'execute').returns(true);
            action.isDone = true;

            turn.actions.add(action);

            turn.update();

            expect(EventDispatcherMock.dispatch.calledWith(EventTypes.END_ACTION_EVENT)).to.be.ok;
        });

        it('should remove the action from the actions queue after it\'s successfully resolved', function () {
            const action = new AttackAction({});
            sinon.stub(action, 'execute').returns(true);
            action.isDone = false;

            turn.actions.add(action);

            turn.update();

            expect(turn.actions.peek()).not.to.be.ok;
        });

        it('should start the next phase when an action is successfully resolved', function () {
            const nextPhase = turn.phases.peek();
            const action = new AttackAction({});
            sinon.stub(action, 'execute').returns(true);
            action.isDone = true;

            turn.actions.add(action);

            turn.update();

            expect(turn.currentPhase).to.equal(nextPhase);
        });

        it('should call resolve action\'s ready status when there\'s a pending action and it\'s resolved on the next update', function () {
            const action = new AttackAction({});
            action.execute = function() { action.pending = true; return true; };
            sinon.spy(action, 'execute');
            turn.actions.add(action);

            turn.update();

            expect(action.execute.callCount).to.equal(1);

            turn.update();

            expect(turn._pendingAction).to.equal(action);

            action.pending = false;
            action.isDone = true;

            turn.update();

            expect(action.execute.callCount).to.equal(1);
            expect(EventDispatcherMock.dispatch.calledWith(EventTypes.END_ACTION_EVENT)).to.be.ok;
        });

        it('should send the end action event there\'s a pending action and it\'s resolved on the next update but the action is a end action action', function () {
            const nextPhase = turn.phases.peek();

            const action = new EndActionAction({});
            action.execute = function() { action.pending = true; return true; };
            sinon.spy(action, 'execute');
            turn.actions.add(action);

            turn.update();
            turn.update();

            action.pending = false;
            action.isDone = true;

            turn.update();

            expect(EventDispatcherMock.dispatch.calledWith(EventTypes.END_ACTION_EVENT)).not.to.be.ok;
            expect(turn.currentPhase).to.equal(nextPhase);
        });
    });
});