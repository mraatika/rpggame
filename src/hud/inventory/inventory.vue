<template>
    <div v-show="visible">
        <modal ref="modal"></modal>
        <div id="inventory">
            <close-button :onClose="hide"></close-button>
            <div id="inventory-inner">
                <div class="left">
                    <!--<character-details :player="player"></character-details>-->
                </div>
                <div class="right">
                    <items-list :character="player"></items-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Modal from '../../dom/modal';
    import ItemsList from './itemslist';

    export default Vue.component('inventory', {
        props: ['player'],

        data() {
            return {
                visible: true,
            };
        },
        methods: {
            show() {
                this.visible = true;
                this.$refs.modal.show();
            },

            hide() {
                this.visible = false;
                this.$refs.modal.hide();
            },
        },
        components: { modal: Modal, 'items-list': ItemsList },
    });
</script>

<style scoped>
    #inventory {
        position: absolute;

        width: 600px;
        height: 400px;
        left: 100px;
        top: 100px;

        background-color: rgba(138, 61, 14, 0.8);

        border:  8px solid rgba(85, 30, 0, 1);
        border-radius: 8px;

        z-index: 99;
    }

    #inventory-inner {
        padding: 12px;
    }

    #inventory .close-button {
        top: -20px;
        right: -20px;
    }
</style>
