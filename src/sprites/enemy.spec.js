import Enemy from './enemy';
import Turn from '../game/turn';
import MapUtils from '../utils/maputils';
import TurnPhases from '../game/turnphases';
import CommandDispatcher from '../commands/commanddispatcher';
import Commands from '../commands/commands';
import MovementStrategy from '../movement/movementstrategy';
import AttackMovementStrategy from '../movement/attackmovementstrategy';
import StandStillMovementStrategy from '../movement/standstillmovementstrategy';

jest.mock('./spritebase');
jest.mock('./healthbar');
jest.mock('../commands/commanddispatcher');
jest.mock('../utils/maputils');
jest.mock('../game/turn');
jest.mock('../movement/movementstrategy');
jest.mock('../movement/attackmovementstrategy');

MovementStrategy.prototype.calculatePath.mockReturnValue([]);

describe('Enemy', () => {
    let enemy;
    let movementStrategyMock;

    beforeEach(() => {
        enemy = new Enemy({}, 0, 0, {});
        enemy.target = new Enemy();

        CommandDispatcher.dispatch.mockClear();
    });

    describe('Deciding an action', () => {
        it('should move when it\'s movement phase and target is not within attack range', () => {
            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);
            StandStillMovementStrategy.prototype.calculatePath.mockReturnValueOnce([{}, {}]);

            enemy.movementPoints = 2;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch).toHaveBeenCalledTimes(1);
            expect(CommandDispatcher.dispatch.mock.calls[0][0])
                .toBeInstanceOf(Commands.MoveCommand);
        });

        it('should end action if it\'s movement phase and target is within attack range', () => {
            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);

            enemy.movementPoints = 2;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch).toHaveBeenCalledTimes(1);
            expect(CommandDispatcher.dispatch.mock.calls[0][0])
                .toBeInstanceOf(Commands.EndActionCommand);
        });

        it('should end action if its move phase and the movement is done (event if there are still movement points left', () => {
            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            enemy.movementPoints = 2;
            enemy.defaultMovementStrategy.isMovementFinished = true;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch).toHaveBeenCalledTimes(1);
            expect(CommandDispatcher.dispatch.mock.calls[0][0])
                .toBeInstanceOf(Commands.EndActionCommand);
        });

        it('should end action if it\'s movement phase but the actor doesn\'t have any more movement points', () => {
            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            enemy.movementPoints = 0;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch).toHaveBeenCalledTimes(1);
            expect(CommandDispatcher.dispatch.mock.calls[0][0])
                .toBeInstanceOf(Commands.EndActionCommand);
        });

        it('should attack when it\'s action phase and target is within attack range', () => {
            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);

            enemy.decideAction({ currentPhase: TurnPhases.ACTION_PHASE });

            expect(CommandDispatcher.dispatch).toHaveBeenCalledTimes(1);
            expect(CommandDispatcher.dispatch.mock.calls[0][0])
                .toBeInstanceOf(Commands.AttackCommand);
        });

        it('should end action if its action phase but target is not within attack range', () => {
            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            enemy.decideAction({ currentPhase: TurnPhases.ACTION_PHASE });

            expect(CommandDispatcher.dispatch).toHaveBeenCalledTimes(1);
            expect(CommandDispatcher.dispatch.mock.calls[0][0])
                .toBeInstanceOf(Commands.EndActionCommand);
        });
    });

    describe('Deciding a movement strategy', () => {
        it('should move towards an attacking position when aggro level is > 0', () => {
            enemy.aggroLevel = 1;

            const strategy = enemy.getMovementStrategy(new Turn());

            expect(strategy).toBeInstanceOf(AttackMovementStrategy);
        });

        it('should use it\'s default strategy if aggro is 0', () => {
            const strategy = enemy.getMovementStrategy(new Turn());
            expect(strategy).toBeInstanceOf(MovementStrategy);
        });
    });

    describe('Aggro', () => {
        it('should have initial aggro level of 0', () => {
            expect(enemy.aggroLevel).toBe(0);
        });

        it('should reduce aggro level', () => {
            const level = 10;
            enemy.aggroLevel = level;

            enemy.updateAggroLevel(-1);

            expect(enemy.aggroLevel).toBe(level - 1);
        });

        it('should increase aggro level', () => {
            const level = 10;
            enemy.updateAggroLevel(level);
            expect(enemy.aggroLevel).toBe(level);
        });

        it('should not reduce aggro level if it\'s zero', () => {
            enemy.updateAggroLevel(-1);
            expect(enemy.aggroLevel).toBe(0);
        });
    });
});
