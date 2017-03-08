/**
 * Mixin for setting visible property of a component
 * @exports
 * @type {Vue.mixin}
 */
export const visibilityMixin = {
    data() {
        return { visible: false };
    },

    methods: {
        show() { this.visible = true; },
        hide() { this.visible = false; },
    },
};

/**
 * Mixin for components that use item details
 * @exports
 * @type {Vue.mixin}
 */
export const itemDetailsMixin = {
    methods: {
        /**
         * Callback for element's mouseover. Displays item details component.
         */
        showDetails() { this.$refs.itemDetails.show(); },

        /**
         * Callback for element's mouseout. Hides item details component.
         */
        hideDetails() { this.$refs.itemDetails.hide(); },
    },
};

/**
 * Mixin for components that show item card
 * @type {Vue.mixin}
 * @exports
 */
export const itemCardMixin = {
    methods: {
        showItemCard() { this.$refs.itemCard.show(); },
    },
};

/**
 * Mixin for items list to turn one dimensional items array
 * to two dimensional
 * @type {Vue.mixin}
 * @exports
 */
export const itemsListMixin = {
    computed: {
        items2d() {
            const items = this.items;
            const items2d = [];

            for (let r = 0; r < this.rowCount; r++) {
                items2d.push([]);

                for (let c = 0; c < this.rowLength; c++) {
                    const item = items[(r * this.rowLength) + c];
                    items2d[r].push(item);
                }
            }

            return items2d;
        },
    },
};
