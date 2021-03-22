import { createCompileToFunctionFn } from './to-function.js';

export function createCompilerCreator(baseCompile){
    return function createCompiler(baseOptions){

        const finalOptions = Object.create(baseOptions);  
        function compile(template, options){
            const compiled = baseCompile(template.trim(), finalOptions);
            return compiled;
        }

        return {
            compile : function(){},
            compileToFunctions: createCompileToFunctionFn(compile),
        }
    }
}