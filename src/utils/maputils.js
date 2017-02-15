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
 * @param  {Phaser.point} A point object with x and y properties
 * @param  {number} [anchor = .5]
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
 * Get the surrounding tiles' coordinates
 * @export
 * @param  {Phaser.Point} tile The center tile
 * @returns {Array} An array of Phaser.Point objects
 */
export function getSurroundingTiles(tile) {
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
 * Return the opposite direction of given direction
 * @export
 * @param  {LEFT|RIGHT|UP|DOWN|NONE} direction Phaser direction enum (Phaser.[DIRECTION])
 * @return {LEFT|RIGHT|UP|DOWN|NONE}
 */
export function getOppositeOf(direction) {
    switch (direction) {
    case Phaser.RIGHT:
        return Phaser.LEFT;
    case Phaser.LEFT:
        return Phaser.RIGHT;
    case Phaser.UP:
        return Phaser.DOWN;
    case Phaser.DOWN:
        return Phaser.UP;
    default:
        return false;
    }
}
/**
 * Get an area of tiles as a two dimensional array
 * @export
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 * @returns {Array[]}
 */
export function getArea(startX, startY, endX, endY) {
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
 * @param {number} radius
 * @returns
 */
export function getAreaOfRadius(center, radius) {
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
 * @param  {Phaser.Sprite} tileA
 * @param  {Phaser.Tile} tileB
 * @param  {boolean} convertToTilePosition If true will convert x and y coordinates to tiles
 * @returns {boolean}
 */
export function isSameTile(tileA, tileB, convertToTilePosition) {
    if (!tileA || !tileB) return false;

    let a = tileA;
    let b = tileB;

    if (convertToTilePosition) {
        a = getTilePositionByCoordinates(new Phaser.Point(tileA.x, tileA.y));
        b = getTilePositionByCoordinates(new Phaser.Point(tileB.x, tileB.y));
    }

    return a.x === b.x && a.y === b.y;
}

/**
 * Check if given object is on tile
 * @export
 * @param {Phaser.Point} tile
 * @param {Object[]} objects
 * @param {Object[]} [excludes=[]]
 * @returns
 */
export function isObjectOnTile(tile, objects, excludes = []) {
    return objects.find((o) => {
        const position = getTilePositionByCoordinates(new Phaser.Point(o.x, o.y));
        return excludes.indexOf(o) < 0 && isSameTile(tile, position);
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
    return tile.x >= 0 && tile.y >= 0 &&
        tile.x < map.width && tile.y < map.height;
}

/**
 * Check if tile is walkable (an actor can move on it)
 * @export
 * @param  {Phaser.TileMap} map The tilemap the tile is on
 * @param  {Phaser.Point} tile The tile to check
 * @param  {Actor[]} actors An array of actors on the map
 * @param  {string} layer
 * @return {boolean}
 */
export function isWalkable(map, tile, actors, layer = 'wallslayer') {
    return isWithinMap(map, tile) &&
        map.getTile(tile.x, tile.y, layer, true).index === -1 &&
        !isObjectOnTile(tile, actors);
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

    if (maxDistance < path.length) {
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
