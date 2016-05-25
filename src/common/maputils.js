import Phaser from 'phaser';
import {find} from 'lodash';
import gameConfig from 'json!assets/config/gameconfig.json';

/**
 * Utility functions for object movement
 * @type {Object}
 */
export default class MapUtils {

    /**
     * Get the x and y index of an object's position
     * @param  {Phaser.Point} Point object with x and y coordinates
     * @param  {number} tileSize Size of a single tile
     * @return {Phaser.Point}
     */
    static getTilePositionByCoordinates(point) {
        return new Phaser.Point(
            MapUtils.getTileIndexOf(point.x),
            MapUtils.getTileIndexOf(point.y)
        );
    }

    /**
     * Get position of a tile as pixel coordinates
     * @param  {Phaser.point} A point object with x and y properties
     * @param  {number} [tileSize = gameConfig.map.tileSize] Size of a single tile
     * @param  {number} [anchor = .5]
     * @return {Phaser.Point}
     */
    static getCoordinatePositionByTile(point, tileSize = gameConfig.map.tileSize, anchor = .5) {
        return new Phaser.Point(
            MapUtils.getTileCoordinateByTileIndex(point.x, tileSize, anchor),
            MapUtils.getTileCoordinateByTileIndex(point.y, tileSize, anchor)
        );
    }

    /**
     * Get the surrounding tiles' coordinates
     * @param  {Phaser.Point} tile The center tile
     * @return {Array} An array of Phaser.Point objects
     */
    static getSurroundingTiles(tile) {
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
            new Phaser.Point(tile.x, tile.y + 1)
        ];
    }

    /**
     * Return the opposite direction of given direction
     * @param  {LEFT|RIGHT|UP|DOWN|NONE} direction Phaser direction enum (Phaser.[DIRECTION])
     * @return {LEFT|RIGHT|UP|DOWN|NONE}
     */
    static getOppositeOf(direction) {
        switch(direction) {
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
     * Get the anchor position of a tile as pixel coordinates
     * @param  {number} tileIndex Index of a given tile
     * @param  {[type]} tileSize Size of a single tile in tile map
     * @param  {number} anchor [description]
     * @return {[type]}
     */
    static getTileCoordinateByTileIndex(tileIndex, tileSize = gameConfig.map.tileSize, anchor = .5) {
        return (tileIndex * tileSize) + (tileSize * anchor);
    }

    /**
     * Get the index of a tile where the given pixel coordinate is
     * @param  {number} coordinate x or y coordinate
     * @param  {number} tileSize Size of a single tile in the tilemap
     * @return {number} tile index
     */
    static getTileIndexOf(coordinate, tileSize = gameConfig.map.tileSize) {
        return Phaser.Math.snapToFloor(Math.floor(coordinate), tileSize) / tileSize;
    }

    static getArea(startX, startY, endX, endY) {
        const tiles = [];

        for (let r = startY; r <= endY; r++) {
            for (let c = startX; c <= endX; c++) {
                tiles.push(new Phaser.Point(c, r));
            }
        }

        return tiles;
    }

    /**
     * Check given tiles are the same tile
     * @param  {Phaser.Sprite} tileA
     * @param  {Phaser.Tile} tileB
     * @return {boolean}
     */
    static isSameTile(tileA, tileB) {
        if (!tileA || !tileB) return false;
        return tileA.x == tileB.x && tileA.y == tileB.y;
    }

    /**
     * Check if tile is walkable (an actor can move on it)
     * @param  {Phaser.TileMap} map The tilemap the tile is on
     * @param  {Phaser.Point} tile The tile to check
     * @param  {Array} actors An array of actors on the map
     * @param  {string} layer
     * @return {Boolean}
     */
    static isWalkable(map, tile, actors, layer = 'wallslayer') {
        return this.isWithinMap(map, tile) &&
            map.getTile(tile.x, tile.y, layer, true).index == -1 &&
            !MapUtils.isTileOccupied(tile, actors);
    }

    /**
     * Check if tile coordinates are within the map
     * @param  {Phaser.Map} map
     * @param  {Phaser.Point} tile
     * @return {Boolean}
     */
    static isWithinMap(map, tile) {
        return tile.x >= 0 && tile.y >= 0 &&
            tile.x < map.width && tile.y < map.height;
    }

    /**
     * Check if a given tile is occupied by an actor
     * @param  {Phaser.Point} tile
     * @param  {Array} actors An array of actors
     * @return {Boolean}
     */
    static isTileOccupied(tile, actors) {
        return find(actors, actor => {
            const actorPosition = MapUtils.getTilePositionByCoordinates(
                new Phaser.Point(actor.x, actor.y),
                gameConfig.map.tileSize
            );

            return MapUtils.isSameTile(tile, actorPosition, 0);
        });
    }

    /**
     * Check if given path is valid
     * @param  {Array} path An array of points
     * @param  {number} maxDistance
     * @return {Boolean}
     */
    static isValidPath(path, maxDistance) {
        // return false if endPoint is not walkable
        if (path == null) {
            console.log('Endpoint not walkable');
            return false;
        }

        // path also includes the current position
        if (maxDistance < path.length - 1) {
            console.log('Not enough movement points for path');
            return false;
        }

        return true;
    }
}