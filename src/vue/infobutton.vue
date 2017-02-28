<template>
    <span class="info-button" :class="[colorClass]" @click="onClick"></span>
</template>

<script>
    import Vue from 'vue';

    /**
     * @exports
     * @class InfoButton
     * A small info icon with a callback
     * @extends {Vue.Component}
     */
    export default Vue.component('info-button', {
        props: {
            onClick: {
                type: Function,
                default: () => {},
            },
            colorClass: {
                type: String,
                default: 'white',
            },
        },
    });
</script>

<style scoped>
    .info-button {
        position: absolute;

        width: 16px;
        height: 16px;

        background-image: url(../../assets/images/icons_16x16.png);

        opacity: 0.6;
    }

    .black {
        background-position: 0 0;
    }

    .white {
        background-position: -16px 0;
    }
</style>
