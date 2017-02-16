import { Point } from 'phaser';
import * as MapUtils from './maputils';
import gameConfig from '../config/gameconfig.json';

const { tileSize } = gameConfig.map;

describe('MapUtils', () => {
    describe('getTilePositionByCoordinates', () => {
        it('should return a Point object', () => {
            const coordinates = { x: tileSize, y: tileSize };
            const result = MapUtils.getTilePositionByCoordinates(coordinates);
            expect(result).toBeInstanceOf(Point);
        });

        it('should calculate coordinates by dividing pixel position by tilesize', () => {
            const tilePosition = 3;
            const coordinates = { x: tilePosition * tileSize, y: tilePosition * tileSize };
            const result = MapUtils.getTilePositionByCoordinates(coordinates);
            expect(result.x).toBe(tilePosition);
            expect(result.y).toBe(tilePosition);
        });

        it('should round down pixel position', () => {
            const coordinates = { x: 1.6 * tileSize, y: 1.6 * tileSize };
            const result = MapUtils.getTilePositionByCoordinates(coordinates);
            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should return null if given point is undefined', () => {
            expect(MapUtils.getTilePositionByCoordinates()).toBe(null);
        });

        it('should default x property to zero', () => {
            expect(MapUtils.getTilePositionByCoordinates({ y: 233 }).x).toBe(0);
        });

        it('should default y property to zero', () => {
            expect(MapUtils.getTilePositionByCoordinates({ x: 233 }).y).toBe(0);
        });
    });

    describe('getCoordinatePositionByTile', () => {
        it('should return a Point object', () => {
            const coordinates = { x: 1, y: 1 };
            const result = MapUtils.getCoordinatePositionByTile(coordinates);
            expect(result).toBeInstanceOf(Point);
        });

        it('should calculate position by multiplying tile position by tileSize', () => {
            const coordinates = { x: 3, y: 3 };
            const result = MapUtils.getCoordinatePositionByTile(coordinates, 0);
            expect(result.x).toBe(coordinates.x * tileSize);
            expect(result.y).toBe(coordinates.y * tileSize);
        });

        it('should add anchor to position', () => {
            const coordinates = { x: 3, y: 4 };
            const anchor = 0.5;
            const result = MapUtils.getCoordinatePositionByTile(coordinates, anchor);
            expect(result.x).toBe((coordinates.x * tileSize) + (tileSize * anchor));
            expect(result.y).toBe((coordinates.y * tileSize) + (tileSize * anchor));
        });

        it('should return null if given point is undefined', () => {
            expect(MapUtils.getCoordinatePositionByTile()).toBe(null);
        });

        it('should default x property to zero', () => {
            expect(MapUtils.getTilePositionByCoordinates({ y: 1 }).x).toBe(0);
        });

        it('should default y property to zero', () => {
            expect(MapUtils.getTilePositionByCoordinates({ x: 1 }).y).toBe(0);
        });
    });

    describe('getSurroundingTiles', () => {
        it('should return an array', () => {
            expect(MapUtils.getSurroundingTiles({ x: 3, y: 3 })).toBeInstanceOf(Array);
        });

        it('should return null as first entry (because then indexes will be uniform with Phaser.DIRECTION values)', () => {
            expect(MapUtils.getSurroundingTiles({ x: 3, y: 3 })[0]).toBe(null);
        });

        it('should return four actual directions', () => {
            // expect to contain null and 4 tiles
            expect(MapUtils.getSurroundingTiles({ x: 3, y: 3 }).length).toBe(5);
        });

        it('should return left tile as second entry', () => {
            const tile = { x: 3, y: 3 };
            expect(MapUtils.getSurroundingTiles(tile)[1].x).toBe(tile.x - 1);
            expect(MapUtils.getSurroundingTiles(tile)[1].y).toBe(tile.y);
        });

        it('should return right tile as third entry', () => {
            const tile = { x: 3, y: 3 };
            expect(MapUtils.getSurroundingTiles(tile)[2].x).toBe(tile.x + 1);
            expect(MapUtils.getSurroundingTiles(tile)[2].y).toBe(tile.y);
        });

        it('should return top tile as fourth entry', () => {
            const tile = { x: 3, y: 3 };
            expect(MapUtils.getSurroundingTiles(tile)[3].x).toBe(tile.x);
            expect(MapUtils.getSurroundingTiles(tile)[3].y).toBe(tile.y - 1);
        });

        it('should return bottom tile as fifth entry', () => {
            const tile = { x: 3, y: 3 };
            expect(MapUtils.getSurroundingTiles(tile)[4].x).toBe(tile.x);
            expect(MapUtils.getSurroundingTiles(tile)[4].y).toBe(tile.y + 1);
        });

        it('should return an empty array if given tile is undefined', () => {
            expect(MapUtils.getSurroundingTiles()).toEqual([]);
        });

        it('should return an empty array if x property of given point is undefined', () => {
            expect(MapUtils.getSurroundingTiles({ y: 2 })).toEqual([]);
        });

        it('should return an empty array if y property of given point is undefined', () => {
            expect(MapUtils.getSurroundingTiles({ x: 2 })).toEqual([]);
        });
    });

    describe('getAreaOfRadius', () => {
        it('should return an array', () => {
            expect(MapUtils.getAreaOfRadius({ x: 0, y: 0 }, 1)).toBeInstanceOf(Array);
        });

        it('should return eight surrounding tiles when per radius', () => {
            expect(MapUtils.getAreaOfRadius({ x: 3, y: 3 }).length).toBe(3 * 3);
            expect(MapUtils.getAreaOfRadius({ x: 3, y: 3 }, 2).length).toBe(5 * 5);
        });

        it('should return tiles from topleft to bottom right', () => {
            const center = { x: 3, y: 3 };
            const area = MapUtils.getAreaOfRadius(center);
            let rowIdx = -1;
            let colIdx = -1;

            for (let i = 0; i < area.length; i++) {
                if (i && i % 3 === 0) rowIdx++;
                if (colIdx > 1) colIdx = -1;

                const tile = area[i];
                expect(tile.x).toBe(center.x + colIdx);
                expect(tile.y).toBe(center.y + rowIdx);

                colIdx++;
            }
        });

        it('should return an empty array if given tile is undefined', () => {
            expect(MapUtils.getAreaOfRadius()).toEqual([]);
        });

        it('should return an empty array if x property of given point is undefined', () => {
            expect(MapUtils.getAreaOfRadius({ y: 2 })).toEqual([]);
        });

        it('should return an empty array if y property of given point is undefined', () => {
            expect(MapUtils.getAreaOfRadius({ x: 2 })).toEqual([]);
        });

        it('should return an empty array if x property of given point is not a number or is NaN', () => {
            expect(MapUtils.getAreaOfRadius({ y: 2, x: 'a' })).toEqual([]);
            expect(MapUtils.getAreaOfRadius({ y: 2, x: NaN })).toEqual([]);
        });

        it('should return an empty array if y property of given point is not a number or is NaN', () => {
            expect(MapUtils.getAreaOfRadius({ x: 2, y: 'a' })).toEqual([]);
            expect(MapUtils.getAreaOfRadius({ x: 2, y: NaN })).toEqual([]);
        });
    });

    describe('isSameTile', () => {
        it('should return true if both tiles are same', () => {
            const tile = { x: 1, y: 1 };
            expect(MapUtils.isSameTile(tile, tile)).toBeTruthy();
        });

        it('should return true if both have same x and y', () => {
            const tile1 = { x: 1, y: 1 };
            const tile2 = { x: 1, y: 1 };
            expect(MapUtils.isSameTile(tile1, tile2)).toBeTruthy();
        });

        it('should return false if x properties differ', () => {
            const tile1 = { x: 1, y: 1 };
            const tile2 = { x: 2, y: 1 };
            expect(MapUtils.isSameTile(tile1, tile2)).toBeFalsy();
        });

        it('should return false if y properties differ', () => {
            const tile1 = { x: 1, y: 1 };
            const tile2 = { x: 1, y: 2 };
            expect(MapUtils.isSameTile(tile1, tile2)).toBeFalsy();
        });

        it('should return false if either tile is undefined', () => {
            const tile = { x: 1, y: 1 };
            expect(MapUtils.isSameTile(tile, undefined)).toBeFalsy();
            expect(MapUtils.isSameTile(undefined, tile)).toBeFalsy();
        });

        it('should return false if either tile has no x property', () => {
            const valid = { x: 1, y: 1 };
            const invalid = { y: 1 };
            expect(MapUtils.isSameTile(valid, invalid)).toBeFalsy();
            expect(MapUtils.isSameTile(invalid, valid)).toBeFalsy();
        });

        it('should return false if either tile has no y property', () => {
            const valid = { x: 1, y: 1 };
            const invalid = { x: 1 };
            expect(MapUtils.isSameTile(valid, invalid)).toBeFalsy();
            expect(MapUtils.isSameTile(invalid, valid)).toBeFalsy();
        });
    });

    describe('isSomeObjectOnTile', () => {
        it('should return true if object is on given tile', () => {
            const objects = [{ x: 1 * tileSize, y: 1 * tileSize }];
            const tile = { x: 1, y: 1 };
            expect(MapUtils.isSomeObjectOnTile(tile, objects)).toBeTruthy();
        });

        it('should return false if object is not on given tile', () => {
            const objects = [{ x: 1 * tileSize, y: 1 * tileSize }];
            const tile = { x: 2, y: 2 };
            expect(MapUtils.isSomeObjectOnTile(tile, objects)).toBeFalsy();
        });

        it('should return false if objects array is not defined or is empty', () => {
            const tile = { x: 2, y: 2 };
            expect(MapUtils.isSomeObjectOnTile(tile)).toBeFalsy();
            expect(MapUtils.isSomeObjectOnTile(tile, [])).toBeFalsy();
        });

        it('should return false if object is on given tile but is included in the excludes list', () => {
            const objects = [{ x: 1 * tileSize, y: 1 * tileSize }];
            const tile = { x: 2, y: 2 };
            expect(MapUtils.isSomeObjectOnTile(tile, objects, objects)).toBeFalsy();
        });

        it('should return false if object is on given tile and is not included in the excludes list', () => {
            const objects = [
                { x: 1 * tileSize, y: 1 * tileSize },
                { x: 1 * tileSize, y: 1 * tileSize },
            ];
            const excluded = [objects[0]];
            const tile = { x: 1, y: 1 };
            expect(MapUtils.isSomeObjectOnTile(tile, objects, excluded)).toBeTruthy();
        });
    });

    describe('isWithinMap', () => {
        it('should return false if x is lesser than 1', () => {
            let tile = { x: -1, y: 1 };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
            tile = { x: 0, y: 1 };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
        });

        it('should return false if y is lesser than 1', () => {
            let tile = { x: 1, y: -1 };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
            tile = { x: 1, y: 0 };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
        });

        it('should return false if given tile is invalid', () => {
            let tile = { x: 1 };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
            tile = { y: 1 };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
            tile = { x: 1, y: 'abc' };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
            tile = { x: NaN, y: 1 };
            expect(MapUtils.isWithinMap({}, tile)).toBeFalsy();
        });

        it('should return false if tile\'s x is greater than map\'s width', () => {
            const map = { width: 10, height: 10 };
            const tile = { x: 11, y: 10 };
            expect(MapUtils.isWithinMap(map, tile)).toBeFalsy();
        });

        it('should return false if tile\'s y is greater than map\'s heigth', () => {
            const map = { width: 10, height: 10 };
            const tile = { x: 10, y: 11 };
            expect(MapUtils.isWithinMap(map, tile)).toBeFalsy();
        });

        it('should return true y and x are greater than zero and smaller than map height and width', () => {
            const map = { width: 10, height: 10 };
            const tile = { x: 9, y: 9 };
            expect(MapUtils.isWithinMap(map, tile)).toBeTruthy();
        });

        it('should return false y and x are greater than zero but same as map height and width', () => {
            const map = { width: 10, height: 10 };
            const tile = { x: 10, y: 10 };
            expect(MapUtils.isWithinMap(map, tile)).toBeFalsy();
        });
    });
});
