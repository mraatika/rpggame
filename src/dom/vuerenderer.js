import VueApp from '../dom/vueapp';

/**
 * Render Vue component to vue-domain div
 * @export
 * @param {Vue.Component} VueComponent
 * @param {Object} [props={}]
 * @returns {Vue.Component} Created component instance
 */
export default function mount(VueComponent, props = {}) {
    const instance = new VueComponent({ parent: VueApp });
    // assign all props to instance
    Object.assign(instance, props);
    // mount after props are added
    instance.$mount();
    global.document.getElementById('vue-domain').appendChild(instance.$el);
    return instance;
}
