import { Graphics } from 'phaser';
import { getCoordinatePositionByTile } from '../utils/maputils';

export default class PointerMark extends Graphics {
    constructor(game) {
        super(game, 0, 0);
    }

    draw(tile, color) {
        const { x, y } = getCoordinatePositionByTile(tile);

        this.lineStyle(0);
        this.beginFill(color, 0.5);
        this.drawCircle(x, y, 20);
        this.endFill();

        this.game.add.existing(this);
    }
}
