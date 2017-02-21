import { Point } from 'phaser';
import EasyStar from 'easystarjs';
import { getTilePositionByCoordinates } from '../utils/maputils';

function isInObstacles(obstacles, row, col) {
    return obstacles.find(obstacle => obstacle[0] === row && obstacle[1] === col);
}

/**
 * Form two dimensional array from given array
 * @private
 * @param   {Array} tiles
 * @return  {Array[]}
 */
function formGrid(tiles, obstacles = []) {
    const grid = [];

    for (let r = 0; r < tiles.length; r++) {
        grid[r] = [];

        for (let c = 0; c < tiles[r].length; c++) {
            grid[r][c] = isInObstacles(obstacles, r, c) ? 99 : tiles[r][c].index;
        }
    }

    return grid;
}

/**
 * @class PathFinder
 * @description Wrapper for easystarjs path finding library
 */
export default class PathFinder {

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Object} props
     * @return      {PathFinder}
     */
    constructor(props = {}) {
        // eslint-disable-next-line
        this.easyStar = new EasyStar.js();
        Object.keys(props).forEach(key => this.setProperty(key, props[key]));
    }
    /**
     * Set the grid (TileMap) to easystarjs
     * @param {Phaser.TileMap} map
     * @param {string} layerName Name of the layer containing the data
     * @param {Array} [acceptableTiles=[-1]] By default missing tiles are the walkable ones
     * @returns {undefined}
     */
    setGrid(map, layerName, acceptableTiles = [-1]) {
        const layerIndex = map.getLayerIndex(layerName);
        const layer = map.layers[layerIndex];
        const tiles = layer.data;

        this.tiles = tiles;
        this.easyStar.setGrid(formGrid(tiles));
        this.easyStar.setAcceptableTiles(acceptableTiles);
    }
    /**
     * Find path from start to end and then call callback
     * @param  {Phaser.Point} start
     * @param  {Phaser.Point} end
     * @param  {Function} callback
     */
    findPath(start, end, callback) {
        // prepare the path calculation
        this.easyStar.findPath(start.x, start.y, end.x, end.y, callback);
        return this.easyStar.calculate();
    }

    /**
     * Update obstacle positions of obstacles not derived from map data (actors etc.)
     * @param  {Phaser.Point[]} obstacles
     */
    updateObstaclePositions(obstacles) {
        const positions = obstacles.map((obstacle) => {
            const tilePosition = getTilePositionByCoordinates(new Point(obstacle.x, obstacle.y));
            return [tilePosition.x, tilePosition.y];
        });

        return formGrid(this.tiles, positions);
    }
    /**
     * Set property
     * @private
     * @param   {string} name
     * @param   {*} value
     */
    setProperty(name, value) {
        if (name === 'diagonals' && value) {
            this.easyStar.enableDiagonals();
        }

        if (name === 'cornerCutting' && value) {
            this.easyStar.enableCornerCutting();
        }

        if (name === 'iterations') {
            this.easyStar.setIterationsPerCalculation(value);
        }

        if (name === 'sync' && value) {
            this.easyStar.enableSync();
        }
    }
}
