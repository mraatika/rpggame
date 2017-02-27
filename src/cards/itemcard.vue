<template>
    <card v-show="visible" :onClose="hide">
        <h1 slot="header">{{ item.name }}</h1>
        <div slot="content">
            <div class="card-image-wrapper">
                <span :class="[item.frame]" class="card-image item"></span>
            </div>
            <div class="card-stats">
                <h2>{{ itemType }}</h2>
                <p>{{ item.description }}</p>
                <table>
                    <tr><td>Attack</td><td>{{ item.attackModifier }}</td></tr>
                    <tr><td>Defence</td><td>{{ item.defenceModifier }}</td></tr>
                    <tr><td>Movement</td><td>{{ item.movementModifier }}</td></tr>
                </table>
            </div>
            <div class="item-card-actions">
                <button class="guibutton danger" @click="onDropClick">Drop</button>
                <button class="guibutton danger" @click="onTrashClick">Trash</button>
            </div>
        </div>
    </card>
</template>

<script>
    import Vue from 'vue';
    import Events from '../events/events';
    import Card from './card';
    import Item from '../classes/item';
    import Purse from '../classes/purse';
    import ItemTypes from '../constants/itemtypes';
    import visiblityMixin from '../vue/mixins';

    /**
     * @exports
     * Item card component
     * @param {Item} item
     * @param {Purse} purse
     * @extends {Vue.Component}
     */
    export default Vue.component('item-card', {
        props: {
            item: {
                type: Item,
                required: true,
            },
            purse: {
                type: Purse,
                required: true,
            },
        },

        data() { return { visible: false }; },

        // show / hide mixin
        mixins: [visiblityMixin],

        computed: {
            /**
             * Get actor frame name
             * @returns {string} class name for css sprite
             */
            itemType() {
                return ItemTypes[this.item.itemGroup];
            },
        },

        methods: {
            /**
             * Callback for trash button. Removes item from purse and hides this card.
             * @fires Events#ItemEquippedEvent
             */
            onTrashClick() {
                this.purse.remove(this.item);
                new Events.ItemEquippedEvent(this.item, false).dispatch();
                this.hide();
            },

            /**
             * Callback for drop button. Removes item from purse and hides this card.
             * @fires Events#ItemDroppedEvent
             */
            onDropClick() {
                this.purse.remove(this.item);
                new Events.ItemDroppedEvent(this.item).dispatch();
                this.hide();
            },
        },
        components: { card: Card },
    });
</script>

<style scoped>
    .card-image-wrapper {
        width: 80px;
        height: 80px;
    }

    .card-image {
        width: 64px;
        height: 64px;
    }

    .guibutton {
        width: 49%;
    }
</style>
