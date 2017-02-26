<template>
    <div id="messageboard" v-bind:style="{ left: this.x + 'px', top: this.y + 'px' }">
        <ul>
            <li v-for="message in reversedMessages">
                <messageboard-entry :message="message"></messageboard-entry>
            </li>
        </ul>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { BoundedStack } from 'datastructures';
    import EventTypes from '../constants/eventtypes';
    import MessageBoardEntry from './messageboardentry';

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
     * @exports
     * Messageboard component. Displays action log to the player
     * @param {number} x
     * @param {number} y
     * @extends {Vue.Component}
     */
    export default Vue.component('messageboard', {
        data() {
            return {
                messages: new BoundedStack(10),
                x: 0,
                y: 0,
            };
        },

        computed: {
            reversedMessages() {
                return this.messages.container
                    .slice(0)
                    .reverse();
            },
        },

        methods: {
            /**
            * Form message from event object and add it to the action log
            * @param {GameEvent} event
            * @memberOf MessageBoard
            */
            addMessage(event) {
                const message = createMessageFromEvent(event);
                if (message) this.messages.add(message);
            },
        },

        components: {
            'messageboard-entry': MessageBoardEntry,
        },
    });
</script>

<style scoped>
    #messageboard {
        position: absolute;

        width: 350px;
        height: 200px;

        margin-top: 8px;
        margin-left: 8px;

        font: 12px Arial, sans-serif;
        color: #fff;
        line-height: 1.5;

        background-color: rgba(95, 40, 0, 0.6);
    }

    ul {
        margin: 0;
        padding: 5px 10px;

        list-style-type: none;
    }
</style>
