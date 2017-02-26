<template>
    <div>
        <modal ref="modal"></modal>
        <div class="enemy-card-wrapper" v-show="visible">
            <div class="enemy-card">
                <close-button :onClose="hide"></close-button>
                <div class="enemy-card-inner">
                    <div class="enemy-card-header-wrapper">
                        <h1>{{ enemy.name }}</h1>
                    </div>
                    <div class="enemy-card-image-wrapper">
                        <span :class="actorImgClass" class="enemy-card-image"></span>
                    </div>
                    <div class="enemy-card-stats">
                        <h2>{{ enemy.enemyType }}</h2>
                        <p>{{ enemy.description }}</p>
                        <table>
                            <tr><td>Attack</td><td>{{ enemy.attack }}</td></tr>
                            <tr><td>Defence</td><td>{{ enemy.defence }}</td></tr>
                            <tr><td>Movement</td><td>{{ enemy.movement }}</td></tr>
                        </table>
                    </div>
                    <div class="enemy-card-actions">
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

<style scoped>
    .enemy-card-wrapper {
        width: 273px;
        height: 400px;
        background-image: url('../../assets/images/enemy_card_bg.png');
        background-repeat: no-repeat;
        position: absolute;
        top: 120px;
        left: 263.5px;
        z-index: 99;
    }

    .enemy-card {
        padding: 15px;
        position: relative;
    }

    .enemy-card-inner {
        padding: 6px 10px;
        border: 6px solid #fff;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .enemy-card-stats {
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 10px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .enemy-card-stats p {
        margin: 8px 0;
    }

    .enemy-card-header-wrapper {
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 6px 4px;
        margin-bottom: 5px;
    }

    .enemy-card-image-wrapper {
        border: 6px solid #fff;
        background-color: #88aa00;
        border-radius: 8px;
        width: 48px;
        height: 48px;
        margin: 0 auto;
        text-align: center;
    }

    .enemy-card-image {
        display: inline-block;
        background: url('../../assets/images/actors.png') no-repeat;
        width: 32px;
        height: 32px;
        position: relative;
        top: 8px;
    }

    .madknight {
        background-position: -32px 0;
    }

    .headlesshellhound {
        background-position: -32px -32px;
    }

    .reanimatedskeleton {
        background-position: -64px 0;
    }

    .rottingcorpse {
        background-position: 0 -32px;
    }

    h1, h2 {
        font-family: komika_axisregular;
        text-align: center;
        margin: 0;
    }

    h1 {
        font-size: 22px;
        line-height: 1;
        margin-top: -1px;
    }

    h2 {
        font-size: 16px;
        margin-bottom: 5px;
    }

    table {
        font-family: komika_axisregular;
        border: none;
        width: 100%;
    }

    td {
        padding: 0;
    }

    td:first-child {
        padding-left: 12px;
    }

    td:last-child {
        padding-right: 12px;
    }
</style>
