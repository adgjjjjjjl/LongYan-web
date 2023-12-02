// postcss.config.js

module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5, // 1rem等于16px
      propList: ["*"],
      selectorBlackList: ["html"],
      minPixelValue: 2,
    },
  },
};
