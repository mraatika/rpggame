<template>
    <div v-show="visible">
        <modal :showOnCreate="true"></modal>
        <div id="lootmenu" class="items-menu">
            <close-button :onClose="hide"></close-button>
            <table class="items-list">
                <tbody>
                    <tr v-for="(row, rIdx) in items2d">
                        <td class="item-container" v-for="(col, cIdx) in items2d[rIdx]">
                            <item
                                :item="items2d[rIdx][cIdx]"
                                :purse="character.purse"
                                :actionButton="takeButton"
                                :selectable="false"
                                :onActionButtonClick="onTakeButtonClick">
                            </item>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4">
                            <button class="guibutton success" @click="onLootAllClick">
                                Loot all
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { without } from '../utils/utils';
    import { itemsListMixin, visibilityMixin } from '../vue/mixins';
    import Modal from './modal';
    import Item from './item';
    import TakeButton from './takebutton';

    const LOOTDIALOG_ROW_LENGTH = 4;

    /**
     * @exports
     * @class ItemsList
     * A component to display all items in a character's purse
     * @extends {Vue.Component}
     */
    export default Vue.component('loot-dialog', {
        // show / hide mixin
        mixins: [visibilityMixin, itemsListMixin],

        props: {
            character: {
                required: true,
            },
            initialItems: {
                type: Array,
                default: [],
            },
            onClose: {
                type: Function,
                required: true,
            },
        },

        data() {
            return {
                rowLength: LOOTDIALOG_ROW_LENGTH,
                rowCount: Math.ceil(this.initialItems.length / LOOTDIALOG_ROW_LENGTH) || 1,
                lootedItems: [],
                items: [...this.initialItems],
                takeButton: TakeButton,
            };
        },

        methods: {
            /**
             * Get equipped item of itemGroup for comparison
             */
            getEquippedItemOfGroup() {
                return this.purse.getEquippedItemOfGroup(this.item.itemGroup);
            },

            /**
             * Hide this menu and call close callback with
             * looted items
             */
            hide() {
                this.visible = false;
                this.onClose(this.lootedItems);
            },

            /**
             * Callback for loot all button. Moves all items
             * to character's purse and hides this menu.
             */
            onLootAllClick() {
                this.character.purse.add(this.items);
                this.lootedItems = this.initialItems;
                this.hide();
            },

             /**
             * Callback for single item's take button. Move that item
             * to character's purse. Hides this menu if it's the last item.
             * @param {Item} item
             */
            onTakeButtonClick(item) {
                this.lootedItems.push(item);
                this.character.purse.add(item);
                this.items = without(this.items, item);

                // hide if this was the last item
                if (!this.items.length) {
                    this.hide();
                }
            },
        },

        components: {
            modal: Modal,
            item: Item,
        },
    });
</script>

<style scoped>
    #lootmenu {
        position: absolute;

        width: 375px;
        left: 200px;
        top: 100px;

        z-index: 99;
    }
</style>
