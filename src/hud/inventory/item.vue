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
                <info-button :onClick="onItemClick"></info-button>
                <!-- toggle button -->
                <div
                    v-if="equippable"
                    class="button-equip-toggle"
                    :class="[equipToggleStatus]"
                    @click.stop="onEquipToggle"
                    v-on:mouseover.stop>
                    {{ equipToggleStatus }}
                </div>
            </div>
        </div>
        <!-- empty item view -->
        <div v-if="!item" class="item empty"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import ItemDetails from './itemdetails';
    import ItemCard from '../../cards/itemcard';
    import InfoButton from '../../vue/infobutton';

    /**
     * @exports
     * Item component for inventory
     * @extends {Vue.Component}
     */
    export default Vue.component('item', {
        props: {
            item: null,
            purse: null,
            equippable: {
                type: Boolean,
                default: true,
            },
            selectable: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return { isSelected: false };
        },

        computed: {
            equipToggleStatus() {
                if (!this.equippable || !this.item) return '';
                return this.item.isEquipped ? 'unequip' : 'equip';
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

    .button-equip-toggle {
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 24px;

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
        background-color: rgba(222, 0, 0, 0.6);
    }
</style>

<style>
    .item {
        background-image: url(../../../assets/images/items_64px.png);
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
