import attackMovementStrategy from './attackmovementstrategy';
import * as MapUtils from '../utils/maputils';

jest.mock('../utils/maputils');

describe('AttackMovementStrategy', () => {
    const gameMock = {
        pathFinder: { findPath: jest.fn() },
        physics: { arcade: { distanceBetween: jest.fn() } },
    };

    const actor = {
        movementPoints: 10,
        position: { x: 1, y: 1 },
        target: { position: { x: 2, y: 2 } },
    };

    const initStrategy = (path) => {
        gameMock.pathFinder.findPath = jest.fn((start, end, cb) =>
            cb.call(null, path || [start, end]));

        return attackMovementStrategy(actor, { state: { game: gameMock, actors: {} } });
    };

    describe('Selecting an attack point', () => {
        it('should select closest walkable point to target', () => {
            const walkableTiles = [{ x: 1, y: 2 }, { x: 2, y: 2 }];
            // return smallest distance for walkabletiles[0]
            gameMock.physics.arcade.distanceBetween = jest.fn((a, b) => {
                if (b === walkableTiles[0]) return 1;
                return 2;
            });
            const strategy = initStrategy();
            const surroundings = [
                null,
                walkableTiles[0],
                walkableTiles[1],
                { x: 3, y: 1 },
                { x: 4, y: 1 },
            ];
            // mock surrounding tiles
            MapUtils.getSurroundingTiles.mockReturnValue(surroundings);
            // mock actorposition
            MapUtils.isWalkable = jest.fn((map, tile) => walkableTiles.indexOf(tile) > -1);
            // mock actorposition
            MapUtils.getTilePositionByCoordinates.mockReturnValueOnce({ x: 6, y: 1 });

            const result = strategy.calculatePath();

            expect(result[result.length - 1]).toBe(walkableTiles[0]);
        });

        it('should select the only walkable point', () => {
            const walkableTile = [{ x: 1, y: 2 }];
            // return smallest distance for walkabletiles[0]
            gameMock.physics.arcade.distanceBetween.mockReturnValue(1);
            const strategy = initStrategy();
            const surroundings = [
                null,
                walkableTile,
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 1 },
            ];
            // mock surrounding tiles
            MapUtils.getSurroundingTiles.mockReturnValue(surroundings);
            // mock actorposition
            MapUtils.isWalkable = jest.fn((map, tile) => tile === walkableTile);
            // mock actorposition
            MapUtils.getTilePositionByCoordinates.mockReturnValueOnce({ x: 6, y: 1 });

            const result = strategy.calculatePath();

            expect(result[result.length - 1]).toBe(walkableTile);
        });

        it('should return nothing if none of the surrounding tiles is walkable', () => {
            const surroundings = [
                null,
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 1 },
            ];
            const strategy = initStrategy();
            // mock surrounding tiles
            MapUtils.getSurroundingTiles.mockReturnValue(surroundings);
            // mock actorposition
            MapUtils.isWalkable.mockReturnValue(false);
            // mock actorposition
            MapUtils.getTilePositionByCoordinates.mockReturnValueOnce({ x: 6, y: 1 });

            const result = strategy.calculatePath();

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(0);
        });

        it('should mark movement finished if there is no tile to move to', () => {
            const surroundings = [
                null,
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 1 },
            ];
            const strategy = initStrategy();
            // mock surrounding tiles
            MapUtils.getSurroundingTiles.mockReturnValue(surroundings);
            // mock actorposition
            MapUtils.isWalkable.mockReturnValue(false);
            // mock actorposition
            MapUtils.getTilePositionByCoordinates.mockReturnValueOnce({ x: 6, y: 1 });

            strategy.calculatePath();

            expect(strategy.isMovementFinished()).toBeTruthy();
        });

        it('should move as far as actor\'s movement points allow if there aren\'t enough points to the actual position', () => {
            const path = [
                { x: 1, y: 1 },
                { x: 1, y: 2 },
                { x: 1, y: 3 },
                { x: 1, y: 4 },
                { x: 1, y: 5 },
            ];
            actor.movementPoints = 3;
            // return smallest distance for walkabletiles[0]
            gameMock.physics.arcade.distanceBetween.mockReturnValue(1);
            const strategy = initStrategy(path);
            // mock surrounding tiles
            MapUtils.getSurroundingTiles.mockReturnValue([null, {}, {}, {}, {}]);
            // mock walkable tiles
            MapUtils.isWalkable = jest.fn().mockReturnValue(true);
            // mock actorposition
            MapUtils.getTilePositionByCoordinates.mockReturnValueOnce({});

            const result = strategy.calculatePath();

            // actor.movementPoints + current position
            expect(result.length).toBe(actor.movementPoints + 1);
        });
    });
});
