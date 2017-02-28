<template>
    <div id="character-diagram">
        <div id="character-diagram-inner">
            <div class="slot helmet">
                <item :item="helmet" :purse="character.purse" :equippable="false" :selectable="false"></item>
            </div>
            <div class="slot weapon">
                <item :item="weapon" :purse="character.purse" :equippable="false" :selectable="false"></item>
            </div>
            <div class="slot shield">
                <item :item="shield" :purse="character.purse" :equippable="false" :selectable="false"></item>
            </div>
            <div class="slot armor">
                <item :item="armor" :purse="character.purse" :equippable="false" :selectable="false"></item>
            </div>
            <div class="slot boots">
                <item :item="boots" :purse="character.purse" :equippable="false" :selectable="false"></item>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Item from './item';

    /**
     * Find item by group
     * @param {number} group
     * @param {Item[]} items
     * @return {Item}
     */
    function findByItemGroup(group, items) {
        return items.find(i => i.itemGroup === group);
    }

    /**
     * @exports
     * @class CharacterDiagram
     * Vue component for displaying character and equipped items
     * @extends {Vue.Component}
     */
    export default Vue.component('character-diagram', {
        props: ['character', 'items'],
        computed: {
            helmet() {
                return findByItemGroup(4, this.items);
            },
            weapon() {
                return findByItemGroup(1, this.items);
            },
            shield() {
                return findByItemGroup(2, this.items);
            },
            armor() {
                return findByItemGroup(5, this.items);
            },
            boots() {
                return findByItemGroup(3, this.items);
            },
        },
        components: {
            item: Item,
        },
    });
</script>

<style scoped>
    #character-diagram {
        width: 100%;
        height: 377px;
        padding-top: 14px;
        overflow: auto;
    }

    #character-diagram-inner {
        position: relative;
        height: 100%;
    }

    .slot {
        position: absolute;
        border: 4px solid rgba(95, 40, 0, 1);
        border-radius: 8px;
        background-color: #2d1000;
    }

    .slot.helmet {
        top: 0;
        left: 96.8px;
    }

    .slot.weapon {
        top: 152.5px;
        left: 0;
    }

    .slot.shield {
        top: 152.5px;
        right: 0;
    }

    .slot.armor {
        top: 152.5px;
        left: 96.8px;
    }

    .slot.boots {
        bottom: 0;
        left: 96.8px;
    }
</style>

<style>
    #character-diagram .item {
        width: 64px;
        height: 64px;
    }
</style>
