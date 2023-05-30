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
  publicRuntimeConfig :{
    API_PAY : process.env.API_PAY,
    TEST : 'BAD'
  },
  buildModules: [
    ['@nuxtjs/dotenv', {filename: `.env.${process.env.NODE_ENV}`}],
  ],
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy'],
  axios: {
    // baseURL : '',
    credentials : true,
    proxy: true,
  },
  proxy: {
    '/admin-api': {
      target : process.env.API_ADMIN,
      changeOrigin : true,
      pathRewrite : {'^/admin-api' : ''}
    },
    '/apis/pay': { // 배포환경에 nginx proxy_pass 추가해야 함
      target : process.env.API_PAY,
      changeOrigin : true,
      pathRewrite : {'^/pay-api' : ''}
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