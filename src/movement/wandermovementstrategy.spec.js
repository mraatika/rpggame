import WanderMovementStrategy from './wandermovementstrategy';
import * as mapUtils from '../utils/maputils';
import PathFinder from './pathfinder';

jest.mock('../utils/maputils');
jest.mock('./movementstrategy');
jest.mock('./pathfinder');

describe('WanderMovementStrategy', () => {
    let strategy;
    let gameMock;

    describe('Selecting a movement target', () => {
        const actorPosition = { x: 2, y: 2 };
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

        beforeEach(() => {
            gameMock = { pathFinder: new PathFinder(), rnd: { pick: jest.fn() } };
            strategy = new WanderMovementStrategy();
            strategy.game = gameMock;
            strategy.actor = {};
        });

        it('should return actors current position as starting point', () => {
            const path = [actorPosition, area[3], area[4]];

            strategy.actor.movementPoints = 3;

            // mock actor position calculation
            mapUtils.getTilePositionByCoordinates.mockReturnValueOnce(actorPosition);
            // mock getSurroundingTiles return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // all are walkable
            mapUtils.isWalkable.mockReturnValue(true);

            gameMock.pathFinder.findPath = jest.fn((a, b, cb) => cb(path));
            gameMock.rnd.pick.mockReturnValueOnce(area[4]);

            const result = strategy.calculatePath();

            expect(result[0]).toBe(actorPosition);
        });

        it('should return a random point from an surrounding area', () => {
            const walkableTile = area[2];
            // mock getAreaOfRadius return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // only one of the tiles is walkable...
            mapUtils.isWalkable = jest.fn((map, tile) => tile === walkableTile);
            // ...and random returns that tile
            gameMock.rnd.pick.mockReturnValueOnce(walkableTile);
            // findPath invokes callback with path
            gameMock.pathFinder.findPath = jest.fn((a, b, cb) => cb([actorPosition, walkableTile]));

            strategy.actor.movementPoints = 2;

            const result = strategy.calculatePath();

            expect(result[1]).toBe(walkableTile);
        });

        it('should limit path length to actor\'s movement points', () => {
            const walkableTile = area[4];
            const movementPoints = 2;
            const longpath = area.slice(1, 4);
            // mock getAreaOfRadius return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // only one of the tiles is walkable...
            mapUtils.isWalkable.mockReturnValue(true);
            // ...and random returns that tile
            gameMock.rnd.pick.mockReturnValueOnce(walkableTile);
            // findPath invokes callback with path
            gameMock.pathFinder.findPath = jest.fn((a, b, cb) => cb(longpath));

            strategy.actor.movementPoints = movementPoints;

            const result = strategy.calculatePath();

            expect(result.length).toBe(movementPoints + 1);
        });

        it('should not mark movement finished if there is a tile to move to', () => {
            const walkableTile = area[2];
            // mock getAreaOfRadius return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // all are walkable
            mapUtils.isWalkable.mockReturnValue(true);
            // random returns a tile
            gameMock.rnd.pick.mockReturnValueOnce(walkableTile);

            strategy.calculatePath();

            expect(strategy.isMovementFinished).toBeFalsy();
        });

        it('should mark return an empty array when there\'s no tile to move to', () => {
            // mock getSurroundingTiles return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // none is walkable
            mapUtils.isWalkable.mockReturnValue(false);

            const result = strategy.calculatePath();
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(0);
        });

        it('should mark movement finished when there\'s no tile to move to', () => {
            // mock getSurroundingTiles return value
            mapUtils.getAreaOfRadius.mockReturnValueOnce(area);
            // none is walkable
            mapUtils.isWalkable.mockReturnValue(false);
            strategy.calculatePath();
            expect(strategy.isMovementFinished).toBeTruthy();
        });
    });
});
