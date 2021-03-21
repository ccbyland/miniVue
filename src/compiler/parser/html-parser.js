const startTagClose = /^\s*(\/?)>/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

let html = `<div class="box" id="el"></div>`;

let end, attr;
const match = {tagName: 'div', attrs: []}


const a = html.match(startTagClose);
console.error(end = a);

const b = html.match(attribute);
console.error(attr = b);

console.error((end = a) && (attr = b));