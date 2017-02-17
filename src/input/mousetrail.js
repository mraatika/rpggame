import { Graphics } from 'phaser';
import SpriteBase from '../sprites/spritebase';
import { getCoordinatePositionByTile } from '../utils/maputils';

const LINE_GAP = 5;
const LINE_ALPHA = 0.5;
const LINE_WIDTH = 8;

export default class MouseTrail extends SpriteBase {
    constructor(game) {
        super(game, 0, 0);
        this.graphics = new Graphics(game, 0, 0);
        this.addChild(this.graphics);
    }

    draw(path, color) {
        const coordinates = path.map(tile => getCoordinatePositionByTile(tile));
        const start = coordinates[0];

        this.graphics.lineStyle(LINE_WIDTH, color, LINE_ALPHA);
        this.graphics.moveTo(start.x, start.y);

        coordinates.forEach((point, i) => {
            const nextPoint = coordinates[i + 1];

            this.graphics.lineTo(point.x, point.y);

            if (!nextPoint) return;

            if (nextPoint.x > point.x) {
                this.graphics.moveTo(point.x + LINE_GAP, point.y);
            } else if (nextPoint.x < point.x) {
                this.graphics.moveTo(point.x - LINE_GAP, point.y);
            }

            if (nextPoint.y > point.y) {
                this.graphics.moveTo(point.x, point.y + LINE_GAP);
            } else if (nextPoint.y < point.y) {
                this.graphics.moveTo(point.x, point.y - LINE_GAP);
            }
        });
    }
}
