import { parse } from './parser/index.js';
import { optimize } from './optimize.js';
import { generate } from './generate/index.js';

export function compileToFunctions(template, options = {}) {
    
    // 解析器 - 将模板解析为AST 
    const ast = parse(template.trim(), options)

    // 优化器 - 遍历AST标记静态节点
    if(options.optimize !== false){
        optimize(ast, options);
    }

    // 代码生成器
    const code = generate(ast);
    console.error(code);
}