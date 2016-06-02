//import {Text} from 'phaser';
import {each} from 'lodash';
import SpriteBase from 'sprites/spritebase';

export default class StatBoard extends SpriteBase {

    /**
     * @constructor
     * @param       {paramType}
     * @return      {StatBoard}
     */
    constructor(game, x, y, player) {
        super(game, x, y, 'statboard');

        this.player = player;
        this.game = game;

        this._createStatTexts();
    }

    updateAttributes() {
        const {attack, defence, movementPoints, health} = this.player;
        this.attackText.setText(attack);
        this.defenceText.setText(defence);
        this.healthText.setText(health);
        this.movementPointsText.setText(movementPoints);
    }

    _createStatTexts() {
        const {attack, defence, movementPoints, health} = this.player;
        const stepX = 66.2;
        let startX = 19;

        each({ health, attack, defence, movementPoints }, (prop, key) => {
            const text = this._createText(startX, prop);

            this[key + 'Text'] = text;

            startX += stepX;
        });
    }

    _createText(x, textStr) {
        const style = {
            font: 'bold 28.23px komika_axisregular',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        };
        const text = this.game.add.text(0, 0, textStr, style);

        text.setTextBounds(this.x + x, this.y + 58, 66.2, 25.5);

        return text;
    }
}