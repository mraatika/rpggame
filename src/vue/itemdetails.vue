<template>
    <div class="item-details" v-show="visible" :style="{ top: y, left: x }">
        <h1>{{ item.name }}</h1>
        <table>
            <tr>
                <th>Attack</th>
                <td>{{ item.attackModifier }}</td>
                <td :class="getNumberSignClass(attackChange)">{{ attackChange }}</td>
            </tr>
            <tr>
                <th>Defence</th>
                <td>{{ item.defenceModifier }}</td>
                <td :class="getNumberSignClass(defenceChange)">{{ defenceChange }}</td>
            </tr>
            <tr>
                <th>Movement</th>
                <td>{{ item.movementModifier }}</td>
                <td :class="getNumberSignClass(movementChange)">{{ movementChange }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    import Vue from 'vue';

    const TOOLTIP_DISTANCE_FROM_POINTER = 5;
    const DEFAULT_TOOLTIP_DELAY = 700;

    function getModifierDifference(property, a, b) {
        if (!b) return a[property];
        return a[property] - b[property];
    }

    /**
     * @exports
     * An overlay hover component to display item's properties and
     * compare them to currently equipped item
     * @extends {Vue.Component}
     */
    export default Vue.component('item-details', {
        props: ['item', 'equippedItemOfGroup'],
        data() {
            return {
                visible: false,
                x: 0,
                y: 0,
            };
        },
        computed: {
            attackChange() {
                return getModifierDifference('attackModifier', this.item, this.equippedItemOfGroup);
            },
            defenceChange() {
                return getModifierDifference('defenceModifier', this.item, this.equippedItemOfGroup);
            },
            movementChange() {
                return getModifierDifference('movementModifier', this.item, this.equippedItemOfGroup);
            },
        },
        methods: {
            /**
             * Return class name 'negative' if num is < 0 and 'positive' if > 0.
             * @param {number} num
             * @returns {string}
             */
            getNumberSignClass(num) {
                if (num > 0) return 'positive';
                if (num < 0) return 'negative';
                return '';
            },

            /**
             * Move element to point x,y
             * @param {number} x
             * @param {number} y
             * @param {number} [distance=TOOLTIP_DISTANCE_FROM_POINTER] distance from tooltip
             */
            updatePosition(x, y, distance = TOOLTIP_DISTANCE_FROM_POINTER) {
                this.x = `${x + distance}px`;
                this.y = `${y + distance}px`;
            },

            /**
             * Show this component
             * @param {number} [delay=DEFAULT_TOOLTIP_DELAY] delay after which this component is shown
             */
            show(delay = DEFAULT_TOOLTIP_DELAY) {
                this.showPending = true;

                this.mouseMoveCallback = e => this.updatePosition(e.clientX, e.clientY);
                global.window.addEventListener('mousemove', this.mouseMoveCallback);

                setTimeout(() => {
                    if (this.showPending) this.visible = true;
                }, delay);
            },

            /**
             * Hide this component
             */
            hide() {
                this.visible = false;
                this.showPending = false;
                global.window.removeEventListener('mousemove', this.mouseMoveCallback);
            },
        },
    });
</script>

<style scoped>
    .item-details {
        position: fixed;
        z-index: 100;

        padding: 10px;

        background-color: rgba(0, 0, 0, 0.8);

        border-color: rgba(22,22,22,0.8);
        border-radius: 8px;

        color: #eee;
    }

    h1 {
        font-size: 14px;
        font-family: komika_axisregular;
        line-height: 1;
        margin: 5px 0;
        text-align: center;
    }

    td, th {
        font-size: 14px;
        font-family: Arial, Helvetica, sans-serif;
    }

    th {
        text-align: left;
        font-weight: normal;
        padding-right: 4px;
    }

    td {
        width: 12px;
        padding: 0 4px;
    }

    .negative,
    .positive {
        font-weight: bold;
    }

    .negative {
        color: red;
    }

    .positive {
        color: green;
    }

    .positive:before {
        content: '+';
    }
</style>
