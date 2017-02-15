import SpriteBase from '../sprites/spritebase';

function createText(x, textStr) {
    const style = {
        font: 'bold 28.23px komika_axisregular',
        boundsAlignH: 'center',
        boundsAlignV: 'middle',
    };
    const text = this.game.add.text(0, 0, textStr, style);

    text.setTextBounds(this.x + x, this.y + 58, 66.2, 25.5);

    return text;
}

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

        this.createStatTexts();
    }

    updateAttributes() {
        const { attack, defence, movementPoints, health } = this.player;
        this.attackText.setText(attack);
        this.defenceText.setText(defence);
        this.healthText.setText(health);
        this.movementPointsText.setText(movementPoints);
    }

    createStatTexts() {
        const { attack, defence, movementPoints, health } = this.player;
        const stepX = 66.2;
        let startX = 19;
        const props = { health, attack, defence, movementPoints };

        Object.keys(props).forEach((key) => {
            const text = createText.call(this, startX, props[key]);
            this[`${key}Text`] = text;
            startX += stepX;
        });
    }
}
