import { values } from 'lodash';
import Turn from './turn';
import Game from '../game/game';
import Actor from '../sprites/actor';
import Treasure from '../sprites/treasure';
import Commands from '../commands/commands';
import Events from '../events/events';
import TurnPhases from '../constants/turnphases';
import Actions from '../actions/actions';
import EventDispatcher from '../events/eventdispatcher';
import CommandDispatcher from '../commands/commanddispatcher';

jest.mock('../sprites/spritebase');
jest.mock('../commands/commanddispatcher');
jest.mock('../events/eventdispatcher');
jest.mock('../sprites/actor');
jest.mock('../game/game');

let dispatcher;

CommandDispatcher.add = jest.fn((callback) => {
    dispatcher = callback;
});

describe('Turn', () => {
    beforeEach(() => {
        CommandDispatcher.add.mockClear();
        EventDispatcher.dispatch.mockClear();
    });

    describe('Initialization', () => {
        it('should require actor to be an instance of Actor class', () => {
            expect(() => new Turn({}, {})).toThrow('InvalidArgumentsException: Actor invalid or missing!');
            expect(() => new Turn({}, new Actor(), [])).not.toThrow();
        });

        it('should create a queue from turn phases', () => {
            const turn = new Turn({}, new Actor(), []);
            const phases = values(TurnPhases);

            expect(turn.phases.size()).toBe(Object.keys(TurnPhases).length);
            expect(turn.phases.entries[0]).toBe(phases[0]);
            expect(turn.phases.entries[1]).toBe(phases[1]);
        });
    });

    describe('Starting a turn', () => {
        let turn;
        let actor;

        beforeEach(() => {
            actor = new Actor();
            turn = new Turn({}, actor, [actor]);
        });

        afterEach(() => {
            turn.dispose();
        });

        it('should be done if phases queue is empty', () => {
            turn.phases.empty();

            turn.start();

            expect(turn.isDone).toBeTruthy();
        });

        it('should not dispatch a turn start event if phases is empty', () => {
            turn.phases.empty();

            turn.start();

            expect(EventDispatcher.dispatch.mock.calls[0][0])
                .not
                .toBeInstanceOf(Events.StartTurnEvent);
        });

        it('should dispatch a turn end event if current turn is done', () => {
            turn.phases.empty();

            turn.start();

            expect(EventDispatcher.dispatch.mock.calls[0][0]).toBeInstanceOf(Events.EndTurnEvent);
        });

        it('should set the currentPhase when started', () => {
            const firstPhase = turn.phases.peek();

            turn.start();

            expect(turn.currentPhase).toBe(firstPhase);
        });

        it('should dispatch a turn start event when started', () => {
            turn.start();
            expect(EventDispatcher.dispatch.mock.calls[0][0]).toBeInstanceOf(Events.StartTurnEvent);
        });

        it('should ask the actor to throw for movement', () => {
            turn.start();
            expect(actor.throwMovement).toHaveBeenCalled();
        });
    });

    describe('starting a phase', () => {
        let turn;

        beforeEach(() => {
            turn = new Turn({}, new Actor());
        });

        it('should have MOVE_PHASE by default', () => {
            turn.start();
            expect(turn.currentPhase).toBe(TurnPhases.MOVE_PHASE);
        });

        it('should change current phase', () => {
            turn.start();
            turn.nextPhase();
            expect(turn.currentPhase).toBe(TurnPhases.ACTION_PHASE);
        });

        it('should empty actions list', () => {
            turn.actions.add({}, {});
            turn.nextPhase();
            expect(turn.actions.size()).toBe(0);
        });

        it('should mark turn done when all phases are done', () => {
            turn.phases.empty();
            turn.nextPhase();
            expect(turn.isDone).toBeTruthy();
        });

        it('should dispatch an end turn event when all phases are done', () => {
            turn.phases.empty();
            turn.nextPhase();
            expect(EventDispatcher.dispatch.mock.calls[0][0]).toBeInstanceOf(Events.EndTurnEvent);
        });
    });

    describe('Adding actions from commands', () => {
        let turn;
        const actor = new Actor();
        const otherActor = new Actor();

        beforeEach(() => {
            turn = new Turn({}, actor);
            turn.state = { game: new Game() };
            turn.start();
        });

        it('should not add actions to command\'s actor is other than turn\'s actor', () => {
            dispatcher.call(turn, new Commands.MoveCommand(otherActor));
            expect(turn.actions.size()).toBe(0);
        });

        it('should add a move action to the actions queue if a move command is received', () => {
            const path = [{ x: 0, y: 0 }, { x: 0, y: 1 }];
            dispatcher.call(turn, new Commands.MoveCommand(actor, path));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek()).toBeInstanceOf(Actions.MovementAction);
        });

        it('should split movement command\'s path to single moves', () => {
            const path = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }];
            dispatcher.call(turn, new Commands.MoveCommand(actor, path));
            expect(turn.actions.size()).toBe(path.length - 1);
        });

        it('should not add a movement action if it\'s not move phase', () => {
            turn.currentPhase = TurnPhases.ACTION_PHASE;
            dispatcher.call(turn, new Commands.MoveCommand(actor));
            expect(turn.actions.size()).toBe(0);
        });

        it('should add an attack command to the actions queue if an attack command is received', () => {
            turn.currentPhase = TurnPhases.ACTION_PHASE;
            dispatcher.call(turn, new Commands.AttackCommand(actor, otherActor));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek()).toBeInstanceOf(Actions.AttackAction);
        });

        it('should not add an attack action if it\'s not action phase', () => {
            dispatcher.call(turn, new Commands.AttackCommand(actor, otherActor));
            expect(turn.actions.size()).toBe(0);
        });

        it('should add a loot action to the actions queue if a loot command is received', () => {
            dispatcher.call(turn, new Commands.LootCommand(actor, new Treasure()));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek()).toBeInstanceOf(Actions.LootAction);
        });

        it('should add an end action action to the actions queue if an end action command is received', () => {
            dispatcher.call(turn, new Commands.EndActionCommand(actor));
            expect(turn.actions.size()).toBe(1);
            expect(turn.actions.peek()).toBeInstanceOf(Actions.EndActionAction);
        });

        it('should add an end turn action to the actions queue if an end turn action command is received', () => {
            dispatcher.call(turn, new Commands.EndTurnCommand(actor));
            expect(turn.actions.peek()).toBeInstanceOf(Actions.EndTurnAction);
        });
    });

    describe('Updating turn', () => {
        let turn;
        let actor;

        beforeEach(() => {
            actor = new Actor();
            actor.alive = true;
            turn = new Turn({}, actor, [actor]);
            turn.start();
        });

        it('should be done if the actor is not alive', () => {
            actor.alive = false;
            turn.update();
            expect(turn.isDone).toBeTruthy();
        });

        it('should ask for action if there\'s no action and npc actor is in turn', () => {
            actor.isPlayerControlled = false;

            turn.update();

            expect(actor.decideAction).toHaveBeenCalled();
        });

        it('should not execute action if there is a pending action in the queue', () => {
            const action = new Actions.AttackAction({ actor: new Actor(), target: new Actor() });
            action.execute = jest.fn();
            action.pending = true;

            turn.actions.add(action);

            turn.update();

            expect(action.execute).not.toHaveBeenCalled();
        });

        it('should dispatch an end action event when a action is successfully resolved', () => {
            const action = new Actions.AttackAction({ actor: new Actor(), target: new Actor() });
            action.execute = jest.fn(() => true);
            action.isDone = true;

            turn.actions.add(action);

            turn.update();

            // turn start and end action
            expect(EventDispatcher.dispatch).toHaveBeenCalledTimes(2);
            expect(EventDispatcher.dispatch.mock.calls[1][0]).toBeInstanceOf(Events.EndActionEvent);
        });

        it('should remove the action from the actions queue after it\'s successfully resolved', () => {
            const action = new Actions.AttackAction({ actor: new Actor(), target: new Actor() });
            action.execute = jest.fn(() => true);
            action.isDone = false;

            turn.actions.add(action);

            turn.update();

            expect(turn.actions.peek()).not.toBeTruthy();
        });

        it('should start the next phase when an action is successfully resolved', () => {
            const nextPhase = turn.phases.peek();
            const action = new Actions.AttackAction({ actor: new Actor(), target: new Actor() });
            action.execute = jest.fn(() => true);
            action.isDone = true;

            turn.actions.add(action);

            turn.update();

            expect(turn.currentPhase).toBe(nextPhase);
        });

        it('should resolve action\'s ready status when there is a pending action and it is resolved on the next update', () => {
            const action = new Actions.AttackAction({ actor: new Actor(), target: new Actor() });
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

            // turn start and end action
            expect(EventDispatcher.dispatch).toHaveBeenCalledTimes(2);
            expect(EventDispatcher.dispatch.mock.calls[1][0]).toBeInstanceOf(Events.EndActionEvent);
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

            const action = new Actions.EndActionAction({ actor: new Actor() });
            action.execute = jest.fn(() => { action.pending = true; return true; });

            turn.actions.add(action);

            turn.update();
            turn.update();

            action.pending = false;
            action.isDone = true;

            turn.update();

            expect(turn.currentPhase).toBe(nextPhase);
            expect(EventDispatcher.dispatch).toHaveBeenCalledTimes(2);
            expect(EventDispatcher.dispatch.mock.calls[1][0]).toBeInstanceOf(Events.EndActionEvent);
        });
    });
});
