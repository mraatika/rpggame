import EasyStar from 'easystarjs';
import { getTilePositionByCoordinates } from '../utils/maputils';

/**
 * Check if a tile has an obstacle on it
 * @param {Phaser.Point[]} obstacles
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
function isObstructed(obstacles, row, col) {
    return !!obstacles.find(obstacle => obstacle.y === row && obstacle.x === col);
}

/**
 * Form grid for easyStar
 * @param {Phaser.Point[]} tiles
 * @param {Phaser.Point[]} [obstacles=[]]
 * @returns {Phaser.Point[][]}
 */
function formGrid(tiles, obstacles = []) {
    const grid = [];

    tiles.forEach((row, rIdx) => {
        grid[rIdx] = [];

        row.forEach((col, cIdx) => {
            grid[rIdx][cIdx] = isObstructed(obstacles, rIdx, cIdx) ? 99 : col.index;
        });
    });

    return grid;
}

/**
 * @exports
 * @class PathFinder
 * @description Wrapper for easystarjs path finding library
 */
export default class PathFinder {
    /**
     * Creates an instance of PathFinder.
     * @param {Object} [props={}] PathFinder properties
     * @param {Object} [settings={}] EasyStar settings
     * @memberOf PathFinder
     */
    constructor(props = {}, settings = {}) {
        // eslint-disable-next-line
        this.easyStar = new EasyStar.js();
        this.map = props.map;
        this.layer = props.layer;
        this.obstacles = props.obstacles || [];
        this.acceptableTiles = props.acceptableTiles || [-1];

        Object.keys(settings).forEach(key => this.setProperty(key, settings[key]));
    }

    /**
     * Form a grid from TileMap and obstacles group (basically actors) for easyStar
     * @returns {undefined}
     * @memberOf PathFinder
     */
    updateGrid() {
        const { map, layer, obstacles, acceptableTiles } = this;
        const layerIndex = map.getLayerIndex(layer);
        const { data } = map.layers[layerIndex];
        const obstacleTiles = obstacles.map(obstacle =>
            getTilePositionByCoordinates(obstacle.position));

        this.easyStar.setGrid(formGrid(data, obstacleTiles));
        this.easyStar.setAcceptableTiles(acceptableTiles);
    }

    /**
     * Find path from start to end and then call callback
     * @param  {Phaser.Point} start
     * @param  {Phaser.Point} end
     * @param  {Function} callback
     * @memberOf PathFinder
     */
    findPath(start, end, callback) {
        this.updateGrid();
        this.easyStar.findPath(start.x, start.y, end.x, end.y, callback);
        return this.easyStar.calculate();
    }

    /**
     * Set property
     * @param {string} name
     * @param {any} value
     * @memberOf PathFinder
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
