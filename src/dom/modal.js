function createRootElement() {
    const modal = global.document.createElement('div');
    modal.className = 'modal';
    global.document.body.appendChild(modal);
    return modal;
}

export default class Modal {
    show() {
        if (!this.rootElement) { this.rootElement = createRootElement(); }
        this.rootElement.className = 'modal fadein';
    }

    hide() {
        if (this.rootElement) {
            this.rootElement.className = 'modal fadeout';
        }
    }

    destroy() {
        global.document.body.removeChild(this.rootElement);
    }
}
