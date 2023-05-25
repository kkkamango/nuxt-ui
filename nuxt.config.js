// import path from 'path'
// import fs from 'fs'

require('dotenv').config()

export default {
  ssr: false,
  target: 'static',
  // env: {
  //   API_ADMIN: process.env.API_ADMIN,
  // },
  router: {
    base : '/admin-ui-v2/'
  },
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    // }
    // host: process.env.HOST,
    // port: 8080,
  },
  head: {
    titleTemplate: 'LemonCare Admin v2',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  publicRuntimeConfig :{
    // axios: {
    //   browserBaseURL: process.env.BROWSER_BASE_URL,
    // },
    API_PAY : process.env.API_PAY,
    TEST : 'BAD'
  },
  // buildModules: [
  //   // ['@nuxtjs/dotenv', {filename: `.env.${process.env.NODE_ENV}`}],
  // ],
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy'],
  axios: {
    // baseURL : '',
    credentials : true,
    proxy: true,
  },
  proxy: {
    '/apis/admin': {
      target : process.env.API_ADMIN,
      // target : 'https://common-dev.lemonhc.com:8031/admin-api',
      changeOrigin : true,
      pathRewrite : {'^/apis/admin' : ''}
    },
    '/apis/pay': {
      target : process.env.API_PAY,
      // target : 'https://common-dev.lemonhc.com:8031/admin-api',
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