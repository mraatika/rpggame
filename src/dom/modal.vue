<template>
    <div class="modal" v-show="visible" :class="transition"></div>
</template>

<script>
    import Vue from 'vue';
    import visiblityMixin from '../dom/mixins';
    import '../../public/animations.css';

    /**
     * @exports
     * Modal overlay component
     * @param {boolean} showOnCreate
     * @extends {Vue.Component}
     */
    export default Vue.component('modal', {
        props: ['showOnCreate'],

        // show / hide mixin
        mixins: [visiblityMixin],

        data() {
            return {
                visible: !!this.showOnCreate,
                transition: 'fadein',
            };
        },
    });
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 8px;
        left: 8px;
        width: 800px;
        height: 640px;

        background-color: rgba(0, 0, 0, 0.6);
        opacity: 0;
        animation: fadein 200ms ease-in;
    }
</style>
