import { Graphics } from 'phaser';
import { getCoordinatePositionByTile } from '../utils/maputils';

const LINE_GAP = 5;
const LINE_ALPHA = 0.5;

export default class MouseTrail extends Graphics {
    constructor(game) {
        super(game, 0, 0);
    }

    draw(path, color) {
        const coordinates = path.map(tile => getCoordinatePositionByTile(tile));
        const start = coordinates[0];

        this.lineStyle(10, color, LINE_ALPHA);
        this.moveTo(start.x, start.y);

        coordinates.forEach((point, i) => {
            const nextPoint = coordinates[i + 1];

            this.lineTo(point.x, point.y);

            if (!nextPoint) return;

            if (nextPoint.x > point.x) {
                this.moveTo(point.x + LINE_GAP, point.y);
            } else if (nextPoint.x < point.x) {
                this.moveTo(point.x - LINE_GAP, point.y);
            }

            if (nextPoint.y > point.y) {
                this.moveTo(point.x, point.y + LINE_GAP);
            } else if (nextPoint.y < point.y) {
                this.moveTo(point.x, point.y - LINE_GAP);
            }
        });

        this.game.add.existing(this);
    }
}
