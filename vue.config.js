module.exports = {
  lintOnSave: false,
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
