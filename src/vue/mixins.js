/**
 * @exports
 * Mixin for setting visible property of a component
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
