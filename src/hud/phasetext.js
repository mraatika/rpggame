import { Text } from 'phaser';

export default class HudPhaseText extends Text {
    /**
     * @constructor
     * @param       {paramType}
     * @return      {HudPhaseText}
     */
    constructor(game, x, y) {
        super(game, x, y, '');

        this.font = 'deutsch_gothicnormal';
        this.fontSize = 28;
        this.fill = '#eee';
        this.stroke = '#222';
        this.strokeThickness = 4;
        this.padding.set(0, 16);
    }
}
