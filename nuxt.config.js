require('dotenv').config()

export default {
  ssr: false,
  target: 'static',
  router: {
    base : '/admin-ui-v2/'
  },
  server: {
    // port: 8080,
  },
  head: {
    titleTemplate: 'LemonCare Admin v2',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  // buildModules: [
  //   // ['@nuxtjs/dotenv', {filename: `.env.${process.env.NODE_ENV}`}],
  // ],
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy'],
  axios: {
    credentials : true,
    proxy: true,
  },
  proxy: {
    '/apis/admin': {
      target : process.env.API_ADMIN,
      changeOrigin : true,
      pathRewrite : {'^/apis/admin' : ''}
    },
    '/apis/pay': {
      target : process.env.API_PAY,
      changeOrigin : true,
      pathRewrite : {'^/apis/pay' : ''}
    },
  },
  plugins: [
    '~/plugins/element-ui.js',
    '~/plugins/axios.js',
    '~/plugins/apis.js', // rest api list
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/default.css'
],
}