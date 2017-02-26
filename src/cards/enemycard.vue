<template>
    <div>
        <modal ref="modal"></modal>
        <div class="card-wrapper" v-show="visible">
            <div class="card">
                <close-button :onClose="hide"></close-button>
                <div class="card-inner">
                    <div class="card-header-wrapper">
                        <h1>{{ enemy.name }}</h1>
                    </div>
                    <div class="card-image-wrapper">
                        <span :class="[actorImgClass]" class="card-image enemy-card"></span>
                    </div>
                    <div class="card-stats">
                        <h2>{{ enemy.enemyType }}</h2>
                        <p>{{ enemy.description }}</p>
                        <table>
                            <tr><td>Attack</td><td>{{ enemy.attack }}</td></tr>
                            <tr><td>Defence</td><td>{{ enemy.defence }}</td></tr>
                            <tr><td>Movement</td><td>{{ enemy.movement }}</td></tr>
                        </table>
                    </div>
                    <div class="card-actions">
                        <button class="guibutton danger" v-bind:disabled="!canPlayerAttack" @click="onAttackClick">Attack</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Commands from '../commands/commands';
    import Modal from '../dom/modal';
    import CloseButton from '../dom/closebutton';
    import './card.css';

    /**
     * @exports
     * Enemy card component
     * @param {Enemy} enemy
     * @extends {Vue.Component}
     */
    export default Vue.component('enemy-card', {
        data() {
            return {
                enemy: {},
                visible: false,
                canPlayerAttack: false,
            };
        },

        computed: {
            /**
             * Get actor frame name
             * @returns {string} class name for css sprite
             */
            actorImgClass() {
                const { name = '' } = this.enemy;
                return name
                    .toLowerCase()
                    .replace(/\s/g, '');
            },
        },
        methods: {
            /**
             * Show this card
             * @param {Actor} actorInTurn Current actor in turn
             * @param {boolean} canPlayerAttack If true then attack button is enabled
             */
            show(actorInTurn, canPlayerAttack) {
                this.visible = true;
                this.canPlayerAttack = canPlayerAttack;
                this.actorInTurn = actorInTurn;
                this.$refs.modal.show();
            },
            /**
             * Hide this card
             */
            hide() {
                this.visible = false;
                this.$refs.modal.hide();
            },
            /**
             * Callback for attack button. Dispatches an attack command and hides this card
             * @fires Commands#AttackCommand
             */
            onAttackClick() {
                new Commands.AttackCommand(this.actorInTurn, this.enemy).dispatch();
                this.hide();
            },
        },
        components: { modal: Modal, 'close-button': CloseButton },
    });
</script>

<style>
    .card-image.enemy-card {
        background: url('/assets/images/actors.png') no-repeat;
    }

    .enemy-card.madknight {
        background-position: -32px 0;
    }

    .enemy-card.headlesshellhound {
        background-position: -32px -32px;
    }

    .enemy-card.reanimatedskeleton {
        background-position: -64px 0;
    }

    .enemy-card.rottingcorpse {
        background-position: 0 -32px;
    }
</style>
