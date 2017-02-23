import EnemyCard from '../dom/enemycard';
import Modal from '../dom/modal';

const cards = {};
const modal = new Modal();

function createCardFor(actor) {
    const card = new EnemyCard(actor.game, actor);
    cards[actor.name] = card;
    return card;
}

class EnemyCardManager {

    static hideAll() {
        modal.hide();
        Object.keys(cards).forEach(key => cards[key].hide());
    }

    static show(actor, actorInTurn, canBeAttacked) {
        const card = cards[actor.name];

        EnemyCardManager.hideAll();

        modal.show();

        (card || createCardFor(actor)).show(actorInTurn, canBeAttacked);
    }

    static hide(actor) {
        const card = cards[actor.name];
        modal.hide();
        card.hide();
    }

    static destroy() {
        modal.destroy();
        Object.keys(cards).forEach(key => cards[key].destroy());
    }
}

global.window.manager = EnemyCardManager;

export default EnemyCardManager;
