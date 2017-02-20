import { Graphics } from 'phaser';
import SpriteBase from '../sprites/spritebase';
import { getCoordinatePositionByTile } from '../utils/maputils';

const DOT_ALPHA = 0.5;
const DOT_RADIUS = 10;

export default class MouseTrail extends SpriteBase {
    constructor(game) {
        super(game, 0, 0);
        this.graphics = new Graphics(game, 0, 0);
        this.addChild(this.graphics);
    }

    draw(path, color) {
        const coordinates = path.map(tile => getCoordinatePositionByTile(tile));

        this.graphics.lineStyle(0);

        coordinates.forEach((point) => {
            this.graphics.beginFill(color, DOT_ALPHA);
            this.graphics.drawCircle(point.x, point.y, DOT_RADIUS);
            this.graphics.endFill();
        });
    }
}
