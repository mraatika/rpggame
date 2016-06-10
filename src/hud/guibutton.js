import SpriteBase from 'sprites/spritebase';

/**
 * @class GUIButton
 * @description Button sprite for hud and other gui
 * @extends {SpriteBase}
 */
export default class GUIButton extends SpriteBase {
    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {number} x
     * @param       {number} y
     * @param       {Function} callback
     * @param       {string} [color=brown]
     * @return      {GUIButton}
     */
    constructor(game, x, y, text, callback, color = 'brown') {
        const colorProps = GUIButton.ButtonStyles[color];

        super(game, x, y, 'gui', colorProps.frame);

        this.game = game;

        this.inputEnabled = true;
        this.input.priorityID = 1;
        this.events.onInputDown.add(callback);

        this._createText(text, colorProps);
    }

    /**
     * Create text for this button
     * @private
     * @param   {string} text
     * @param   {Object} colorProps
     */
    _createText(text, colorProps) {
        const buttonTextStyle = {
            font: '18px komika_axisregular',
            fill: '#ffffff',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        };

        // button text
        const buttonText = this.game.make.text(0, 0, text, buttonTextStyle);
        buttonText.shadowFill = true;
        buttonText.shadowColor = colorProps.textShadow;
        buttonText.shadowOffsetX = 3;
        buttonText.shadowOffsetY = 3;
        buttonText.setTextBounds(0, 0, this.width, this.height);

        this.addChild(buttonText);
    }
}

/**
 * Style properties for different colored buttons
 * @type {Object}
 */
GUIButton.ButtonStyles = {
    'brown': {
        frame: 0,
        textShadow: '#552200'
    },
    'red': {
        frame: 1,
        textShadow: '#450000'
    },
    'green': {
        frame: 2,
        textShadow: '#133d13'
    }
};