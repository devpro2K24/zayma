module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // Pour les fichiers React
    },
  },
  settings: {
    react: {
      version: "detect", // Détecte la version de React utilisée
    },
  },
  extends: [
    "next/core-web-vitals", // Intègre la configuration Next.js
    "eslint:recommended", // Recommandations par défaut d'ESLint
    "plugin:react/recommended", // Meilleures pratiques React
    "plugin:jsx-a11y/recommended", // Accessibilité
    "plugin:@typescript-eslint/recommended", // TypeScript
    "plugin:prettier/recommended", // Intégration avec Prettier
  ],
  plugins: ["react", "jsx-a11y", "@typescript-eslint", "prettier"],
  rules: {
    // Règles personnalisées
    "prettier/prettier": "warn", // Affiche un avertissement si Prettier détecte des problèmes
    "react/react-in-jsx-scope": "off", // Plus nécessaire avec Next.js
    "@typescript-eslint/explicit-module-boundary-types": "off", // Désactive les types explicites pour les fonctions
    "react/prop-types": "off", // Pas nécessaire avec TypeScript
    "jsx-a11y/anchor-is-valid": "off", // Désactive les erreurs pour <a> dans Next.js
  },
};
