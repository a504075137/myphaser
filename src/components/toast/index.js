import Vue from 'vue';
import toast from './toast.vue';

let ToastConstructor = Vue.extend(toast);


let toastPool = [];
let toasting = false;

let getAnInstance = () => {
    if (toastPool.length > 0) {
        let instance = toastPool[0];
        toastPool.splice(0, 1);
        return instance;
    }
    return new ToastConstructor({
        el: document.createElement('div')
    });
};

let returnAnInstance = instance => {
    if (instance) {
        toastPool.push(instance);
    }
};

let removeDom = event => {
    if (event.target.parentNode) {
        event.target.parentNode.removeChild(event.target);
    }
};

ToastConstructor.prototype.close = function() {
    this.visible = false;
    this.$el.addEventListener('transitionend', removeDom);
    this.closed = true;
    returnAnInstance(this);
};

let Toast = (options = {}) => {
    if (toasting) {
        return;
    }
    toasting = true;
    options = options || {};
    if (typeof options === 'string'
        || typeof options === 'boolean'
        || typeof options === 'number') {
        options = {
            message: options
        };
    }
    options.duration = options.duration || 3000;

    let instance = getAnInstance();
    instance.closed = false;
    clearTimeout(instance.timer);
    instance.options = options;

    document.body.appendChild(instance.$el);
    Vue.nextTick(()=> {
        instance.visible = true;
        instance.$el.removeEventListener('transitionend', removeDom);
        ~options.duration && (instance.timer = setTimeout(()=> {
            if (instance.closed) {
                return;
            }
            instance.close();
            toasting = false;
        }, options.duration));
    });
    return instance;
};

Vue.$toast = Vue.prototype.$toast = Toast;