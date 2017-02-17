import Phaser from 'phaser';
import gameConfig from '../config/gameconfig.json';

const mapConfig = gameConfig.map;
const tileSize = mapConfig.tileSize;

/**
 * Get the index of a tile where the given pixel coordinate is
 * @param  {number} coordinate x or y coordinate
 * @return {number} tile index
 */
function getTileIndexOf(coordinate) {
    return Phaser.Math.snapToFloor(Math.floor(coordinate), tileSize) / tileSize;
}

/**
 * Get the anchor position of a tile as pixel coordinates
 * @param {number} tileIndex
 * @param {number} [anchor=0.5]
 * @returns {number}
 */
function getTileCoordinateByTileIndex(tileIndex, anchor = 0.5) {
    return (tileIndex * tileSize) + (tileSize * anchor);
}

/**
 * Get the x and y index of an object's position
 * @export
 * @param  {Phaser.Point} Point object with x and y coordinates
 * @param  {number} tileSize Size of a single tile
 * @returns {Phaser.Point}
 */
export function getTilePositionByCoordinates(point) {
    if (!point) return null;

    return new Phaser.Point(
        getTileIndexOf(point.x),
        getTileIndexOf(point.y),
    );
}

/**
 * Get position of a tile as pixel coordinates
 * @export
 * @param  {Phaser.Point} A point object with x and y properties
 * @param  {number} [anchor = 0.5]
 * @returns {Phaser.Point}
 */
export function getCoordinatePositionByTile(point, anchor = 0.5) {
    if (!point) return null;

    return new Phaser.Point(
        getTileCoordinateByTileIndex(point.x, anchor),
        getTileCoordinateByTileIndex(point.y, anchor),
    );
}

/**
 * Check that given object contains x and y coordinates
 * @param {Object} point
 * @returns {boolean}
 */
function isPointLike(point) {
    return point &&
        typeof point.x === 'number' &&
        typeof point.y === 'number' &&
        !isNaN(point.x) &&
        !isNaN(point.y);
}

/**
 * Get the surrounding tiles' coordinates
 * @export
 * @param  {Phaser.Point} tile The center tile
 * @returns {Array} An array of Phaser.Point objects
 */
export function getSurroundingTiles(tile) {
    if (!isPointLike(tile)) return [];

    // return all surrounding tiles
    // directions are 1-4 so index 0 is null
    return [
        null,
        // left
        new Phaser.Point(tile.x - 1, tile.y),
        // right
        new Phaser.Point(tile.x + 1, tile.y),
        // top
        new Phaser.Point(tile.x, tile.y - 1),
        // bottom
        new Phaser.Point(tile.x, tile.y + 1),
    ];
}

/**
 * Get an area of tiles as a two dimensional array
 * @param {number} startX lefttmost tile index
 * @param {number} startY topmost tile index
 * @param {number} endX righthmost tile index
 * @param {number} endY bottommost tile index
 * @returns {Point[]}
 */
function getArea(startX, startY, endX, endY) {
    const tiles = [];

    for (let r = startY; r <= endY; r++) {
        for (let c = startX; c <= endX; c++) {
            tiles.push(new Phaser.Point(c, r));
        }
    }

    return tiles;
}

/**
 * Get all tiles from a radius
 * @export
 * @param {Phaser.Point} center
 * @param {number} [radius=1]
 * @returns {Point[]}
 */
export function getAreaOfRadius(center, radius = 1) {
    if (!isPointLike(center)) return [];

    return getArea(
        center.x - radius,
        center.y - radius,
        center.x + radius,
        center.y + radius,
    );
}

/**
 * Check given tiles are the same tile
 * @export
 * @param  {Phaser.Sprite} a
 * @param  {Phaser.Tile} b
 * @returns {boolean}
 */
export function isSameTile(a, b) {
    if (!isPointLike(a) || !isPointLike(b)) return false;
    if (a === b) return true;
    return a.x === b.x && a.y === b.y;
}

/**
 * Check if given object is on tile
 * @export
 * @param {Phaser.Point} tile
 * @param {Object[]} [objects=[]]
 * @param {Object[]} [excludes=[]]
 * @returns
 */
export function isSomeObjectOnTile(tile, objects = [], excludes = []) {
    return objects.find((obj) => {
        const position = getTilePositionByCoordinates(obj);
        return excludes.indexOf(obj) < 0 && isSameTile(tile, position);
    });
}

/**
 * Check if tile coordinates are within the map
 * @export
 * @param  {Phaser.Map} map
 * @param  {Phaser.Point} tile
 * @return {boolean}
 */
export function isWithinMap(map, tile) {
    if (!isPointLike(tile)) return false;

    return tile.x >= 0 && tile.y >= 0 &&
        tile.x < map.width && tile.y < map.height;
}

/**
 * Check if tile is walkable (an actor can move on it)
 * @export
 * @param  {Phaser.TileMap} map The tilemap the tile is on
 * @param  {Phaser.Point} tile The tile to check
 * @param  {Actor[]} [actors=[]] An array of actors on the map
 * @param  {string} [layer='wallslayer']
 * @return {boolean}
 */
export function isWalkable(map, tile, actors = [], layer = 'wallslayer') {
    return tile &&
        isWithinMap(map, tile) &&
        map.getTile(tile.x, tile.y, layer, true).index === -1 &&
        !isSomeObjectOnTile(tile, actors);
}

/**
 * Check if given path is valid
 * @export
 * @param  {Phaser.Point[]} path
 * @param  {number} maxDistance
 * @return {boolean}
 */
export function isValidPath(path, maxDistance) {
    // return false if endPoint is not walkable
    if (path == null) {
        console.log('Endpoint not walkable');
        return false;
    }

    if ((path.length - 1) > maxDistance) {
        console.log('Not enough movement points for path');
        return false;
    }

    return true;
}

/**
 * Check if target is within an area
 * @export
 * @param {Phaser.Point[]} area
 * @param {Phaser.Point} targetPosition
 * @returns
 */
export function isTargetInArea(area, targetPosition) {
    return !!area.find(tile => isSameTile(targetPosition, tile));
}

/**
 * Check if target is on a subject's surrounding tile
 * @export
 * @param {Actor} subject
 * @param {Actor} target
 * @returns {boolean}
 */
export function isOnSurroundingTile(subject, target) {
    const sPosition = getTilePositionByCoordinates(subject.position);
    const tPosition = getTilePositionByCoordinates(target.position);
    const surroundings = getSurroundingTiles(sPosition);

    return isTargetInArea(surroundings, tPosition);
}
