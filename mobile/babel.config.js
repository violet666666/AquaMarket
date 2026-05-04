module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "medusa-react": "./lib/medusa-compat",
            "@": ".",
          },
        },
      ],
      "nativewind/babel",
      require.resolve("expo-router/babel"),
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
