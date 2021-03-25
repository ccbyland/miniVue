import {
    parse
} from './parser/index.js';
import {
    optimize
} from './optimize.js';
import {
    generate
} from './generate/index.js';
import {
    log
} from '../shared/util.js';

function createCompilerCreator(template, options = {}) {

    // 解析器 - 将模板解析为AST 
    const ast = parse(template.trim(), options);
    log(['parse', ast]);
    // 优化器 - 遍历AST标记静态节点
    if (options.optimize !== false) {
        optimize(ast, options);
    }
    log(['optimize', ast]);

    // 代码生成器
    const code = generate(ast);
    log(['generate', code]);

    // 返回render函数
    return new Function(`with(this){ return ${code}}`);
}

export function compileToFunctions(template) {
    return createCompilerCreator(template);
}