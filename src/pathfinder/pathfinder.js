import {Point} from 'phaser';
import {each, map} from 'lodash';
import EasyStar from 'easystarjs';
import MapUtils from 'common/maputils';

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
    constructor(game, props = {}) {
        this.game = game;
        this._easyStar = new EasyStar.js();
        this._grid = null;
        each(props, this._setProp);
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
        const grid = this._formGrid(tiles);

        this._tiles = tiles;
        this._setGrid(grid);

        this._easyStar.setAcceptableTiles(acceptableTiles);
    }

    /**
     * Update obstacle positions of obstacles not derived from map data (actors etc.)
     * @param  {Phaser.Point[]} obstacles
     */
    updateObstaclePositions(obstacles) {
        const positions = map(obstacles, obstacle => {
            const tilePosition = MapUtils.getTilePositionByCoordinates(new Point(obstacle.x, obstacle.y));
            return [tilePosition.x, tilePosition.y];
        });

        const grid = this._formGrid(this._tiles, positions);

        this._setGrid(grid);
    }

    /**
     * Set easystarjs property
     * @param {string} property name of the property
     * @param {*} value value of the property
     */
    setProperty(property, value) {
        this._setProp(property, value);
    }

    /**
     * Find path from start to end and then call callback
     * @param  {Phaser.Point} start
     * @param  {Phaser.Point} end
     * @param  {Function} callback
     */
    findPath(start, end, callback) {
        // prepare the path calculation
        this._easyStar.findPath(start.x, start.y, end.x, end.y, callback);
        // only calculate if necessary
        return this._easyStar.calculate();
    }

    /**
     * Form two dimensional array from given array
     * @private
     * @param   {Array} tiles
     * @param   {Array} [obstacles = []]
     * @return  {Array[]}
     */
    _formGrid(tiles, obstacles = []) {
        const grid = [];

        for (let r = 0; r < tiles.length; r++) {
            grid[r] = [];

            for (let c = 0; c < tiles[r].length; c++) {
                grid[r][c] = this._isInObstacles(obstacles, r, c) ? 99 : tiles[r][c].index;
            }
        }

        return grid;
    }

    _setGrid(grid) {
        this._grid = grid;
        this._easyStar.setGrid(grid);
    }

    _isInObstacles(obstacles, row, col) {
        for (let i in obstacles) {
            if (obstacles[i][0] == row && obstacles[i][1] == col) return true;
        }

        return false;
    }

    /**
     * Set property
     * @private
     * @param   {string} name
     * @param   {*} value
     */
    _setProp(name, value) {
        if (name == 'diagonals' && value) {
            this._easyStar.enableDiagonals();
        }

        if (name == 'cornerCutting' && value) {
            this._easyStar.enableCornerCutting();
        }

        if (name == 'iterations') {
            this._easyStar.setIterationsPerCalculation(value);
        }

        if (name == 'sync' && value) {
            this._easyStar.enableSync();
        }
    }
}