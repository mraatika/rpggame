import { Graphics } from 'phaser';
import { getCoordinatePositionByTile } from '../utils/maputils';

const POINTER_ALPHA = 0.5;
const POINTER_RADIUS = 20;

export default class PointerMark extends Graphics {
    constructor(game) {
        super(game, 0, 0);
    }

    draw(tile, color) {
        const { x, y } = getCoordinatePositionByTile(tile);

        this.lineStyle(0);
        this.beginFill(color, POINTER_ALPHA);
        this.drawCircle(x, y, POINTER_RADIUS);
        this.endFill();
    }
}
