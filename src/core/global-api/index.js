/**
 * 静态方法定义
 * 
 * @param {*} Vue 
 */
export function initGlobalApi(Vue){

    Vue.util = {
        warn: function(){},
        extends: function(){},
        mergeOptions: function(){},
        defineReactive: function(){},
    };

    Vue.set = function(){};

    Vue.delete = function(){};

    Vue.nextTick = function(){};
}