import Vue from './runtime/index.js';
import { compileToFunctions } from '../../compiler/index.js';
import { query } from './util/index.js';
const mount = Vue.prototype.$mount;

Vue.prototype.$mount = function(el){
    
    el = el && query(el);
    const options = this.$options;

    // 模板优先级 render > template > el
    if(!options.render){
        let template = options.template;
        if(template){
            if(typeof template === 'string'){

            }else if(template.nodeType){
                template = template.innerHTML;
            }else{
                return this;
            }
        }else if(el){
            template = getOuterHTML(el);
        }
        if(template){
            options.render = compileToFunctions(template);
        }
    }
    return mount.call(this, el);
}

function getOuterHTML(el){
    if(el.outerHTML){
        return el.outerHTML;
    }else{
        const container = document.createElement('div')
        container.appendChild(el.cloneNode(true))
        return container.innerHTML;
    }
}

export default Vue;