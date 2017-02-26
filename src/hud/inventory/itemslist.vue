<template>
    <table>
        <tr v-for="r in rowCount">
            <td v-for="c in INVENTORY_ROW_LENGTH">
                <item
                    :item="getItem(r, c)"
                    :equippedItemOfGroup="getEquippedItemOfGroup(getItem(r, c))">
                </item>
            </td>
        </tr>
    </table>
</template>

<script>
    import Vue from 'vue';
    import Item from './item';

    // how many items in a row
    const INVENTORY_ROW_LENGTH = 4;

    /**
     * @exports
     * A component to display all items in a character's purse
     * @extends {Vue.Component}
     */
    export default Vue.component('items-table', {
        props: ['character'],

        data() {
            return {
                INVENTORY_ROW_LENGTH,
            };
        },
        computed: {
            items() {
                return this.character.purse.items;
            },
            rowCount() {
                return Math.ceil(this.character.purse.size / INVENTORY_ROW_LENGTH);
            },
        },
        methods: {
            getItem(r, c) {
                return this.items[((r - 1) * INVENTORY_ROW_LENGTH) + (c - 1)];
            },
            getEquippedItemOfGroup(item) {
                if (!item) return null;
                return this.character.purse.getEquippedItemOfGroup(item.itemGroup);
            },
        },
        components: { item: Item },
    });
</script>

<style scoped>
    table {
        border-collapse: separate;
        border-spacing: 14px;
    }
    td {
        border:  4px solid rgba(95, 40, 0, 1);
        border-radius: 8px;

        padding: 4px;

        background-color: #2d1000;
    }

    td.selected {
        border-color: rgba(0, 255, 0, 1);
    }
</style>

