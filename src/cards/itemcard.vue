<template>
    <div>
        <modal ref="modal"></modal>
        <div class="card-wrapper" v-show="visible">
            <div class="card">
                <close-button :onClose="hide"></close-button>
                <div class="card-inner">
                    <div class="card-header-wrapper">
                        <h1>{{ item.name }}</h1>
                    </div>
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
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Events from '../events/events';
    import Modal from '../dom/modal';
    import CloseButton from '../dom/closebutton';
    import ItemTypes from '../constants/itemtypes';
    import './card.css';

    /**
     * @exports
     * Item card component
     * @param {Item} item
     * @extends {Vue.Component}
     */
    export default Vue.component('item-card', {
        props: ['item', 'purse'],

        data() {
            return {
                visible: false,
            };
        },

        mounted() {
            console.log(this.item);
        },

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
             * Show this card
             */
            show() {
                this.visible = true;
                this.$refs.modal.show();
            },
            /**
             * Hide this card
             */
            hide() {
                this.visible = false;
                this.$refs.modal.hide();
            },
            /**
             * Callback for attack button. Dispatches an attack command and hides this card
             * @fires Events#ItemDroppedEvent
             */
            onTrashClick() {
                this.purse.remove(this.item);
                new Events.ItemEquippedEvent(this.item, false).dispatch();
                this.hide();
            },

            onDropClick() {
                this.purse.remove(this.item);
                new Events.ItemDroppedEvent(this.item).dispatch();
                this.hide();
            },
        },
        components: { modal: Modal, 'close-button': CloseButton },
    });
</script>

<style scoped>
    .card-image.item-card {
        background: url('/assets/images/actors.png') no-repeat;
    }

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
