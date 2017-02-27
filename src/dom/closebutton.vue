<template>
    <button class="close-button" @click="onClose">x</button>
</template>

<script>
    import Vue from 'vue';

    /**
     * @exports
     * Close button component for popup components such as EnemyCard
     * @extends {Vue.Component}
     */
    export default Vue.component('close-button', {
        props: {
            onClose: {
                type: Function,
                required: true,
            },
        },
    });
</script>

<style scoped>
    .close-button {
        position: absolute;
        top: -11px;
        right: -11px;

        border: 4px solid #000;
        border-radius: 50%;
        padding: 3px 5px 4px 7px;

        font-size: 18px;
        font-family: komika_axisregular;
        line-height: 1;

        background-color: #fff;

        outline: none;
        cursor: pointer;
    }
</style>
