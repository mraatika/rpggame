<template>
    <div class="modal" v-show="isVisible" :class="transition"></div>
</template>

<script>
    import Vue from 'vue';
    import '../../public/animations.css';

    /**
     * @exports
     * Modal overlay component
     * @param {boolean} showOnCreate
     * @extends {Vue.Component}
     */
    export default Vue.component('modal', {
        props: ['showOnCreate'],

        data() {
            return {
                isVisible: !!this.showOnCreate,
                transition: 'fadein',
            };
        },
        methods: {
            /**
             * Show overlay
             */
            show() {
                this.isVisible = true;
            },
            /**
             * Hide overlay
             */
            hide() {
                this.isVisible = false;
            },
        },
    });
</script>

<style scoped>
    .modal {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 800px;
        height: 640px;

        background-color: rgba(0, 0, 0, 0.6);
        opacity: 0;
        animation: fadein 200ms ease-in;
    }
</style>
