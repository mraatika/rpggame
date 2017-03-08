<template>
    <card v-show="visible" :onClose="hide">
        <h1 slot="header">{{ enemy.name }}</h1>
        <div slot="content">
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
                <button class="guibutton danger"
                    v-bind:disabled="!canPlayerAttack"
                    @click="onAttackClick">
                    Attack
                </button>
            </div>
        </div>
    </card>
</template>

<script>
    import Vue from 'vue';
    import attackCommand from '../commands/attackcommand';
    import { sendCommand } from '../commands/commanddispatcher';
    import Card from './card';
    import { visibilityMixin } from '../vue/mixins';

    /**
     * @exports
     * Enemy card component
     * @param {Enemy} enemy
     * @extends {Vue.Component}
     */
    export default Vue.component('enemy-card', {
        props: {
            enemy: {
                type: Object,
                required: true,
            },
        },

        data() { return { canPlayerAttack: false }; },

        // show / hide mixin
        mixins: [visibilityMixin],

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
                this.canPlayerAttack = canPlayerAttack;
                this.actorInTurn = actorInTurn;
                this.visible = true;
            },
            /**
             * Callback for attack button. Dispatches an attack command and hides this card
             * @fires Commands#AttackCommand
             */
            onAttackClick() {
                sendCommand(attackCommand(this.actorInTurn, this.enemy));
                this.hide();
            },
        },
        components: { card: Card },
    });
</script>

<style>
    .card-image.enemy-card {
        background: url('../../assets/images/actors.png') no-repeat;
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
