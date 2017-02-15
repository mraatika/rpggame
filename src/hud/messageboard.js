import { BoundedStack } from 'datastructures';
import SpriteBase from '../sprites/spritebase';
import EventTypes from '../events/eventtypes';

function createMessageFromEvent(event) {
    switch (event.type) {
    case EventTypes.LOG_EVENT:
        return event.text;
    case EventTypes.ATTACK_EVENT:
        return `${event.actor.name} is attacking ${event.target.name} with ${event.attack}`;
    case EventTypes.LOOT_EVENT:
        {
            const lootedItems = event.loot.items.map(i => i.name);
            return `${event.actor.name} looted ${event.loot.gold} gold and ${lootedItems.length} items ${lootedItems.length ? `(${lootedItems.join(', ')})` : ''}`;
        }
    case EventTypes.DEFEND_EVENT:
        return `${event.actor.name} defends with ${event.defence}`;
    case EventTypes.DAMAGE_EVENT:
        return `${event.actor.name} took ${event.damage} damage`;
    case EventTypes.ACTOR_KILLED_EVENT:
        return `${event.actor.name} was killed`;
    case EventTypes.END_TURN_EVENT:
        return event.actor.isPlayerControlled ? `${event.actor.name} ended their turn` : null;
    default:
        return '';
    }
}

function renderMessages() {
    const message = this.messages.container.slice(0).reverse().join('\n');
    const style = {
        font: '12px Arial, sans-serif',
        fill: '#ffffff',
        boundsAlignH: 'left',
        boundsAlignV: 'top',
        wordWrap: true,
        wordWrapWidth: this.width - 10,
    };

    if (this.messageText) this.messageText.destroy();

    this.messageText = this.game.add.text(0, 0, '', style);
    this.messageText.setTextBounds(this.x + 5, this.y + 5, this.width - 5, this.height - 5);
    this.messageText.setText(message);
}


/**
 * @class MessageBoard
 * @description
 * @extends {SpriteBase}
 */
export default class MessageBoard extends SpriteBase {
    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {MessageBoard}
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

    logEvent(event) {
        const message = createMessageFromEvent(event);
        if (message) {
            this.addMessage(message);
        }
    }

    addMessage(message) {
        this.messages.add(message);
        renderMessages.call(this);
    }
}
