import Vue from 'vue';

let vueApp;

/**
 * Render Vue component to vue-domain div
 * @export
 * @param {Vue.Component} VueComponent
 * @param {Object} [props={}]
 * @returns {Vue.Component} Created component instance
 */
export default function mount(VueComponent, props = {}) {
    // initiate vue app when first component mounts
    if (!vueApp) { vueApp = new Vue({ el: '#vue-domain' }); }
    // create instance pass props as propsData. All received props should be
    // defined in the component itself since it will not register undefined props
    // even if present in propsData
    const instance = new VueComponent({ parent: vueApp, propsData: props });
    // mount after props are added
    instance.$mount();
    global.document.getElementById('vue-domain').appendChild(instance.$el);
    return instance;
}
