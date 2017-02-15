import WanderMovementStrategy from './wandermovementstrategy';
import mapUtils from '../utils/maputils';

jest.mock('../utils/maputils');
jest.mock('../movement/movementstrategy');

describe('WanderMovementStrategy', () => {
    let strategy;

    describe('Selecting a movement target', () => {
        const gameMock = { rnd: { pick: arr => arr[0] } };

        beforeEach(() => {
            strategy = new WanderMovementStrategy();
            strategy.game = gameMock;
            strategy.actor = {};
        });

        it('should return actors current position', () => {
            const actorPosition = { x: 1, y: 1 };
            const surroundings = [
                null,
                { x: 3, y: 1 },
            ];

            // must return a walkable tile or an empty array is returned

            // mock actor position calculation
            mapUtils.getTilePositionByCoordinates.mockReturnValueOnce(actorPosition);
            // mock getSurroundingTiles return value
            mapUtils.getSurroundingTiles.mockReturnValueOnce(surroundings);
            // none of those are the previous tile
            mapUtils.isSameTile.mockReturnValue(false);
            // all are walkable
            mapUtils.isWalkable.mockReturnValue(true);

            const result = strategy.calculatePath();

            expect(result[0]).toBe(actorPosition);
        });

        it('should return a random point from surrounding walkable points', () => {
            const walkableTile = { x: 2, y: 1 };
            const surroundings = [
                null,
                { x: 1, y: 1 },
                walkableTile,
                { x: 3, y: 1 },
                { x: 4, y: 1 },
            ];

            // mock getSurroundingTiles return value
            mapUtils.getSurroundingTiles.mockReturnValueOnce(surroundings);
            // none of those are the previous tile
            mapUtils.isSameTile.mockReturnValue(false);
            // only one of the tiles is walkable
            mapUtils.isWalkable = jest.fn((map, tile) => tile === walkableTile);
            // mock random pick return value

            const result = strategy.calculatePath();

            expect(result[1]).toBe(walkableTile);
        });

        it('should not move to previous position', () => {
            const prevTile = { x: 3, y: 1 };
            const surroundings = [
                null,
                prevTile,
            ];

            // mock getSurroundingTiles return value
            mapUtils.getSurroundingTiles.mockReturnValueOnce(surroundings);
            // none of those are the previous tile
            mapUtils.isSameTile.mockReturnValue(true);

            expect(strategy.calculatePath().length).toBe(0);
        });

        it('should not mark movement finished if there is a tile to move to', () => {
            const surroundings = [
                null,
                { x: 3, y: 1 },
            ];

            // mock getSurroundingTiles return value
            mapUtils.getSurroundingTiles.mockReturnValueOnce(surroundings);
            // none of those are the previous tile
            mapUtils.isSameTile.mockReturnValue(false);
            mapUtils.isWalkable.mockReturnValue(true);

            strategy.calculatePath();

            expect(strategy.isMovementFinished).toBeFalsy();
        });

        it('should mark return an empty array when there\'s no tile to move to', () => {
            const surroundings = [
                null,
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 1 },
            ];

            // mock getSurroundingTiles return value
            mapUtils.getSurroundingTiles.mockReturnValueOnce(surroundings);
            // none of those are the previous tile
            mapUtils.isSameTile.mockReturnValue(false);
            mapUtils.isWalkable.mockReturnValue(false);

            const result = strategy.calculatePath();
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(0);
        });

        it('should mark movement finished when there\'s no tile to move to', () => {
            const surroundings = [
                null,
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 1 },
            ];

            // mock getSurroundingTiles return value
            mapUtils.getSurroundingTiles.mockReturnValueOnce(surroundings);
            // none of those are the previous tile
            mapUtils.isSameTile.mockReturnValue(false);
            mapUtils.isWalkable.mockReturnValue(false);

            strategy.calculatePath();

            expect(strategy.isMovementFinished).toBeTruthy();
        });
    });
});
