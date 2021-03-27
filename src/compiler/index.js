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
    log(['【解析器】parse', ast]);
    // 优化器 - 遍历AST标记静态节点
    if (options.optimize !== false) {
        optimize(ast, options);
    }
    log(['【优化器】optimize', ast]);

    // 代码生成器
    const code = generate(ast);
    log(['【代码生成器】generate', code]);

    // 返回code
    return code;
}

export function compileToFunctions(template) {

    const code = createCompilerCreator(template);
    return {
        render: code.render,
        staticRenderFns: code.staticRenderFns
    }
}