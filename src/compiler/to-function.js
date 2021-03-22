function createFunction(code) {
    return new Function(code);
}

export function createCompileToFunctionFn(compile) {
    return function compileToFunctions(template, options, vm) {
        const compiled = compile(template, options);
        const res = {};
        res.render = createFunction(compiled.render);
        res.staticRenderFns = [];
        return res;
    }
}