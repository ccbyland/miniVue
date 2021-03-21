/**
 * 数据代理
 *
 * @class Proxy
 */
export default class Proxy {
    constructor(data, vm) {
        this.proxy(vm, data);
    }
    /**
     * 代理实现
     * @param {*} vm 
     * @param {*} data 
     */
    proxy(vm, data) {
        for (const key in data) {
            Object.defineProperty(vm, key, {
                get() {
                    return data[key];
                },
                set(newVal) {
                    data[key] = newVal;
                }
            });
        }
    }
}