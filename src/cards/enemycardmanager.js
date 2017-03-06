import EnemyCard from './enemycard';
import mount from '../vue/vuerenderer';

/**
 * All created card instances
 * @type {Object}
 */
let cards = {};

/**
 * Modal overlay to be displayed behind the card
 * @type {Modal}
 */
// const modal = new Modal();

/**
 * Create card for an enemy and memoize instance
 * @param {Enemy} enemy
 * @returns {EnemyCard}
 */
function createCardFor(enemy) {
    const card = mount(EnemyCard, { enemy });
    cards[enemy.name] = card;
    return card;
}

/**
 * Manager for handling enemy cards
 * @export
 * @name EnemyCardManager
 */
export default {
    /**
     * Hide modal and all enemycards
     * @static
     * @memberOf EnemyCardManager
     */
    hideAll() {
        Object.keys(cards).forEach(key => cards[key].hide());
    },

    /**
     * Show actor's card
     * @static
     * @param {Enemy} enemy Enemy whose card should be displayed
     * @param {Actor} actorInTurn Current actor in turn
     * @param {boolean} canBeAttacked Can current actor in turn attack this enemy
     * @memberOf EnemyCardManager
     */
    show(enemy, actorInTurn, canBeAttacked) {
        const card = cards[enemy.name];

        this.hideAll();

        (card || createCardFor(enemy)).show(actorInTurn, canBeAttacked);
    },

    /**
     * Hide modal and card of an enemy
     * @static
     * @param {Enemy} enemy
     * @memberOf EnemyCardManager
     */
    hide(enemy) {
        const card = cards[enemy.name];
        card.hide();
    },

    /**
     * Destroy modal and all cards
     * @static
     * @memberOf EnemyCardManager
     */
    destroy() {
        Object.keys(cards).forEach(key => cards[key].destroy());
        cards = {};
    },
};
