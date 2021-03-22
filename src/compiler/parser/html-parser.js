
// 标签开始位置
const startTagOpen = /^<((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)/;
// 标签结束位置
const startTagClose = /^\s*(\/?)>/;
// Vue动态属性
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 静态属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

export function parseHTML(html, options){
    let index = 0;
    /**
     * 截取字符串
     * 
     * @param {*} n 
     */
    function advance(n){
        index += n;
        html = html.substring(n);
    }
    
    /**
     * 是否为开始标签
     */
    function parseStartTag(){

        const start = html.match(startTagOpen);
        console.error(start);
        // 正确匹配
        if(start){
            const match = {
                tagName: start[1],// 标签名
                attrs: [],// 属性组
                start: index
            }
            advance(start[0].length);
            
            let end, attr;
            // 非标签结束位置 && (存在Vue动态属性(@、:、v-on...) || 存在静态属性(id、class、...))
            while(!(end == html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))){

                attr.start = index;
                advance(attr[0].length);
                attr.end = index;

                // 收集属性
                match.attrs.push(attr);
            }

            if(end){
                match.unarySlash = end[1];
                advance(attr[0].length);
                match.end = index;
                return match;
            }
        }
    }

    /**
     * 解析开始标签
     * 
     * @param {*} match 
     */
    function handleStartTag(match){}

    // while(html){

    let textEnd = html.indexOf('<');

    if(textEnd === 0){

        // 为开始标签 `<div>...`、`<p>...`、`<input>...`
        const startTagMatch = parseStartTag();
        if(startTagMatch){
            handleStartTag(startTagMatch);
        }
    }

    if(textEnd >= 0){

    }

    if(textEnd < 0){

    }
    // }
}