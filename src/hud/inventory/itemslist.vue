<template>
    <table class="items-list">
        <tbody>
            <tr v-for="(row, rIdx) in items2d">
                <td v-for="(col, cIdx) in items2d[rIdx]"
                    class="item-container"
                    :class="{ selected: isSelected(items2d[rIdx][cIdx]) }">
                    <item
                        :item="items2d[rIdx][cIdx]"
                        :purse="character.purse"
                        :actionButton="equipButton"
                        :onActionButtonClick="onItemEquipToggle"
                        v-on:selected="onItemSelect">
                    </item>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">
                    <button class="guibutton danger" :disabled="!selected.length" @click="onDropClick">
                        Drop
                    </button>
                </td>
                <td colspan="2">
                    <button class="guibutton danger" :disabled="!selected.length" @click="onTrashClick">
                        Trash
                    </button>
                </td>
            </tr>
        </tfoot>
    </table>
</template>

<script>
    import Vue from 'vue';
    import Item from '../../vue/item';
    import EventTypes from '../../constants/eventtypes';
    import { sendEvent } from '../../events/eventdispatcher';
    import { itemsListMixin } from '../../vue/mixins';
    import EquipButton from '../../vue/equipbutton';

    // how many items in a row
    const INVENTORY_ROW_LENGTH = 4;

    /**
     * Do stuff after items are dropped / trashed
     * @private
     * @param {GameEvent} EventClass
     * @param {any[]} eventProps
     * @memberof ItemsList
     */
    function afterDropOrTrash(eventType, eventProps = {}) {
        const items = this.selected.map(itemComponent => itemComponent.item);
        items.forEach(item => this.character.purse.remove(item));
        sendEvent(eventType, { item: items, ...eventProps });
        this.deselectAll();
    }

    /**
     * @exports
     * @class ItemsList
     * A component to display all items in a character's purse
     * @extends {Vue.Component}
     */
    export default Vue.component('items-list', {
        props: {
            character: {
                type: Object,
                required: true,
            },
            items: {
                type: Array,
                default: [],
            },
        },

        data() {
            console.log();
            return {
                rowLength: INVENTORY_ROW_LENGTH,
                selected: [],
                rowCount: Math.ceil(this.character.purse.size / INVENTORY_ROW_LENGTH),
                equipButton: EquipButton,
            };
        },

        mixins: [itemsListMixin],

        methods: {
            onItemEquipToggle(item) {
                if (item.isEquipped) {
                    item.unequip();
                } else {
                    this.character.purse.equipItem(item);
                }
            },

            /**
             * Check if item's ItemComponent is selected.
             * @param {Item} item
             * @returns {boolean}
             */
            isSelected(item) {
                if (!item) return false;
                return !!this.selected.find(component => component.item === item);
            },

            /**
             * Deselect all items
             * @private
             * @memberof ItemsList
             */
            deselectAll() {
                this.selected.forEach(component => component.select(false));
                this.selected = [];
            },

            /**
             * Callback for trash button. Removes item from purse and hides this card.
             * @fires EventTypes#ITEM_EQUIPPED_EVENT
             */
            onTrashClick() {
                afterDropOrTrash.call(this, EventTypes.ITEM_EQUIPPED_EVENT, { condition: false });
            },

            /**
             * Callback for drop button. Removes item from purse and hides this card.
             * @fires EventTypes#ITEM_DROPPED_EVENT
             */
            onDropClick() {
                afterDropOrTrash.call(this, EventTypes.ITEM_DROPPED_EVENT);
            },

            /**
             * Callback for Item component selection. Update selected items list.
             * @param {ItemComponent} component
             * @param {boolean} condition
             */
            onItemSelect(component, condition) {
                const { selected } = this;

                if (condition) {
                    selected.push(component);
                } else {
                    selected.splice(selected.indexOf(component), 1);
                }
            },
        },

        components: { item: Item },
    });
</script>

<style scoped>
    td.selected {
        border-color: rgba(0, 255, 0, 1);
    }
</style>

