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
                <!-- equip toggle button -->
                <equip-button v-if="equippable" :purse="purse" :item="item"></equip-button>
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
    import EquipButton from './equipbutton';

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
            console.log(this.equippable);
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
            'equip-button': EquipButton,
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
