import createEnemy from './enemy';
import * as MapUtils from '../utils/maputils';
import gameConfig from '../config/gameconfig.json';
import TurnPhases from '../constants/turnphases';
import { sendCommand } from '../commands/commanddispatcher';
import commandTypes from '../constants/commandtypes';
import attackMovementStrategy from '../movement/attackmovementstrategy';
import standStillMovementStrategy from '../movement/standstillmovementstrategy';
import WanderMovementStrategy from '../movement/wandermovementstrategy';
import * as validations from '../utils/validations';

const config = gameConfig.enemy;

jest.mock('../utils/maputils');
jest.mock('../movement/attackmovementstrategy', () => jest.fn().mockReturnValue('attacking'));
jest.mock('../movement/standstillmovementstrategy', () => jest.fn().mockReturnValue({ name: 'standing' }));
jest.mock('../commands/commanddispatcher');

describe('Enemy', () => {
    beforeEach(() => {
        sendCommand.mockClear();
        validations.shouldBeActorSprite = jest.fn();
    });

    describe('Initializing', () => {
        it('should be an object', () => {
            expect(createEnemy()).toBeInstanceOf(Object);
        });

        it('should have actor\'s basic methods', () => {
            const enemy = createEnemy();

            expect(enemy.throwAttack).toBeInstanceOf(Function);
            expect(enemy.throwDefence).toBeInstanceOf(Function);
            expect(enemy.throwMovement).toBeInstanceOf(Function);
        });

        it('should have a name from props', () => {
            const props = { name: 'KILLER QUEEN ' };
            const enemy = createEnemy(props);

            expect(enemy.name).toBe(props.name);
        });

        it('should have initial health from props', () => {
            const props = { initialHealth: 2 };
            const enemy = createEnemy(props);

            expect(enemy.health).toBe(props.initialHealth);
        });

        it('should have initial health from config if not defined in props', () => {
            const enemy = createEnemy();

            expect(enemy.health).toBe(config.initialHealth);
        });

        it('should have initial attack from props', () => {
            const props = { attack: 2 };
            const enemy = createEnemy(props);

            expect(enemy.attack).toBe(props.attack);
        });

        it('should have initial defence from props', () => {
            const props = { defence: 2 };
            const enemy = createEnemy(props);

            expect(enemy.defence).toBe(props.defence);
        });

        it('should have initial movement from props', () => {
            const props = { movement: 2 };
            const enemy = createEnemy(props);

            expect(enemy.movement).toBe(props.movement);
        });

        it('should default initial movement to value from config', () => {
            expect(createEnemy().movement).toBe(config.movement);
        });

        it('should have initial action points from props', () => {
            const props = { actionPoints: 2 };
            const enemy = createEnemy(props);

            expect(enemy.actionPoints).toBe(props.actionPoints);
        });

        it('should default initial action points to value from config', () => {
            expect(createEnemy().actionPoints).toBe(config.actionPoints);
        });

        it('should have aggro distance from props', () => {
            const props = { aggroDistance: 2 };
            const enemy = createEnemy(props);

            expect(enemy.aggroDistance).toBe(props.aggroDistance);
        });

        it('should default initial action points to value from config', () => {
            expect(createEnemy().aggroDistance).toBe(config.defaultAggroDistance);
        });

        it('should have minGold from props', () => {
            const props = { minGold: 2 };
            const enemy = createEnemy(props);

            expect(enemy.minGold).toBe(props.minGold);
        });

        it('should default initial action points to value from config', () => {
            expect(createEnemy().minGold).toBe(config.minGold);
        });

        it('should have maxGold from props', () => {
            const props = { maxGold: 2 };
            const enemy = createEnemy(props);

            expect(enemy.maxGold).toBe(props.maxGold);
        });

        it('should default initial action points to value from config', () => {
            expect(createEnemy().maxGold).toBe(config.maxGold);
        });

        it('should have items from props', () => {
            const props = { items: [] };
            const enemy = createEnemy(props);

            expect(enemy.items).toBe(props.items);
        });

        it('should default items to an empty array', () => {
            expect(createEnemy().items).toEqual([]);
        });

        it('should have enemy type from props', () => {
            const props = { enemyType: 'knight' };
            const enemy = createEnemy(props);

            expect(enemy.enemyType).toBe(props.enemyType);
        });

        it('should have description from props', () => {
            const props = { description: 'knight' };
            const enemy = createEnemy(props);

            expect(enemy.description).toBe(props.description);
        });

        it('should have target from props', () => {
            const props = { target: 'knight' };
            const enemy = createEnemy(props);

            expect(enemy.target).toBe(props.target);
        });

        it('should have not seen target', () => {
            expect(createEnemy().hasSeenTarget).toBe(false);
        });


        it('should have aggrolevel of 0', () => {
            expect(createEnemy().aggroLevel).toBe(0);
        });

        it('should have standstillmovementstrategy as a default movement strategy', () => {
            expect(createEnemy().getMovementStrategy()).toBe(standStillMovementStrategy);
        });

        it('should have wander movement strategy if props.movementStrategy = wander', () => {
            const enemy = createEnemy({ movementStrategy: 'wandering' });
            expect(enemy.getMovementStrategy()).toBe(WanderMovementStrategy);
        });

        it('should have stand still movement strategy if props.movementStrategy = standing', () => {
            const enemy = createEnemy({ movementStrategy: 'standing' });
            expect(enemy.getMovementStrategy()).toBe(standStillMovementStrategy);
        });

        it('should set strategy if given in props', () => {
            const enemy = createEnemy({ defaultMovementStrategy: attackMovementStrategy });
            expect(enemy.getMovementStrategy()).toBe(attackMovementStrategy);
        });
    });

    describe('Deciding an action', () => {
        it('should have a decideAction method', () => {
            expect(createEnemy().decideAction).toBeInstanceOf(Function);
        });

        it('should move when it\'s movement phase and target is not within attack range', () => {
            const defaultMovementStrategy = () => ({
                isMovementFinished: () => false,
                calculatePath: () => [{}, {}],
            });
            const enemy = createEnemy({ defaultMovementStrategy });

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            enemy.movementPoints = 2;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(sendCommand).toHaveBeenCalledTimes(1);
            expect(sendCommand.mock.calls[0][0].type).toBe(commandTypes.MOVE_COMMAND);
        });

        it('should end action if it\'s movement phase and target is within attack range', () => {
            const enemy = createEnemy();

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);

            enemy.movementPoints = 2;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(sendCommand).toHaveBeenCalledTimes(1);
            expect(sendCommand.mock.calls[0][0].type).toBe(commandTypes.END_ACTION_COMMAND);
        });

        it('should end action if its move phase and the movement is done (event if there are still movement points left', () => {
            const defaultMovementStrategy = () => ({
                isMovementFinished: () => true,
                calculatePath: () => [{}, {}],
            });
            const enemy = createEnemy({ movement: 2, defaultMovementStrategy });

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            enemy.movementPoints = 2;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(sendCommand).toHaveBeenCalledTimes(1);
            expect(sendCommand.mock.calls[0][0].type).toBe(commandTypes.END_ACTION_COMMAND);
        });

        it('should end action if it\'s movement phase but the actor doesn\'t have any more movement points', () => {
            const enemy = createEnemy();

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            enemy.movementPoints = 0;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(sendCommand).toHaveBeenCalledTimes(1);
            expect(sendCommand.mock.calls[0][0].type).toBe(commandTypes.END_ACTION_COMMAND);
        });

        it('should attack when it\'s action phase and target is within attack range', () => {
            const enemy = createEnemy();

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(true);

            enemy.decideAction({ currentPhase: TurnPhases.ACTION_PHASE });

            expect(sendCommand).toHaveBeenCalledTimes(1);
            expect(sendCommand.mock.calls[0][0].type).toBe(commandTypes.ATTACK_COMMAND);
        });

        it('should end action if its action phase but target is not within attack range', () => {
            const enemy = createEnemy();

            MapUtils.isOnSurroundingTile.mockReturnValueOnce(false);

            enemy.decideAction({ currentPhase: TurnPhases.ACTION_PHASE });

            expect(sendCommand).toHaveBeenCalledTimes(1);
            expect(sendCommand.mock.calls[0][0].type).toBe(commandTypes.END_ACTION_COMMAND);
        });
    });

    describe('Deciding a movement strategy', () => {
        it('should move towards an attacking position when aggro level is > 0', () => {
            const enemy = createEnemy();
            enemy.aggroLevel = 1;
            const turn = {};

            const strategy = enemy.decideMovementStrategy(turn);

            expect(strategy).toBe(attackMovementStrategy(enemy, turn));
        });

        it('should use it\'s default strategy if aggro is 0', () => {
            const enemy = createEnemy();
            const turn = {};
            const strategy = enemy.decideMovementStrategy(turn);
            expect(strategy).toBe(standStillMovementStrategy(enemy, turn));
        });
    });

    describe('Aggro', () => {
        it('should reduce aggro level', () => {
            const enemy = createEnemy();
            const level = 10;
            enemy.aggroLevel = level;

            enemy.updateAggroLevel(-1);

            expect(enemy.aggroLevel).toBe(level - 1);
        });

        it('should increase aggro level', () => {
            const enemy = createEnemy();
            const level = 10;
            enemy.updateAggroLevel(level);
            expect(enemy.aggroLevel).toBe(level);
        });

        it('should not reduce aggro level if it\'s zero', () => {
            const enemy = createEnemy();
            enemy.updateAggroLevel(-1);
            expect(enemy.aggroLevel).toBe(0);
        });
    });
});
