const Koa = require('koa')
const app = new Koa()

app.use(require('koa-static')(__dirname + '/src'))
app.use(require('koa-static')(__dirname + '/test'))
app.use(require('koa-static')(__dirname + '/source'))
app.use(require('koa-static')(__dirname + '/jue'))

module.exports = app
