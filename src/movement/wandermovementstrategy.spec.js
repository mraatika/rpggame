import wanderMovementStrategy from './wandermovementstrategy';
import * as mapUtils from '../utils/maputils';

jest.mock('../utils/maputils');
jest.mock('./pathfinder');

describe('WanderMovementStrategy', () => {
    const actor = { position: { x: 2, y: 2 } };
    const area = [
        null,
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 3 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
    ];

    const gameMock = { pathFinder: { findPath: jest.fn() }, rnd: { pick: jest.fn() } };

    function initStrategy() {
        return wanderMovementStrategy(actor, { state: { game: gameMock, actors: {} } });
    }

    describe('Selecting a movement target', () => {
        it('should return actors current position as starting point', () => {
            actor.movementPoints = 3;

            const path = [actor.position, area[3], area[4]];

            const strategy = initStrategy();

            // mock actor position calculation
            mapUtils.getTilePositionByCoordinates.mockReturnValueOnce(actor.position);
            // mock getSurroundingTiles return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // all are walkable
            mapUtils.isWalkable.mockReturnValue(true);

            gameMock.pathFinder.findPath = jest.fn((a, b, cb) => cb(path));
            gameMock.rnd.pick.mockReturnValueOnce(area[4]);

            const result = strategy.calculatePath();

            expect(result[0]).toBe(actor.position);
        });

        it('should return a random point from an surrounding area', () => {
            actor.movementPoints = 2;
            const walkableTile = area[2];
            const strategy = initStrategy();
            // mock getAreaOfRadius return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // only one of the tiles is walkable...
            mapUtils.isWalkable = jest.fn((map, tile) => tile === walkableTile);
            // ...and random returns that tile
            gameMock.rnd.pick.mockReturnValueOnce(walkableTile);
            // findPath invokes callback with path
            gameMock.pathFinder.findPath = jest.fn((a, b, cb) =>
                cb([actor.position, walkableTile]));

            const result = strategy.calculatePath();

            expect(result[1]).toBe(walkableTile);
        });

        it('should limit path length to actor\'s movement points', () => {
            const movementPoints = 2;
            actor.movementPoints = movementPoints;
            const strategy = initStrategy();
            const walkableTile = area[4];
            const longpath = area.slice(1, 4);
            // mock getAreaOfRadius return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // only one of the tiles is walkable...
            mapUtils.isWalkable.mockReturnValue(true);
            // ...and random returns that tile
            gameMock.rnd.pick.mockReturnValueOnce(walkableTile);
            // findPath invokes callback with path
            gameMock.pathFinder.findPath = jest.fn((a, b, cb) => cb(longpath));

            const result = strategy.calculatePath();

            expect(result.length).toBe(movementPoints + 1);
        });

        it('should not mark movement finished if there is a tile to move to', () => {
            const strategy = initStrategy();
            const walkableTile = area[2];
            // mock getAreaOfRadius return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // all are walkable
            mapUtils.isWalkable.mockReturnValue(true);
            // random returns a tile
            gameMock.rnd.pick.mockReturnValueOnce(walkableTile);

            strategy.calculatePath();

            expect(strategy.isMovementFinished()).toBeFalsy();
        });

        it('should mark return an empty array when there\'s no tile to move to', () => {
            const strategy = initStrategy();
            // mock getSurroundingTiles return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // none is walkable
            mapUtils.isWalkable.mockReturnValue(false);

            const result = strategy.calculatePath();
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(0);
        });

        it('should mark movement finished when there\'s no tile to move to', () => {
            const strategy = initStrategy();
            // mock getSurroundingTiles return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // none is walkable
            mapUtils.isWalkable.mockReturnValue(false);
            strategy.calculatePath();
            expect(strategy.isMovementFinished()).toBeTruthy();
        });
    });
});
