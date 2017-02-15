import AttackMovementStrategy from './attackmovementstrategy';
import MapUtils from '../utils/maputils';

jest.mock('../utils/maputils');
jest.mock('../movement/movementstrategy');

describe('AttackMovementStrategy', () => {
    let strategy;

    const pathFinderMock = {
        findPath: jest.fn((start, end, callback) => callback.call(null, [start, end])),
    };

    const gameMock = {
        pathFinder: pathFinderMock,
        physics: { arcade: { distanceBetween: jest.fn() } },
    };

    beforeEach(() => {
        strategy = new AttackMovementStrategy();
        strategy.game = gameMock;
        strategy.actor = {
            position: {
                x: 1,
                y: 1,
            },
            target: {
                position: {
                    x: 2,
                    y: 2,
                },
            },
        };
    });

    describe('Selecting an attack point', () => {
        it('should select closest walkable point to target', () => {
            const walkableTiles = [{ x: 1, y: 2 }, { x: 2, y: 2 }];
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
            // return smallest distance for walkabletiles[0]
            gameMock.physics.arcade.distanceBetween = jest.fn((a, b) => {
                if (b === walkableTiles[0]) return 1;
                return 2;
            });

            const result = strategy.calculatePath();

            expect(result[result.length - 1]).toBe(walkableTiles[0]);
        });

        it('should select the only walkable point', () => {
            const walkableTile = [{ x: 1, y: 2 }];
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
            // return smallest distance for walkabletiles[0]
            gameMock.physics.arcade.distanceBetween.mockReturnValue(1);

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
            // mock surrounding tiles
            MapUtils.getSurroundingTiles.mockReturnValue(surroundings);
            // mock actorposition
            MapUtils.isWalkable.mockReturnValue(false);
            // mock actorposition
            MapUtils.getTilePositionByCoordinates.mockReturnValueOnce({ x: 6, y: 1 });

            strategy.calculatePath();

            expect(strategy.isMovementFinished).toBeTruthy();
        });
    });
});
