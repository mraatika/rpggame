import { BoundedStack } from 'datastructures';
import EventTypes from '../constants/eventtypes';
import './messageboard.css';

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
 * Create a div DOM element positioned on top of game canvas to host
 * the message texts
 * @private
 * @param {number} x
 * @param {number} y
 * @memberOf MessageBoard
 */
function createMessageBoardDOMElement(x, y) {
    const div = global.document.createElement('div');
    const inner = global.document.createElement('div');

    div.id = 'messageboard';
    inner.id = 'messageboard-inner';

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    div.appendChild(inner);

    global.document.body.appendChild(div);

    return div;
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

    const message = this.messages.container
        .slice(0)
        .reverse()
        .join('<br>');

    global.document.getElementById('messageboard-inner').innerHTML = message;
}

/**
 * @exports
 * @class MessageBoard
 * @description A gui component for displaying action log to the player
 */
export default class MessageBoard {
    /**
     * Creates an instance of MessageBoard.
     * @param {number} x Element's x position
     * @param {number} y Element's y position
     * @memberOf MessageBoard
     */
    constructor(x, y) {
        this.messages = new BoundedStack(10);
        this.x = x;
        this.y = y;
    }

    /**
     * Show messageboard
     * @memberOf MessageBoard
     */
    show() {
        this.rootElement = createMessageBoardDOMElement(this.x, this.y);
    }

    /**
     * Remove element from DOM
     * @memberOf MessageBoard
     */
    destroy() {
        if (this.rootElement) {
            global.document.body.removeChild(this.rootElement);
        }
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
