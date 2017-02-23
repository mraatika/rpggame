import Commands from '../commands/commands';
import template from '../templates/enemycard.html';
import { tpl } from '../utils/utils';
import EnemyCardManager from '../classes/enemycardmanager';
import './enemycard.css';

function getRelevantProps(enemy) {
    const { name, enemyType, description, attack, defence, movement } = enemy;

    return {
        name,
        enemyType,
        description,
        attack,
        defence,
        movement,
        actorImgClass: name.toLowerCase().replace(/\s/g, ''),
    };
}

function onAttackClick() {
    new Commands.AttackCommand(this.actorInTurn, this.enemy).dispatch();
    EnemyCardManager.hide(this.enemy);
}

function createRootElement() {
    const div = global.document.createElement('div');
    const stats = getRelevantProps(this.enemy);
    const interpolated = tpl(template, stats);

    div.className = 'enemy-card-root';
    div.innerHTML = interpolated;

    const closeButton = div.getElementsByClassName('close-button')[0];
    closeButton.addEventListener('click', () => EnemyCardManager.hide(this.enemy));

    const attackButton = div.getElementsByClassName('button-attack')[0];
    attackButton.addEventListener('click', onAttackClick.bind(this));
    this.attackButton = attackButton;

    global.document.body.appendChild(div);

    return div;
}


/**
 * @class EnemyCard
 * @description Enemy details display
 * @extends {SpriteBase}
 */
export default class EnemyCard {

    /**
     * Creates an instance of EnemyCard.
     * @param {Phaser.Game} game
     * @param {Enemy} enemy
     * @param {Boolean} canPlayerAttack
     * @memberOf EnemyCard
     */
    constructor(game, enemy) {
        this.enemy = enemy;
    }

    /**
     * Show this card
     * @return {EnemyCard} this
     */
    show(actorInTurn, canPlayerAttack) {
        if (!this.rootElement) this.rootElement = createRootElement.call(this);
        this.rootElement.style.display = 'block';
        this.actorInTurn = actorInTurn;
        this.attackButton.disabled = !canPlayerAttack;
        return this;
    }

    hide() {
        this.rootElement.style.display = 'none';
    }

    destroy() {
        global.document.body.removeChild(this.rootElement);
    }
}
