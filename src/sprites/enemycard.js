import GUIButton from '../hud/guibutton';
import SpriteBase from '../sprites/spritebase';
import Commands from '../commands/commands';

/**
 * Create enemy image
 * @private
 */
function createEnemyImage(game, enemy) {
    const enemyImage = game.make.sprite(134, 122, 'actors', enemy.frame);
    enemyImage.anchor.set(0.5);
    enemyImage.scale.set(1.5);
    return enemyImage;
}

/**
 * Create text with standard styling
 * @private
 * @param   {string} textString Text to show
 * @param   {number} size Font size
 * @return  {Phaser.Text}
 */
function createText(game, textString, size) {
    const text = game.make.text(0, 0, textString);
    text.font = 'komika_axisregular';
    text.fontSize = size;
    text.fill = '#000000';
    text.boundsAlignH = 'center';
    text.boundsAlignV = 'middle';

    return text;
}

function onAttackButtonClick() {
    new Commands.AttackCommand(this.actorInTurn, this.enemy).dispatch();
    this.kill();
}

/**
 * @class EnemyCard
 * @description Enemy details display
 * @extends {SpriteBase}
 */
export default class EnemyCard extends SpriteBase {

    /**
     * Creates an instance of EnemyCard.
     * @param {Phaser.Game} game
     * @param {Enemy} enemy
     * @param {Actor} actorInTurn
     * @param {Boolean} canPlayerAttack
     * @memberOf EnemyCard
     */
    constructor(game, enemy, actorInTurn, canPlayerAttack) {
        super(game, 0, 0, 'enemy_card');

        this.x = (game.width / 2) - (this.width / 2);
        this.y = (game.height / 2) - (this.height / 2);

        this.enemy = enemy;
        this.actorInTurn = actorInTurn;
        this.canPlayerAttack = canPlayerAttack;

        this.addChild(createEnemyImage(this.game, this.enemy));
        this.createCardTexts();
        this.createCloseButton();
        this.createActionsButtons();
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
     * Create close button
     * @private
     */
    createCloseButton() {
        //  And click the close button to close it down again
        const closeButton = this.game.make.sprite(this.width, 0, 'close_button');
        closeButton.inputEnabled = true;
        closeButton.input.priorityID = 1;
        closeButton.anchor.set(0.5);
        closeButton.events.onInputDown.add(this.kill, this);
        this.addChild(closeButton);
    }

    /**
     * Create relevant action buttons
     * @private
     */
    createActionsButtons() {
        if (this.canPlayerAttack) {
            const attackButton = new GUIButton(this.game, (this.x / 2) - 37.5, 338, 'Attack', onAttackButtonClick.bind(this), 'red');
            attackButton.scale.set(0.6);
            this.addChild(attackButton);
        }
    }

    /**
     * Create all texts
     * @private
     */
    createCardTexts() {
        const { name, enemyType, description } = this.enemy;

        const nameText = createText(this.game, name, 16);
        nameText.setTextBounds(40, 30, 190, 36);
        this.addChild(nameText);

        const typeText = createText(this.game, enemyType, 16);
        typeText.setTextBounds(40, 180, 190, 26);
        this.addChild(typeText);

        const descriptionText = createText(this.game, description, 12);
        descriptionText.font = 'Arial';
        descriptionText.fontWeight = 'normal';
        descriptionText.setTextBounds(40, 205, 190, 70);
        descriptionText.wordWrap = true;
        descriptionText.wordWrapWidth = 190;
        descriptionText.lineSpacing = -4;
        this.addChild(descriptionText);

        this.createAttributeTexts();
    }
    /**
     * Create attribute texts and values (attack, defence, movement)
     * @private
     */
    createAttributeTexts() {
        let yPos = 270;

        ['attack', 'defence', 'movement'].forEach((prop) => {
            const text = createText(this.game, prop, 14);
            text.setTextBounds(50, yPos, 165, 20);
            text.boundsAlignH = 'left';
            this.addChild(text);

            const valueText = createText(this.game, `${this.enemy[prop]}`, 14);
            valueText.setTextBounds(50, yPos, 165, 20);
            valueText.boundsAlignH = 'right';
            this.addChild(valueText);

            yPos += 14;
        });
    }
}
