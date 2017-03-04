<template>
    <div v-show="visible">
        <modal :showOnCreate="true"></modal>
        <div id="inventory">
            <close-button :onClose="hide"></close-button>
            <div id="inventory-inner">
                <div class="left">
                    <character-diagram :character="player" :items="equippedItems"></character-diagram>
                </div>
                <div class="right">
                    <items-list ref="itemsList" :character="player" :items="items"></items-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Modal from '../../vue/modal';
    import ItemsList from './itemslist';
    import CharacterDiagram from './characterdiagram';
    import EventDispatcher from '../../events/eventdispatcher';
    import EventTypes from '../../constants/eventtypes';

    /**
     * Callback for event dispatcher.
     * @private
     * @param {GameEvent} event
     * @memberOf Inventory
     */
    function handleEvent(event) {
        switch (event.type) {
        case EventTypes.ITEM_EQUIPPED_EVENT:
        case EventTypes.ITEM_DROPPED_EVENT:
            this.items = this.player.purse.getItems();
            break;
        default:
            break;
        }
    }

    /**
     * @exports
     * @class Inventory
     * Invetory Vue component
     * @extends {Vue.Component}
     */
    export default Vue.component('inventory', {
        props: ['player'],

        data() {
            return {
                visible: true,
                items: this.player.purse.getItems(),
            };
        },

        computed: {
            equippedItems() {
                return this.items.filter(item => item.isEquipped);
            },
        },

        mounted() {
            EventDispatcher.add(handleEvent, this);
        },

        beforeDestroy() {
            EventDispatcher.remove(handleEvent, this);
        },

        methods: {
            show() {
                this.visible = true;
                this.items = this.player.purse.getItems();
            },

            hide() {
                this.visible = false;
                // clear all selections from items
                this.$refs.itemsList.deselectAll();
            },
        },

        components: {
            modal: Modal,
            'items-list': ItemsList,
            'character-diagram': CharacterDiagram,
        },
    });
</script>

<style scoped>
    #inventory {
        position: absolute;

        width: 660px;
        left: 50px;
        top: 100px;

        background-color: rgba(138, 61, 14, 0.8);

        border:  8px solid rgba(85, 30, 0, 1);
        border-radius: 8px;

        z-index: 99;
    }

    .left {
        width: 41.5%;
        margin-right: 2%;
    }

    .right {
        width: 56.5%;
    }

    #inventory-inner {
        overflow: auto;
        padding: 0 10px;
    }

    #inventory .close-button {
        top: -20px;
        right: -20px;
    }
</style>
