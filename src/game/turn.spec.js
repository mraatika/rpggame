import { values } from 'lodash';
import Turn from './turn';
import Game from '../game/game';
import TurnPhases from '../constants/turnphases';
import ActionTypes from '../constants/actiontypes';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import lootCommand from '../commands/lootcommand';
import moveCommand from '../commands/movecommand';
import endActionCommand from '../commands/endactioncommand';
import attackCommand from '../commands/attackcommand';
import endTurnCommand from '../commands/endturncommand';
import CommandDispatcher from '../commands/commanddispatcher';
import * as validations from '../utils/validations';
import attackAction from '../actions/attackaction';
import endActionAction from '../actions/endactionaction';

jest.mock('../sprites/spritebase');
jest.mock('../commands/commanddispatcher');
jest.mock('../events/eventdispatcher');
jest.mock('../game/game');

let dispatcher;

CommandDispatcher.add = jest.fn((callback) => {
    dispatcher = callback;
});

function initTurn(props) {
    const actor = Object.assign({
        purse: {},
        throwMovement: jest.fn(),
        decideAction: jest.fn(),
    }, props);

    return new Turn({}, actor);
}

describe('Turn', () => {
    beforeEach(() => {
        CommandDispatcher.add.mockClear();
        sendEvent.mockClear();

        validations.shouldBeActorSprite = jest.fn();
        validations.shouldBeActor = jest.fn();
        validations.shouldBeTreasure = jest.fn();
    });

    describe('Initialization', () => {
        it('should require actor to be a actorsprite', () => {
            validations.shouldBeActorSprite.mockReturnValueOnce('is invalid');
            expect(() => new Turn({}, {})).toThrow('InvalidArgumentsException: Actor invalid or missing!');
        });

        it('should create a queue from turn phases', () => {
            const turn = new Turn({}, {});
            const phases = values(TurnPhases);

            expect(turn.phases.size()).toBe(Object.keys(TurnPhases).length);
            expect(turn.phases.entries[0]).toBe(phases[0]);
            expect(turn.phases.entries[1]).toBe(phases[1]);
        });
    });

    describe('Starting a turn', () => {
        it('should be done if phases queue is empty', () => {
            const turn = initTurn();
            turn.phases.empty();

            turn.start();

            expect(turn.isDone).toBeTruthy();
        });

        it('should not dispatch a turn start event if phases is empty', () => {
            const turn = initTurn();
            turn.phases.empty();
            turn.start();

            const type = sendEvent.mock.calls[0][0];
            expect(type).not.toBe(EventTypes.START_TURN_EVENT);
        });

        it('should dispatch a turn end event if current turn is done', () => {
            const turn = initTurn();
            turn.phases.empty();

            turn.start();

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.END_TURN_EVENT);
            expect(props.actor).toBe(turn.actor);
        });

        it('should set the currentPhase when started', () => {
            const turn = initTurn();
            const firstPhase = turn.phases.peek();

            turn.start();

            expect(turn.currentPhase).toBe(firstPhase);
        });

        it('should dispatch a turn start event when started', () => {
            const turn = initTurn();
            turn.start();

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.START_TURN_EVENT);
            expect(props.actor).toBe(turn.actor);
        });

        it('should ask the actor to throw for movement', () => {
            const turn = initTurn();
            turn.start();
            expect(turn.actor.throwMovement).toHaveBeenCalled();
        });
    });

    describe('starting a phase', () => {
        it('should have MOVE_PHASE by default', () => {
            const turn = initTurn();
            turn.start();
            expect(turn.currentPhase).toBe(TurnPhases.MOVE_PHASE);
        });

        it('should change current phase', () => {
            const turn = initTurn();
            turn.start();
            turn.nextPhase();
            expect(turn.currentPhase).toBe(TurnPhases.ACTION_PHASE);
        });

        it('should empty actions list', () => {
            const turn = initTurn();
            turn.actions.add({}, {});
            turn.nextPhase();
            expect(turn.actions.size()).toBe(0);
        });

        it('should mark turn done when all phases are done', () => {
            const turn = initTurn();
            turn.phases.empty();
            turn.nextPhase();
            expect(turn.isDone).toBeTruthy();
        });

        it('should dispatch an end turn event when all phases are done', () => {
            const turn = initTurn();
            turn.phases.empty();
            turn.nextPhase();

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];

            expect(type).toBe(EventTypes.END_TURN_EVENT);
            expect(props.actor).toBe(turn.actor);
        });
    });

    describe('Adding actions from commands', () => {
        let turn;
        const otherActor = {};

        beforeEach(() => {
            turn = initTurn();
            turn.state = { game: new Game() };
            turn.start();
        });

        it('should not add actions to command\'s actor is other than turn\'s actor', () => {
            dispatcher.call(turn, moveCommand(otherActor));
            expect(turn.actions.size()).toBe(0);
        });

        it('should add a move action to the actions queue if a move command is received', () => {
            const path = [{ x: 0, y: 0 }, { x: 0, y: 1 }];
            dispatcher.call(turn, moveCommand(turn.actor, path));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek().type).toBe(ActionTypes.MOVE_ACTION);
        });

        it('should split movement command\'s path to single moves', () => {
            const path = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }];
            dispatcher.call(turn, moveCommand(turn.actor, path));
            expect(turn.actions.size()).toBe(path.length - 1);
        });

        it('should not add a movement action if it\'s not move phase', () => {
            turn.currentPhase = TurnPhases.ACTION_PHASE;
            dispatcher.call(turn, moveCommand(turn.actor));
            expect(turn.actions.size()).toBe(0);
        });

        it('should add an attack command to the actions queue if an attack command is received', () => {
            turn.currentPhase = TurnPhases.ACTION_PHASE;
            dispatcher.call(turn, attackCommand(turn.actor, otherActor));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek().type).toBe(ActionTypes.ATTACK_ACTION);
        });

        it('should not add an attack action if it\'s not action phase', () => {
            dispatcher.call(turn, attackCommand(turn.actor, otherActor));
            expect(turn.actions.size()).toBe(0);
        });

        it('should add a loot action to the actions queue if a loot command is received', () => {
            dispatcher.call(turn, lootCommand(turn.actor, {}));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek().type).toBe(ActionTypes.LOOT_ACTION);
        });

        it('should add an end action action to the actions queue if an end action command is received', () => {
            dispatcher.call(turn, endActionCommand(turn.actor));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek().type).toBe(ActionTypes.END_ACTION_ACTION);
        });

        it('should add an end turn action to the actions queue if an end turn action command is received', () => {
            dispatcher.call(turn, endTurnCommand(turn.actor));
            expect(turn.actions.peek().type).toBe(ActionTypes.END_TURN_ACTION);
        });
    });

    describe('Updating turn', () => {
        let turn;

        beforeEach(() => {
            turn = initTurn({ alive: true });
            turn.start();
        });

        it('should be done if the actor is not alive', () => {
            turn.actor.alive = false;
            turn.update();
            expect(turn.isDone).toBeTruthy();
        });

        it('should ask for action if there\'s no action and npc actor is in turn', () => {
            turn.actor.isPlayerControlled = false;

            turn.update();

            expect(turn.actor.decideAction).toHaveBeenCalled();
        });

        it('should not execute action if there is a pending action in the queue', () => {
            const action = attackAction({ actor: {}, target: {} });
            action.execute = jest.fn();
            action.pending = true;

            turn.actions.add(action);

            turn.update();

            expect(action.execute).not.toHaveBeenCalled();
        });

        it('should dispatch an end action event when a action is successfully resolved', () => {
            const action = attackAction({ actor: {}, target: {} });
            const nextPhase = turn.phases.peek();

            action.execute = jest.fn(() => true);
            action.isDone = true;

            turn.actions.add(action);

            turn.update();

            const type = sendEvent.mock.calls[1][0];
            const props = sendEvent.mock.calls[1][1];

            expect(type).toBe(EventTypes.END_ACTION_EVENT);
            expect(props.actor).toBe(turn.actor);
            expect(props.phase).toBe(nextPhase);

            // turn start and end action
            expect(sendEvent).toHaveBeenCalledTimes(2);
        });

        it('should remove the action from the actions queue after it\'s successfully resolved', () => {
            const action = attackAction({ actor: {}, target: {} });
            action.execute = jest.fn(() => true);
            action.isDone = false;

            turn.actions.add(action);

            turn.update();

            expect(turn.actions.peek()).not.toBeTruthy();
        });

        it('should start the next phase when an action is successfully resolved', () => {
            const nextPhase = turn.phases.peek();
            const action = attackAction({ actor: {}, target: {} });
            action.execute = jest.fn(() => true);
            action.isDone = true;

            turn.actions.add(action);

            turn.update();

            expect(turn.currentPhase).toBe(nextPhase);
        });

        it('should resolve action\'s ready status when there is a pending action and it is resolved on the next update', () => {
            const action = attackAction({ actor: {}, target: {} });
            const nextPhase = turn.phases.peek();

            action.execute = jest.fn(() => {
                action.pending = true;
                return true;
            });
            turn.actions.add(action);

            turn.update();
            turn.update();

            expect(action.execute).toHaveBeenCalledTimes(1);
            expect(turn.pendingAction).toBe(action);

            action.pending = false;
            action.isDone = true;

            turn.update();

            const type = sendEvent.mock.calls[1][0];
            const props = sendEvent.mock.calls[1][1];

            expect(type).toBe(EventTypes.END_ACTION_EVENT);
            expect(props.actor).toBe(turn.actor);
            expect(props.phase).toBe(nextPhase);

            // turn start and end action
            expect(sendEvent).toHaveBeenCalledTimes(2);
        });

        it('should resolve actions one after another', () => {
            const action1 = { execute: jest.fn() };
            const action2 = { execute: jest.fn() };

            turn.actions.add(action1, action2);

            turn.update();

            expect(action1.execute).toHaveBeenCalledTimes(1);

            turn.update();

            expect(action2.execute).toHaveBeenCalledTimes(1);
        });

        it('should resolve pending action before starting to execute next', () => {
            const action1 = {
                execute: jest.fn(() => {
                    action1.pending = true;
                }),
            };
            const action2 = {
                execute: jest.fn(),
            };

            turn.actions.add(action1, action2);

            turn.update();

            expect(turn.pendingAction).toBe(action1);

            action1.pending = false;

            turn.update();

            expect(action1.execute).toHaveBeenCalledTimes(1);
            expect(action2.execute).not.toHaveBeenCalled();
            expect(turn.actions.size()).toBe(1);
            expect(turn.pendingAction).toBe(null);

            turn.update();

            expect(action2.execute).toHaveBeenCalled();
        });

        it('should add priority actions to the front of the queue', () => {
            const action1 = { execute: jest.fn(), priority: 0 };
            const action2 = { execute: jest.fn(), priority: 1 };

            turn.actions.add(action1);
            turn.actions.add(action2);

            turn.update();

            expect(action1.execute).not.toHaveBeenCalled();
            expect(action2.execute).toHaveBeenCalled();
        });

        it('should resolve pending actions before resolving priority actions', () => {
            const action1 = { execute: jest.fn(() => (action1.pending = true)), priority: 0 };
            const action2 = { execute: jest.fn(), priority: 1 };

            turn.actions.add(action1);

            turn.update();

            turn.actions.add(action2);

            turn.update();

            expect(action1.execute).toHaveBeenCalled();
            expect(action2.execute).not.toHaveBeenCalled();

            action1.pending = false;

            // finish handling the pending action
            turn.update();
            // start working on next action
            turn.update();

            expect(action2.execute).toHaveBeenCalled();
        });

        it('should not send the end action event if there is a pending action and it is resolved on the next update but the action is a end action action', () => {
            const nextPhase = turn.phases.peek();

            const action = endActionAction({ actor: {}, nextPhase: 'ACTION_PHASE' });
            action.execute = jest.fn(() => { action.pending = true; return true; });

            turn.actions.add(action);

            turn.update();
            turn.update();

            action.pending = false;
            action.isDone = true;

            turn.update();

            expect(turn.currentPhase).toBe(nextPhase);
            expect(sendEvent).toHaveBeenCalledTimes(1);
        });
    });
});
