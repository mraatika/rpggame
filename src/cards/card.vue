<template>
    <div>
        <modal :showOnCreate="true"></modal>
        <div class="card-wrapper">
            <div class="card">
                <close-button :onClose="onClose"></close-button>
                <div class="card-inner">
                    <div class="card-header-wrapper">
                        <slot name="header"></slot>
                    </div>
                    <slot name="content"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Modal from '../vue/modal';
    import CloseButton from '../vue/closebutton';

    /**
     * @exports
     * Card component. Parent component for all card components.
     * @param {Function} onClose Callback for close button
     * @extends {Vue.Component}
     */
    export default Vue.component('card', {
        props: ['onClose'],
        components: { modal: Modal, 'close-button': CloseButton },
    });
</script>

<style>
   .card-wrapper {
        position: fixed;
        top: 120px;
        left: 263.5px;

        width: 273px;
        height: 400px;

        background-image: url('../../assets/images/card_bg.png');
        background-repeat: no-repeat;

        z-index: 99;
    }

    .card {
        position: relative;
        padding: 15px;
    }

    .card-inner {
        padding: 6px 10px;
        border: 6px solid #fff;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .card-stats {
        padding: 10px;
        margin-top: 5px;
        margin-bottom: 5px;

        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;

        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
    }

    .card-stats p {
        margin: 8px 0;

        text-align: center;
    }

    .card-header-wrapper {
        padding: 6px 4px;
        margin-bottom: 5px;

        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
    }

    .card-image-wrapper {
        width: 48px;
        height: 48px;

        margin: 0 auto;

        border: 6px solid #fff;
        border-radius: 8px;

        background-color: #88aa00;

        text-align: center;
    }

    .card-image {
        display: inline-block;
        position: relative;
        top: 8px;
        width: 32px;
        height: 32px;
    }

    .card h1,
    .card h2 {
        margin: 0;

        font-family: komika_axisregular;
        text-align: center;
    }

    .card h1 {
        margin-top: -1px;

        font-size: 22px;
        line-height: 1;
    }

    .card h2 {
        margin-bottom: 5px;
        font-size: 16px;
    }

    .card table {
        width: 100%;
        border: none;
        font-family: komika_axisregular;
    }

    .card td {
        padding: 0;
    }

    .card td:first-child {
        padding-left: 12px;
    }

    .card td:last-child {
        padding-right: 12px;
    }
</style>
