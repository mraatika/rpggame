/**
 * @exports
 * @mixin
 * Mixin for setting visible property of a component
 */
export default {
    methods: {
        show() { this.visible = true; },
        hide() { this.visible = false; },
    },
};
