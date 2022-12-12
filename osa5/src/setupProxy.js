// Package.json proxy ei jostain syystä toiminut. Käytän siis proxyn käsittelijälle omaa middlewarea

const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3003',
      changeOrigin: true,
    })
  )
}