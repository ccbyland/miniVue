/**
 * Jue入口
 *
 * @class Jue
 */

import Compile from './modules/compile/compile.js';
import Observer from './modules/observer/observer.js';
import Computed from './modules/computed/computed.js';
import Watch from './modules/watch.js';
import Proxy from './modules/proxy/proxy.js';

export class Jue {
    constructor(options = {}) {
        const {
            el,
            data
        } = this.$options = options;
        this.$el = el;
        this.$data = data;
        if (this.$el) {

            // 启用数据代理
            new Proxy(this.$data, this);
            // 实现数据观察者
            new Observer(this.$data);
            // 实现Watch对象
            options.watch && new Watch(this.$data, this);
            // 实现Computed对象
            options.computed && new Computed(this);
            // 实现指令解析器
            new Compile(this.$el, this);
        }
    }
}