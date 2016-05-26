import EasyStar from 'easystarjs';
import {each, defer} from 'lodash';

export default class PathFinder {

    constructor(game, props = {}) {
        this.game = game;
        this._easyStar = new EasyStar.js();
        each(props, this._setProp);
    }

    setGrid(map, layerName, acceptableTiles = [-1]) {
        const layerIndex = map.getLayerIndex(layerName);
        const layer = map.layers[layerIndex];
        const tiles = layer.data;

        this._grid = this._formGrid(tiles);
        this._easyStar.setGrid(this._grid);
        this._easyStar.setAcceptableTiles(acceptableTiles);
    }

    setProperty(property, value) {
        this._setProp(property, value);
    }

    findPath(start, end, callback) {
        // prepare the path calculation
        this._easyStar.findPath(start.x, start.y, end.x, end.y, this._callbackWrapper(start, callback));

        // defer calculate call cause findPath calls the callback if the start and end points are the
        // same or the end point is not in acceptables list
        defer(() => {
            // only calculate if necessary
            if (!this._calculationFutile) this._easyStar.calculate();
            else this._calculationFutile = false;
        });
    }

    _formGrid(tiles) {
        const grid = [];

        for (let r = 0; r < tiles.length; r++) {
            grid[r] = [];

            for (let c = 0; c < tiles[r].length; c++) {
                grid[r][c] = tiles[r][c].index;
            }
        }

        return grid;
    }

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

        if (name == 'sync') {
            this._easyStar.enableSync();
        }
    }

    _callbackWrapper(startPoint, callback) {
        return function(path = []) {
            // if path is empty no calculation is needed
            this._calculationFutile = !(path || []).length;
            // if start point is selected then the path contains
            // only the start point
            if (!path.length) { path.push(startPoint); }
            callback.call(null, path);
        }.bind(this);
    }
}