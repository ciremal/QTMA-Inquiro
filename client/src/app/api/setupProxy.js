const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/dev',
    createProxyMiddleware({
      target: 'https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com',
      changeOrigin: true,
    })
  );
};
