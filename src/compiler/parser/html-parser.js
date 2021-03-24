// base
var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
// 标签开始位置 <div、<span、... 
const startTagOpen = new RegExp(("^<" + qnameCapture));
// 标签结束位置 />
const startTagClose = /^\s*(\/?)>/;
// 静态属性 id="app"、id='app'、id=app、... 
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// Vue动态属性
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// </div> </span>
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));

/**
 * 解析规则 - 逐个删除（开始标签 开口、属性、闭口，文本，结束标签）
 * 
 * 1. <div id="app" class="name">welcome</div>
 * 2.  id="app" class="name">welcome</div>
 * 3.  class="name">welcome</div>
 * 4. >welcome</div>
 * 5. welcome</div>
 * 6. </div>
 * 7.
 * 
 * @param {*} html 
 * @param {*} options 
 */
export function parseHTML(html, options) {

    /**
     * 截取字符串
     * 
     * @param {*} n 
     */
    function advance(n) {
        html = html.substring(n);
    }

    /**
     * 开始标签
     * 
     * 以当前剩余html字符串为基础，判断开始字符串是否为开始标签
     */
    function parseStartTag() {
        const start = html.match(startTagOpen);
        // 是，则开始解析开始标签
        if (start) {
            // 开始标签 开口
            const match = {
                tagName: start[1], // 标签名
                attrs: [], //属性组
            }
            advance(start[0].length);
            // 开始标签 包含属性
            let end, attr;
            // 非标签结束位置 && (存在Vue动态属性(@、:、v-on...) || 存在静态属性(id、class、...))
            while (!(end = html.match(startTagClose)) && (attr = (html.match(dynamicArgAttribute) || html.match(attribute)))) {
                // 收集属性
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || '' // 兼容id="app"、id='app'、id=app
                });
                advance(attr[0].length);
            }
            // 开始标签 闭口
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }

    /**
     * 结束标签
     * 
     * 以当前剩余html字符串为基础，判断开始字符串是否为结束标签
     */
    function parseEndTag() {
        const end = html.match(endTag);
        if (end) {
            advance(end[0].length);
            return end;
        }
    }

    // 遍历html字符串
    while (html) {

        let text, textEnd = html.indexOf('<');

        // 标签
        if (textEnd === 0) {

            // 为开始标签 `<div>...`、`<p id="" ...>...`
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                options.start(startTagMatch.tagName, startTagMatch.attrs);
            }

            // 为结束标签 `</div>...`、`</p>`...
            const endTagMatch = parseEndTag();
            if (endTagMatch) {
                options.end();
            }
        }

        // 非标签
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
            options.chars(text);
            advance(text.length);
        }
    }
}