<template>
    <div
        class="item-action-button button-equip-toggle"
        :class="[equipToggleStatus]"
        @click.stop="onEquipToggle"
        v-on:mouseover.stop>
        {{ equipToggleStatus }}
    </div>
</template>


<script>
    import Vue from 'vue';

    /**
     * Equip toggle button for item component.
     * @name EquipButton
     * @extends {Vue.Component}
     */
    export default Vue.component('equip-button', {
        props: {
            item: {
                type: Object,
                required: true,
            },

            onClick: {
                type: Function,
                required: true,
            },
        },

        computed: {
            equipToggleStatus() {
                return this.item.isEquipped ? 'unequip' : 'equip';
            },
        },

        methods: {
            /**
             * Callback for equip/unequip button. Toggles item's equipped status.
             */
            onEquipToggle() {
                this.onClick(this.item);
            },
        },
    });
</script>

<style>
.button-equip-toggle.equip {
    background-color: rgba(50, 205, 50, 0.6);
}

.button-equip-toggle.unequip {
    background-color: rgba(222, 0, 0, 0.6);
}
</style>
