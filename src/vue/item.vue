<template>
    <div>
        <div v-if="item">
            <!-- item card -->
            <item-card ref="itemCard" :item="item" :purse="purse"></item-card>
            <!-- item tooltip -->
            <item-details ref="itemDetails"
                :equippedItemOfGroup="getEquippedItemOfGroup()"
                :item="item">
            </item-details>
            <!-- item view -->
            <div class="item"
                :class="[item.frame]"
                v-on:mouseover="showDetails"
                v-on:mouseout="hideDetails"
                @click="onSelected">
                <!-- info button -->
                <info-button :onClick="showItemCard"></info-button>
                <!-- equip toggle button -->
                <component
                    v-if="showActionButton"
                    :is="actionButton"
                    :item="item"
                    :onClick="onActionButtonClick">
                </component>
            </div>
        </div>
        <!-- empty item view -->
        <div v-if="!item" class="item empty"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import ItemDetails from './itemdetails';
    import ItemCard from '../cards/itemcard';
    import InfoButton from './infobutton';
    import { itemCardMixin, itemDetailsMixin } from './mixins';

    /**
     * @exports
     * Item component for inventory
     * @extends {Vue.Component}
     */
    export default Vue.component('item', {
        props: {
            item: null,
            purse: null,
            selectable: {
                type: Boolean,
                default: true,
            },
            actionButton: null,
            showActionButton: {
                type: Boolean,
                default: true,
            },
            onActionButtonClick: {
                type: Function,
                default: () => {},
            },
        },

        data() { return { isSelected: false }; },

        mixins: [itemCardMixin, itemDetailsMixin],

        methods: {
            /**
             * Get equipped item of itemGroup for comparison
             */
            getEquippedItemOfGroup() {
                return this.purse.getEquippedItemOfGroup(this.item.itemGroup);
            },

            /**
             * Set this selected. Callback for item click. Does nothing
             * if this item is not selectable.
             * @emit selected
             */
            onSelected() {
                if (this.selectable) {
                    this.select(!this.isSelected);
                    this.$emit('selected', this, this.isSelected);
                }
            },

            /**
             * Set selection status. Does nothing
             * if this item is not selectable.
             * @param {boolean} cond
             */
            select(cond) {
                if (this.selectable) {
                    this.isSelected = cond;
                }
            },
        },
        components: {
            'item-details': ItemDetails,
            'item-card': ItemCard,
            'info-button': InfoButton,
        },
    });
</script>

<style scoped>
    .item {
        position: relative;
        cursor: pointer;
    }
</style>

<style>
    .item {
        background-image: url(../../assets/images/items_64px.png);
        background-repeat: no-repeat;
    }

    .item.empty {
        background-image: none;
        cursor: default;
    }

    .item.shield {
        background-position: 0 0;
    }

    .item.sword {
        background-position: -64px 0;
    }

    .item.boots {
        background-position: -128px 0;
    }

    .item.club {
        background-position: -190px 0;
    }

    .item.woodenshield {
        background-position: -256px 0;
    }
</style>
