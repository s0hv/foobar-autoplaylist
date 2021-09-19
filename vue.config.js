module.exports = {
  lintOnSave: false,
  publicPath: process.env.PUBLIC_PATH ? `/${process.env.PUBLIC_PATH}/` : '/',
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    webpackBundleAnalyzer: {
      analyzerMode: process.env.NODE_ENV === 'production' ? 'disabled' : 'static',
      openAnalyzer: false
    }
  }
};
