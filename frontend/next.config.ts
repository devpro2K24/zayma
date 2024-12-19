/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Active les vérifications supplémentaires pour une meilleure expérience de développement
  webpack: (config, { isServer }) => {
    // Compression Brotli et Gzip
    if (!isServer) {
      const CompressionPlugin = require("compression-webpack-plugin");
      config.plugins.push(
        new CompressionPlugin({
          algorithm: "gzip",
          filename: "[path][base].gz", // Corrigé pour la compatibilité
        }),
        new CompressionPlugin({
          algorithm: "brotliCompress",
          filename: "[path][base].br", // Corrigé pour la compatibilité
        })
      );

      // Optimisation des images
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "static/images/",
              publicPath: "/_next/static/images/", // Corrigé 'publiPath' -> 'publicPath'
              name: "[name].[hash].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: { progressive: true },
              optipng: { enabled: false }, // Corrigé 'enalbled' -> 'enabled'
              pngquant: { quality: [0.65, 0.9], speed: 4 },
              gifsicle: { interlaced: false },
              webp: { quality: 75 },
            },
          },
        ],
      });

      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      if (!isServer) {
        config.plugins.push(new BundleAnalyzerPlugin());
      }

      // Chargement des fichiers CSS
      config.module.rules.push({
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // Corrigé 'postcssOPtions' -> 'postcssOptions'
                plugins: ["tailwindcss", "autoprefixer"],
              },
            },
          },
        ],
      });
    }

    // Ajout d'alias pour des imports simplifiés
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "components/"),
      "@styles": path.resolve(__dirname, "styles/"),
    };

    return config;
  },
};

export default nextConfig;
