<template>
    <div>
        <!-- item card -->
        <item-card ref="itemCard" v-if="item" :item="item" :purse="purse"></item-card>
        <!-- empty item view -->
        <div v-if="!item" class="item empty"></div>
        <!-- item view -->
        <div v-if="item"
            class="item"
            :class="[this.item.frame]"
            v-on:mouseover="showDetails"
            v-on:mouseout="hideDetails"
            @click="onItemClick">
            <!-- item tooltip -->
            <item-details
                ref="itemDetails"
                :equippedItemOfGroup="getEquippedItemOfGroup()"
                :item="item">
            </item-details>
            <!-- toggle button -->
            <div
                class="button-equip-toggle"
                :class="[equipToggleStatus]"
                @click.stop="onEquipToggle"
                v-on:mouseover.stop>
                {{ equipToggleStatus }}
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import ItemDetails from './itemdetails';
    import ItemCard from '../../cards/itemcard';

    /**
     * @exports
     * Item component for inventory
     * @extends {Vue.Component}
     */
    export default Vue.component('item', {
        props: ['item', 'purse'],

        computed: {
            equipToggleStatus() {
                return (this.item || {}).isEquipped ? 'unequip' : 'equip';
            },
        },

        methods: {
            /**
             * Get equipped item of itemGroup for comparison
             */
            getEquippedItemOfGroup() {
                return this.purse.getEquippedItemOfGroup(this.item.itemGroup);
            },

            /**
             * Callback for equip/unequip button. Toggles item's equipped status.
             */
            onEquipToggle() {
                if (this.item.isEquipped) {
                    this.item.unequip();
                } else {
                    this.purse.equipItem(this.item);
                }

                this.$forceUpdate();
            },

            /**
             * Show item card
             */
            onItemClick() {
                this.$refs.itemCard.show();
            },

            /**
             * Callback for element's mouseover. Displays item details component.
             */
            showDetails() {
                this.$refs.itemDetails.show();
            },

            /**
             * Callback for element's mouseout. Hides item details component.
             */
            hideDetails() {
                this.$refs.itemDetails.hide();
            },
        },
        components: { 'item-details': ItemDetails, 'item-card': ItemCard },
    });
</script>

<style>
    .item {
        position: relative;

        width: 64px;
        height: 84px;

        background-image: url(/assets/images/items_64px.png);
        background-repeat: no-repeat;

        cursor: pointer;
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

    .button-equip-toggle {
        position: absolute;

        bottom: 0;
        left: 0;
        height: 24px;
        width: 100%;

        font-size: 10px;
        font-family: komika_axisregular;
        text-align: center;
        color: #fff;
        line-height: 2.3;

        user-select: none;
    }

    .button-equip-toggle.equip {
        background-color: rgba(50, 205, 50, 0.6);
    }

    .button-equip-toggle.unequip {
        background-color: rgba(222, 0, 0, 0.6)
    }
</style>
