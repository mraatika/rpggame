<template>
    <div
        class="item-action-button"
        @click.stop="onClick(item)"
        v-on:mouseover.stop>
        Loot
    </div>
</template>


<script>
    import Vue from 'vue';

    /**
     * Vue button component for item component take action
     * @extends {Vue.Component}
     */
    export default Vue.component('take-button', {
        props: {
            item: {
                type: Object,
                required: true,
            },

            onClick: {
                type: Function,
                default: () => {},
            },
        },
    });
</script>

<style scoped>
    .item-action-button {
        background-color: rgba(50, 205, 50, 0.6);
    }
</style>
