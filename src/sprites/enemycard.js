import SpriteBase from 'sprites/spritebase';
import GUIButton from 'hud/guibutton';
import Commands from 'commands/commands';

/**
 * @class EnemyCard
 * @description Enemy details display
 * @extends {SpriteBase}
 */
export default class EnemyCard extends SpriteBase {

    /**
     * @constructor
     * @param       {Phaser.State} state
     * @param       {Enemy} enemy
     * @param       {boolean} canPlayerAttack Displays attack button if true
     * @return      {EnemyCard}
     */
    constructor(state, enemy, canPlayerAttack) {
        const game = state.game;

        super(game, 0, 0, 'enemy_card');

        this.x = game.width / 2 - this.width / 2;
        this.y = game.height / 2 - this.height / 2;

        this.enemy = enemy;
        this.state = state;
        this.canPlayerAttack = canPlayerAttack;

        this._createEnemyImage();
        this._createCardTexts();
        this._createCloseButton();
        this._createActionsButtons();
    }

    /**
     * Show this card
     * @return {EnemyCard} this
     */
    show() {
        this.game.add.existing(this);
        return this;
    }

    /**
     * Create enemy image
     * @private
     */
    _createEnemyImage() {
        const enemyImage = this.game.make.sprite(134, 122, 'actors', this.enemy.frame);
        enemyImage.anchor.set(0.5);
        enemyImage.scale.set(1.5);
        this.addChild(enemyImage);
    }

    /**
     * Create close button
     * @private
     */
    _createCloseButton() {
        //  And click the close button to close it down again
        const closeButton = this.game.make.sprite(this.width, 0, 'close_button');
        closeButton.inputEnabled = true;
        closeButton.input.priorityID = 1;
        closeButton.anchor.set(.5);
        closeButton.events.onInputDown.add(this.kill, this);
        this.addChild(closeButton);
    }

    /**
     * Create relevant action buttons
     * @private
     */
    _createActionsButtons() {
        if (this.canPlayerAttack) {
            const attackButton = new GUIButton(this.game, this.x / 2 - 37.5, 338, 'Attack', this._onAttackButtonClick.bind(this), 'red');
            attackButton.scale.set(0.6);
            this.addChild(attackButton);
        }
    }

    /**
     * Create all texts
     * @private
     */
    _createCardTexts() {
        const {name, enemyType, description} = this.enemy;

        const nameText = this._createText(name, 16);
        nameText.setTextBounds(40, 30, 190, 36);
        this.addChild(nameText);

        const typeText = this._createText(enemyType, 16);
        typeText.setTextBounds(40, 180, 190, 26);
        this.addChild(typeText);

        const descriptionText = this._createText(description, 12);
        descriptionText.font = 'Arial';
        descriptionText.fontWeight = 'normal';
        descriptionText.setTextBounds(40, 205, 190, 70);
        descriptionText.wordWrap = true;
        descriptionText.wordWrapWidth = 190;
        descriptionText.lineSpacing = -4;
        this.addChild(descriptionText);

        this._createAttributeTexts();
    }

    /**
     * Create text with standard styling
     * @private
     * @param   {string} textString Text to show
     * @param   {number} size Font size
     * @return  {Phaser.Text}
     */
    _createText(textString, size) {
        const text = this.game.make.text(0, 0, textString);
        text.font = 'komika_axisregular';
        text.fontSize = size;
        text.fill = '#000000';
        text.boundsAlignH = 'center';
        text.boundsAlignV = 'middle';

        return text;
    }

    /**
     * Create attribute texts and values (attack, defence, movement)
     * @private
     */
    _createAttributeTexts() {
        let yPos = 270;

        ['attack', 'defence', 'movement'].forEach(prop => {
            const text = this._createText(prop, 14);
            text.setTextBounds(50, yPos, 165, 20);
            text.boundsAlignH = 'left';
            this.addChild(text);

            const valueText = this._createText('' + this.enemy[prop], 14);
            valueText.setTextBounds(50, yPos, 165, 20);
            valueText.boundsAlignH = 'right';
            this.addChild(valueText);

            yPos += 14;
        });
    }

    _onAttackButtonClick() {
        new Commands.AttackCommand(this.state.player, this.enemy).dispatch();
        this.kill();
    }
}