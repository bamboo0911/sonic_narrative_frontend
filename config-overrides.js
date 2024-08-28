const { override } = require('customize-cra');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = override((config) => {
  config.plugins.push(
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            },
          },
        },
        {
          urlPattern: new RegExp('^https://your-api-url-here/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api',
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 5 * 60, // 5 Minutes
            },
          },
        },
      ],
    })
  );
  return config;
});
