<template>
    <div v-show="visible">
        <modal :showOnCreate="true"></modal>
        <div id="inventory">
            <close-button :onClose="hide"></close-button>
            <div id="inventory-inner">
                <div class="left">
                    <!--<character-details :player="player"></character-details>-->
                </div>
                <div class="right">
                    <items-list :character="player" :items="this.items"></items-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Modal from '../../vue/modal';
    import ItemsList from './itemslist';
    import visibilityMixin from '../../vue/mixins';
    import EventDispatcher from '../../events/eventdispatcher';
    import EventTypes from '../../constants/eventtypes';

    /**
     * Callback for event dispatcher.
     * @memberOf Inventory
     */
    function handleEvent(event) {
        switch (event.type) {
        case EventTypes.ITEM_EQUIPPED_EVENT:
        case EventTypes.ITEM_DROPPED_EVENT:
            this.items = [].concat(this.player.purse.items);
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
                items: [].concat(this.player.purse.items),
            };
        },

        mixins: [visibilityMixin],

        mounted() {
            EventDispatcher.add(handleEvent, this);
        },

        beforeDestroy() {
            EventDispatcher.remove(handleEvent, this);
        },

        components: { modal: Modal, 'items-list': ItemsList },
    });
</script>

<style scoped>
    #inventory {
        position: absolute;

        width: 600px;
        height: 400px;
        left: 100px;
        top: 100px;

        background-color: rgba(138, 61, 14, 0.8);

        border:  8px solid rgba(85, 30, 0, 1);
        border-radius: 8px;

        z-index: 99;
    }

    #inventory-inner {
        padding: 12px;
    }

    #inventory .close-button {
        top: -20px;
        right: -20px;
    }
</style>
