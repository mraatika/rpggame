import { BoundedStack } from 'datastructures';
import SpriteBase from '../sprites/spritebase';
import EventTypes from '../constants/eventtypes';

const BOARD_SIDE_MARGIN = 10;
const BOARD_TOP_MARGIN = 5;

/**
 * Create user readable message from an event object
 * @param {GameEvent} event
 * @returns {string}
 */
function createMessageFromEvent(event) {
    const { actor = {} } = event;
    const className = actor.isPlayerControlled ? 'actor' : 'enemy';

    switch (event.type) {
    case EventTypes.LOG_EVENT:
        return event.text;
    case EventTypes.ATTACK_EVENT:
        return `<span class="${className}">${event.actor.name}</span> is attacking ${event.target.name} with ${event.attack}`;
    case EventTypes.LOOT_EVENT:
        {
            const lootedItems = event.loot.items.map(i => i.name);
            return `<span class="${className}">${event.actor.name}</span> looted ${event.loot.gold} gold and ${lootedItems.length} items ${lootedItems.length ? `(${lootedItems.join(', ')})` : ''}`;
        }
    case EventTypes.DEFEND_EVENT:
        return `<span class="${className}">${event.actor.name}</span> defends with ${event.defence}`;
    case EventTypes.DAMAGE_EVENT:
        return `<span class="${className}">${event.actor.name}</span> took ${event.damage} damage`;
    case EventTypes.ACTOR_KILLED_EVENT:
        return `<span class="${className}">${event.actor.name}</span> was killed`;
    case EventTypes.END_TURN_EVENT:
        return event.actor.isPlayerControlled ? `<span class="${className}">${event.actor.name}</span> ended their turn` : null;
    default:
        return '';
    }
}

/**
 * Create a div DOM element positioned on top of this sprite to host
 * the message texts
 * @private
 * @memberOf MessageBoard
 */
function createMessageBoardDOMElement() {
    const div = global.document.createElement('div');

    div.id = 'messageboard';

    div.style.font = '12px Arial, sans-serif';
    div.style.color = '#ffffff';
    div.style.position = 'absolute';
    div.style.left = `${this.x + 8}px`;
    div.style.top = `${this.y + 8}px`;
    div.style.width = `${this.width - (2 * BOARD_SIDE_MARGIN)}px`;
    div.style.height = `${this.height - (2 * BOARD_TOP_MARGIN)}px`;
    div.style.padding = `${BOARD_TOP_MARGIN}px ${BOARD_SIDE_MARGIN}px`;
    div.style.pointerEvents = 'none';

    global.document.getElementById('phaser-game').appendChild(div);
}

/**
 * Render all messages
 * @private
 * @memberOf MessageBoard
 */
function renderMessages() {
    if (!global.document.getElementById('messageboard')) {
        createMessageBoardDOMElement.call(this);
    }

    const message = this.messages.container.slice(0).reverse().join('<br>');
    const div = global.document.getElementById('messageboard');

    div.innerHTML = message;
}


/**
 * @exports
 * @class MessageBoard
 * @description A gui component for displaying action log to the player
 * @extends {SpriteBase}
 */
export default class MessageBoard extends SpriteBase {
    /**
     * Creates an instance of MessageBoard.
     * @param {Game} game
     * @param {number} x
     * @param {number} y
     * @memberOf MessageBoard
     */
    constructor(game, x, y) {
        super(game, x, y, 'overlay');
        this.width = 350;
        this.height = 200;
        this.alpha = 0.6;
        this.messages = new BoundedStack(10);
        this.messagesGroup = this.game.add.group();
        renderMessages.call(this);
    }

    /**
     * Form message from event object and add it to the action log
     * @param {GameEvent} event
     * @memberOf MessageBoard
     */
    logEvent(event) {
        const message = createMessageFromEvent(event);
        if (message) {
            this.addMessage(message);
        }
    }

    /**
     * Add message to the action log
     * @param {string} event
     * @memberOf MessageBoard
     */
    addMessage(message) {
        this.messages.add(message);
        renderMessages.call(this);
    }
}
