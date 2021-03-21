/**
 * 观察者容器
 *
 * @class Dep
 */
export default class Dep {
    constructor() {
        this.subs = [];
    }
    /**
     * 收集观察者
     * @param {*} watcher
     */
    addSub(watcher) {
        this.subs.push(watcher);
    }
    /**
     * 通知观察者
     *
     * @memberof Dep
     */
    notify() {
        // 当前监听对象、可能有多个引用（对应多个watcher），所以需要遍历触发
        this.subs.forEach((watcher) => {
            watcher.update();
        });
    }
}