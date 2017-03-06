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
 * @name PathFinder
 * Wrapper for easystarjs path finding library
 * @exports
 * @param {Object} [props]
 * @param {Object} [settings={}]
 * @returns {PathFinder}
 */
export default function pathFinder({
    map,
    layer,
    obstacles = [],
    acceptableTiles = [-1],
}, settings = {}) {
    /**
     * PathFinder's public props
     */
    const publicProps = {
        // eslint-disable-next-line
        easyStar: new EasyStar.js()
    };

    /**
     * PathFinder's public methods
     */
    const methods = {
        /**
         * Form a grid from TileMap and obstacles group (basically actors) for easyStar
         * @memberOf PathFinder
         */
        updateGrid() {
            const layerIndex = map.getLayerIndex(layer);
            const { data } = map.layers[layerIndex];
            const obstacleTiles = obstacles.map(obstacle =>
                getTilePositionByCoordinates(obstacle.position));

            this.easyStar.setGrid(formGrid(data, obstacleTiles));
            this.easyStar.setAcceptableTiles(acceptableTiles);
        },

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
        },

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
        },
    };

    const finder = Object.assign(
        {},
        publicProps,
        methods,
    );

    // set all settings to easystar
    Object.keys(settings).forEach(key => finder.setProperty(key, settings[key]));

    return finder;
}
