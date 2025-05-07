Directory structure:
└── heygen-official-interactiveavatarnextjsdemo/
    ├── README.md
    ├── eslint.config.mjs
    ├── LICENSE
    ├── next.config.js
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── .npmrc
    ├── app/
    │   ├── error.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── api/
    │   │   └── get-access-token/
    │   │       └── route.ts
    │   └── lib/
    │       └── constants.ts
    ├── components/
    │   ├── Button.tsx
    │   ├── Icons.tsx
    │   ├── Input.tsx
    │   ├── InteractiveAvatar.tsx
    │   ├── NavBar.tsx
    │   ├── Select.tsx
    │   ├── AvatarConfig/
    │   │   ├── Field.tsx
    │   │   └── index.tsx
    │   ├── AvatarSession/
    │   │   ├── AudioInput.tsx
    │   │   ├── AvatarControls.tsx
    │   │   ├── AvatarVideo.tsx
    │   │   ├── MessageHistory.tsx
    │   │   └── TextInput.tsx
    │   └── logic/
    │       ├── context.tsx
    │       ├── index.ts
    │       ├── useConnectionQuality.ts
    │       ├── useConversationState.ts
    │       ├── useInterrupt.ts
    │       ├── useMessageHistory.ts
    │       ├── useStreamingAvatarSession.ts
    │       ├── useTextChat.ts
    │       └── useVoiceChat.ts
    ├── public/
    └── styles/
        └── globals.css


Files Content:

================================================
FILE: README.md
================================================
# HeyGen Interactive Avatar NextJS Demo

![HeyGen Interactive Avatar NextJS Demo Screenshot](./public/demo.png)

This is a sample project and was bootstrapped using [NextJS](https://nextjs.org/).
Feel free to play around with the existing code and please leave any feedback for the SDK [here](https://github.com/HeyGen-Official/StreamingAvatarSDK/discussions).

## Getting Started FAQ

### Setting up the demo

1. Clone this repo

2. Navigate to the repo folder in your terminal

3. Run `npm install` (assuming you have npm installed. If not, please follow these instructions: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

4. Enter your HeyGen Enterprise API Token or Trial Token in the `.env` file. Replace `HEYGEN_API_KEY` with your API key. This will allow the Client app to generate secure Access Tokens with which to create interactive sessions.

   You can retrieve either the API Key or Trial Token by logging in to HeyGen and navigating to this page in your settings: [https://app.heygen.com/settings?nav=API]. NOTE: use the trial token if you don't have an enterprise API token yet.

5. (Optional) If you would like to use the OpenAI features, enter your OpenAI Api Key in the `.env` file.

6. Run `npm run dev`

### Difference between Trial Token and Enterprise API Token

The HeyGen Trial Token is available to all users, not just Enterprise users, and allows for testing of the Interactive Avatar API, as well as other HeyGen API endpoints.

Each Trial Token is limited to 3 concurrent interactive sessions. However, every interactive session you create with the Trial Token is free of charge, no matter how many tasks are sent to the avatar. Please note that interactive sessions will automatically close after 10 minutes of no tasks sent.

If you do not 'close' the interactive sessions and try to open more than 3, you will encounter errors including stuttering and freezing of the Interactive Avatar. Please endeavor to only have 3 sessions open at any time while you are testing the Interactive Avatar API with your Trial Token.

### Starting sessions

NOTE: Make sure you have enter your token into the `.env` file and run `npm run dev`.

To start your 'session' with a Interactive Avatar, first click the 'start' button. If your HeyGen API key is entered into the Server's .env file, then you should see our demo Interactive Avatar (Monica!) appear.

After you see Monica appear on the screen, you can enter text into the input labeled 'Repeat', and then hit Enter. The Interactive Avatar will say the text you enter.

If you want to see a different Avatar or try a different voice, you can close the session and enter the IDs and then 'start' the session again. Please see below for information on where to retrieve different Avatar and voice IDs that you can use.

### Which Avatars can I use with this project?

By default, there are several Public Avatars that can be used in Interactive Avatar. (AKA Interactive Avatars.) You can find the Avatar IDs for these Public Avatars by navigating to [app.heygen.com/interactive-avatar](https://app.heygen.com/interactive-avatar) and clicking 'Select Avatar' and copying the avatar id.

In order to use a private Avatar created under your own account in Interactive Avatar, it must be upgraded to be a Interactive Avatar. Only 1. Finetune Instant Avatars and 2. Studio Avatars are able to be upgraded to Interactive Avatars. This upgrade is a one-time fee and can be purchased by navigating to [app.heygen.com/interactive-avatar] and clicking 'Select Avatar'.

Please note that Photo Avatars are not compatible with Interactive Avatar and cannot be used.

### Where can I read more about enterprise-level usage of the Interactive Avatar API?

Please read our Interactive Avatar 101 article for more information on pricing and how to increase your concurrent session limit: https://help.heygen.com/en/articles/9182113-interactive-avatar-101-your-ultimate-guide



================================================
FILE: eslint.config.mjs
================================================
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: ['.next', 'node_modules']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'build/**/*',
      'public/**/*',
      'dist/**/*',
      'coverage/**/*',
      '*.config.js',
      '*.config.ts',
      'postcss.config.js',
      'tailwind.config.js',
    ],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImports,
      'prettier': prettierPlugin,
      'import': importPlugin,
      'next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_.*?$',
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'import/order': [
        'warn',
        {
          groups: [
            'type',
            'builtin',
            'object',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
        },
      ],
      'prettier/prettier': 'warn',
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
  },
];



================================================
FILE: LICENSE
================================================
MIT License

Copyright (c) 2024 HeyGen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



================================================
FILE: next.config.js
================================================
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig



================================================
FILE: package.json
================================================
{
  "name": "next-app-template",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "node_modules/next/dist/bin/next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx"
  },
  "dependencies": {
    "@heygen/streaming-avatar": "^2.0.13",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "ahooks": "^3.8.4",
    "next": "^15.3.0",
    "openai": "^4.52.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/node": "20.5.7",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.1.2",
    "@typescript-eslint/eslint-plugin": "^8.31.0",
    "@typescript-eslint/parser": "^8.31.0",
    "@next/eslint-plugin-next": "^15.3.1",
    "autoprefixer": "10.4.19",
    "eslint": "^9.25.1",
    "eslint-config-prettier": "^10.1.2",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-prettier": "^5.2.6",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-unused-imports": "^4.1.4",
    "postcss": "8.4.38",
    "tailwindcss": "^3.4.17",
    "typescript": "5.0.4"
  }
}



================================================
FILE: pnpm-lock.yaml
================================================
lockfileVersion: '6.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

dependencies:
  '@heygen/streaming-avatar':
    specifier: ^2.0.13
    version: 2.0.13
  '@radix-ui/react-select':
    specifier: ^2.1.7
    version: 2.1.7(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
  '@radix-ui/react-switch':
    specifier: ^1.1.4
    version: 1.1.4(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
  '@radix-ui/react-toggle-group':
    specifier: ^1.1.3
    version: 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
  ahooks:
    specifier: ^3.8.4
    version: 3.8.4(react@19.1.0)
  next:
    specifier: ^15.3.0
    version: 15.3.0(react-dom@19.1.0)(react@19.1.0)
  openai:
    specifier: ^4.52.1
    version: 4.52.1
  react:
    specifier: ^19.1.0
    version: 19.1.0
  react-dom:
    specifier: ^19.1.0
    version: 19.1.0(react@19.1.0)

devDependencies:
  '@next/eslint-plugin-next':
    specifier: ^15.3.1
    version: 15.3.1
  '@types/node':
    specifier: 20.5.7
    version: 20.5.7
  '@types/react':
    specifier: ^19.0.1
    version: 19.0.1
  '@types/react-dom':
    specifier: ^19.1.2
    version: 19.1.2(@types/react@19.0.1)
  '@typescript-eslint/eslint-plugin':
    specifier: ^8.31.0
    version: 8.31.0(@typescript-eslint/parser@8.31.0)(eslint@9.25.1)(typescript@5.0.4)
  '@typescript-eslint/parser':
    specifier: ^8.31.0
    version: 8.31.0(eslint@9.25.1)(typescript@5.0.4)
  autoprefixer:
    specifier: 10.4.19
    version: 10.4.19(postcss@8.4.38)
  eslint:
    specifier: ^9.25.1
    version: 9.25.1
  eslint-config-prettier:
    specifier: ^10.1.2
    version: 10.1.2(eslint@9.25.1)
  eslint-plugin-import:
    specifier: ^2.31.0
    version: 2.31.0(@typescript-eslint/parser@8.31.0)(eslint@9.25.1)
  eslint-plugin-node:
    specifier: ^11.1.0
    version: 11.1.0(eslint@9.25.1)
  eslint-plugin-prettier:
    specifier: ^5.2.6
    version: 5.2.6(eslint-config-prettier@10.1.2)(eslint@9.25.1)(prettier@3.4.2)
  eslint-plugin-react:
    specifier: ^7.37.5
    version: 7.37.5(eslint@9.25.1)
  eslint-plugin-react-hooks:
    specifier: ^5.2.0
    version: 5.2.0(eslint@9.25.1)
  eslint-plugin-unused-imports:
    specifier: ^4.1.4
    version: 4.1.4(@typescript-eslint/eslint-plugin@8.31.0)(eslint@9.25.1)
  postcss:
    specifier: 8.4.38
    version: 8.4.38
  tailwindcss:
    specifier: ^3.4.17
    version: 3.4.17
  typescript:
    specifier: 5.0.4
    version: 5.0.4

packages:

  /@alloc/quick-lru@5.2.0:
    resolution: {integrity: sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==}
    engines: {node: '>=10'}
    dev: true

  /@babel/runtime@7.26.0:
    resolution: {integrity: sha512-FDSOghenHTiToteC/QRlv2q3DhPZ/oOXTBoirfWNx1Cx3TMVcGWQtMMmQcSvb/JjpNeGzx8Pq/b4fKEJuWm1sw==}
    engines: {node: '>=6.9.0'}
    dependencies:
      regenerator-runtime: 0.14.1
    dev: false

  /@bufbuild/protobuf@1.10.0:
    resolution: {integrity: sha512-QDdVFLoN93Zjg36NoQPZfsVH9tZew7wKDKyV5qRdj8ntT4wQCOradQjRaTdwMhWUYsgKsvCINKKm87FdEk96Ag==}
    dev: false

  /@emnapi/runtime@1.4.0:
    resolution: {integrity: sha512-64WYIf4UYcdLnbKn/umDlNjQDSS8AgZrI/R9+x5ilkUVFxXcA1Ebl+gQLc/6mERA4407Xof0R7wEyEuj091CVw==}
    requiresBuild: true
    dependencies:
      tslib: 2.8.1
    dev: false
    optional: true

  /@eslint-community/eslint-utils@4.4.1(eslint@9.25.1):
    resolution: {integrity: sha512-s3O3waFUrMV8P/XaF/+ZTp1X9XBZW1a4B97ZnjQF2KYWaFD2A8KyFBsrsfSjEmjn3RGWAIuvlneuZm3CUK3jbA==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}
    peerDependencies:
      eslint: ^6.0.0 || ^7.0.0 || >=8.0.0
    dependencies:
      eslint: 9.25.1
      eslint-visitor-keys: 3.4.3
    dev: true

  /@eslint-community/regexpp@4.12.1:
    resolution: {integrity: sha512-CCZCDJuduB9OUkFkY2IgppNZMi2lBQgD2qzwXkEia16cge2pijY/aXi96CJMquDMn3nJdlPV1A5KrJEXwfLNzQ==}
    engines: {node: ^12.0.0 || ^14.0.0 || >=16.0.0}
    dev: true

  /@eslint/config-array@0.20.0:
    resolution: {integrity: sha512-fxlS1kkIjx8+vy2SjuCB94q3htSNrufYTXubwiBFeaQHbH6Ipi43gFJq2zCMt6PHhImH3Xmr0NksKDvchWlpQQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      '@eslint/object-schema': 2.1.6
      debug: 4.4.0
      minimatch: 3.1.2
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@eslint/config-helpers@0.2.1:
    resolution: {integrity: sha512-RI17tsD2frtDu/3dmI7QRrD4bedNKPM08ziRYaC5AhkGrzIAJelm9kJU1TznK+apx6V+cqRz8tfpEeG3oIyjxw==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dev: true

  /@eslint/core@0.13.0:
    resolution: {integrity: sha512-yfkgDw1KR66rkT5A8ci4irzDysN7FRpq3ttJolR88OqQikAWqwA8j5VZyas+vjyBNFIJ7MfybJ9plMILI2UrCw==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      '@types/json-schema': 7.0.15
    dev: true

  /@eslint/eslintrc@3.3.1:
    resolution: {integrity: sha512-gtF186CXhIl1p4pJNGZw8Yc6RlshoePRvE0X91oPGb3vZ8pM3qOS9W9NGPat9LziaBV7XrJWGylNQXkGcnM3IQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      ajv: 6.12.6
      debug: 4.4.0
      espree: 10.3.0
      globals: 14.0.0
      ignore: 5.3.2
      import-fresh: 3.3.0
      js-yaml: 4.1.0
      minimatch: 3.1.2
      strip-json-comments: 3.1.1
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@eslint/js@9.25.1:
    resolution: {integrity: sha512-dEIwmjntEx8u3Uvv+kr3PDeeArL8Hw07H9kyYxCjnM9pBjfEhk6uLXSchxxzgiwtRhhzVzqmUSDFBOi1TuZ7qg==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dev: true

  /@eslint/object-schema@2.1.6:
    resolution: {integrity: sha512-RBMg5FRL0I0gs51M/guSAj5/e14VQ4tpZnQNWwuDT66P14I43ItmPfIZRhO9fUVIPOAQXU47atlywZ/czoqFPA==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dev: true

  /@eslint/plugin-kit@0.2.8:
    resolution: {integrity: sha512-ZAoA40rNMPwSm+AeHpCq8STiNAwzWLJuP8Xv4CHIc9wv/PSuExjMrmjfYNj682vW0OOiZ1HKxzvjQr9XZIisQA==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      '@eslint/core': 0.13.0
      levn: 0.4.1
    dev: true

  /@floating-ui/core@1.6.9:
    resolution: {integrity: sha512-uMXCuQ3BItDUbAMhIXw7UPXRfAlOAvZzdK9BWpE60MCn+Svt3aLn9jsPTi/WNGlRUu2uI0v5S7JiIUsbsvh3fw==}
    dependencies:
      '@floating-ui/utils': 0.2.9
    dev: false

  /@floating-ui/dom@1.6.13:
    resolution: {integrity: sha512-umqzocjDgNRGTuO7Q8CU32dkHkECqI8ZdMZ5Swb6QAM0t5rnlrN3lGo1hdpscRd3WS8T6DKYK4ephgIH9iRh3w==}
    dependencies:
      '@floating-ui/core': 1.6.9
      '@floating-ui/utils': 0.2.9
    dev: false

  /@floating-ui/react-dom@2.1.2(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-06okr5cgPzMNBy+Ycse2A6udMi4bqwW/zgBF/rwjcNqWkyr82Mcg8b0vjX8OJpZFy/FKjJmw6wV7t44kK6kW7A==}
    peerDependencies:
      react: '>=16.8.0'
      react-dom: '>=16.8.0'
    dependencies:
      '@floating-ui/dom': 1.6.13
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@floating-ui/utils@0.2.9:
    resolution: {integrity: sha512-MDWhGtE+eHw5JW7lq4qhc5yRLS11ERl1c7Z6Xd0a58DozHES6EnNNwUWbMiG4J9Cgj053Bhk8zvlhFYKVhULwg==}
    dev: false

  /@heygen/streaming-avatar@2.0.13:
    resolution: {integrity: sha512-XToZH+QgMGTS4xB4G9Paa2PjJfM85LUby+edaWccoKcegoN+bgnwkYQ50tPHrDt7Bkdy0j7IB4HkOAfKZ8qXTg==}
    dependencies:
      livekit-client: 2.7.5
      protobufjs: 7.4.0
      webrtc-issue-detector: 1.16.3
    dev: false

  /@humanfs/core@0.19.1:
    resolution: {integrity: sha512-5DyQ4+1JEUzejeK1JGICcideyfUbGixgS9jNgex5nqkW+cY7WZhxBigmieN5Qnw9ZosSNVC9KQKyb+GUaGyKUA==}
    engines: {node: '>=18.18.0'}
    dev: true

  /@humanfs/node@0.16.6:
    resolution: {integrity: sha512-YuI2ZHQL78Q5HbhDiBA1X4LmYdXCKCMQIfw0pw7piHJwyREFebJUvrQN4cMssyES6x+vfUbx1CIpaQUKYdQZOw==}
    engines: {node: '>=18.18.0'}
    dependencies:
      '@humanfs/core': 0.19.1
      '@humanwhocodes/retry': 0.3.1
    dev: true

  /@humanwhocodes/module-importer@1.0.1:
    resolution: {integrity: sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==}
    engines: {node: '>=12.22'}
    dev: true

  /@humanwhocodes/retry@0.3.1:
    resolution: {integrity: sha512-JBxkERygn7Bv/GbN5Rv8Ul6LVknS+5Bp6RgDC/O8gEBU/yeH5Ui5C/OlWrTb6qct7LjjfT6Re2NxB0ln0yYybA==}
    engines: {node: '>=18.18'}
    dev: true

  /@humanwhocodes/retry@0.4.2:
    resolution: {integrity: sha512-xeO57FpIu4p1Ri3Jq/EXq4ClRm86dVF2z/+kvFnyqVYRavTZmaFaUBbWCOuuTh0o/g7DSsk6kc2vrS4Vl5oPOQ==}
    engines: {node: '>=18.18'}
    dev: true

  /@img/sharp-darwin-arm64@0.34.1:
    resolution: {integrity: sha512-pn44xgBtgpEbZsu+lWf2KNb6OAf70X68k+yk69Ic2Xz11zHR/w24/U49XT7AeRwJ0Px+mhALhU5LPci1Aymk7A==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [arm64]
    os: [darwin]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-darwin-arm64': 1.1.0
    dev: false
    optional: true

  /@img/sharp-darwin-x64@0.34.1:
    resolution: {integrity: sha512-VfuYgG2r8BpYiOUN+BfYeFo69nP/MIwAtSJ7/Zpxc5QF3KS22z8Pvg3FkrSFJBPNQ7mmcUcYQFBmEQp7eu1F8Q==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [x64]
    os: [darwin]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-darwin-x64': 1.1.0
    dev: false
    optional: true

  /@img/sharp-libvips-darwin-arm64@1.1.0:
    resolution: {integrity: sha512-HZ/JUmPwrJSoM4DIQPv/BfNh9yrOA8tlBbqbLz4JZ5uew2+o22Ik+tHQJcih7QJuSa0zo5coHTfD5J8inqj9DA==}
    cpu: [arm64]
    os: [darwin]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-darwin-x64@1.1.0:
    resolution: {integrity: sha512-Xzc2ToEmHN+hfvsl9wja0RlnXEgpKNmftriQp6XzY/RaSfwD9th+MSh0WQKzUreLKKINb3afirxW7A0fz2YWuQ==}
    cpu: [x64]
    os: [darwin]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-linux-arm64@1.1.0:
    resolution: {integrity: sha512-IVfGJa7gjChDET1dK9SekxFFdflarnUB8PwW8aGwEoF3oAsSDuNUTYS+SKDOyOJxQyDC1aPFMuRYLoDInyV9Ew==}
    cpu: [arm64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-linux-arm@1.1.0:
    resolution: {integrity: sha512-s8BAd0lwUIvYCJyRdFqvsj+BJIpDBSxs6ivrOPm/R7piTs5UIwY5OjXrP2bqXC9/moGsyRa37eYWYCOGVXxVrA==}
    cpu: [arm]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-linux-ppc64@1.1.0:
    resolution: {integrity: sha512-tiXxFZFbhnkWE2LA8oQj7KYR+bWBkiV2nilRldT7bqoEZ4HiDOcePr9wVDAZPi/Id5fT1oY9iGnDq20cwUz8lQ==}
    cpu: [ppc64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-linux-s390x@1.1.0:
    resolution: {integrity: sha512-xukSwvhguw7COyzvmjydRb3x/09+21HykyapcZchiCUkTThEQEOMtBj9UhkaBRLuBrgLFzQ2wbxdeCCJW/jgJA==}
    cpu: [s390x]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-linux-x64@1.1.0:
    resolution: {integrity: sha512-yRj2+reB8iMg9W5sULM3S74jVS7zqSzHG3Ol/twnAAkAhnGQnpjj6e4ayUz7V+FpKypwgs82xbRdYtchTTUB+Q==}
    cpu: [x64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-linuxmusl-arm64@1.1.0:
    resolution: {integrity: sha512-jYZdG+whg0MDK+q2COKbYidaqW/WTz0cc1E+tMAusiDygrM4ypmSCjOJPmFTvHHJ8j/6cAGyeDWZOsK06tP33w==}
    cpu: [arm64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-libvips-linuxmusl-x64@1.1.0:
    resolution: {integrity: sha512-wK7SBdwrAiycjXdkPnGCPLjYb9lD4l6Ze2gSdAGVZrEL05AOUJESWU2lhlC+Ffn5/G+VKuSm6zzbQSzFX/P65A==}
    cpu: [x64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-linux-arm64@0.34.1:
    resolution: {integrity: sha512-kX2c+vbvaXC6vly1RDf/IWNXxrlxLNpBVWkdpRq5Ka7OOKj6nr66etKy2IENf6FtOgklkg9ZdGpEu9kwdlcwOQ==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [arm64]
    os: [linux]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-linux-arm64': 1.1.0
    dev: false
    optional: true

  /@img/sharp-linux-arm@0.34.1:
    resolution: {integrity: sha512-anKiszvACti2sGy9CirTlNyk7BjjZPiML1jt2ZkTdcvpLU1YH6CXwRAZCA2UmRXnhiIftXQ7+Oh62Ji25W72jA==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [arm]
    os: [linux]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-linux-arm': 1.1.0
    dev: false
    optional: true

  /@img/sharp-linux-s390x@0.34.1:
    resolution: {integrity: sha512-7s0KX2tI9mZI2buRipKIw2X1ufdTeaRgwmRabt5bi9chYfhur+/C1OXg3TKg/eag1W+6CCWLVmSauV1owmRPxA==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [s390x]
    os: [linux]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-linux-s390x': 1.1.0
    dev: false
    optional: true

  /@img/sharp-linux-x64@0.34.1:
    resolution: {integrity: sha512-wExv7SH9nmoBW3Wr2gvQopX1k8q2g5V5Iag8Zk6AVENsjwd+3adjwxtp3Dcu2QhOXr8W9NusBU6XcQUohBZ5MA==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [x64]
    os: [linux]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-linux-x64': 1.1.0
    dev: false
    optional: true

  /@img/sharp-linuxmusl-arm64@0.34.1:
    resolution: {integrity: sha512-DfvyxzHxw4WGdPiTF0SOHnm11Xv4aQexvqhRDAoD00MzHekAj9a/jADXeXYCDFH/DzYruwHbXU7uz+H+nWmSOQ==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [arm64]
    os: [linux]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-linuxmusl-arm64': 1.1.0
    dev: false
    optional: true

  /@img/sharp-linuxmusl-x64@0.34.1:
    resolution: {integrity: sha512-pax/kTR407vNb9qaSIiWVnQplPcGU8LRIJpDT5o8PdAx5aAA7AS3X9PS8Isw1/WfqgQorPotjrZL3Pqh6C5EBg==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [x64]
    os: [linux]
    requiresBuild: true
    optionalDependencies:
      '@img/sharp-libvips-linuxmusl-x64': 1.1.0
    dev: false
    optional: true

  /@img/sharp-wasm32@0.34.1:
    resolution: {integrity: sha512-YDybQnYrLQfEpzGOQe7OKcyLUCML4YOXl428gOOzBgN6Gw0rv8dpsJ7PqTHxBnXnwXr8S1mYFSLSa727tpz0xg==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [wasm32]
    requiresBuild: true
    dependencies:
      '@emnapi/runtime': 1.4.0
    dev: false
    optional: true

  /@img/sharp-win32-ia32@0.34.1:
    resolution: {integrity: sha512-WKf/NAZITnonBf3U1LfdjoMgNO5JYRSlhovhRhMxXVdvWYveM4kM3L8m35onYIdh75cOMCo1BexgVQcCDzyoWw==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [ia32]
    os: [win32]
    requiresBuild: true
    dev: false
    optional: true

  /@img/sharp-win32-x64@0.34.1:
    resolution: {integrity: sha512-hw1iIAHpNE8q3uMIRCgGOeDoz9KtFNarFLQclLxr/LK1VBkj8nby18RjFvr6aP7USRYAjTZW6yisnBWMX571Tw==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    cpu: [x64]
    os: [win32]
    requiresBuild: true
    dev: false
    optional: true

  /@isaacs/cliui@8.0.2:
    resolution: {integrity: sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==}
    engines: {node: '>=12'}
    dependencies:
      string-width: 5.1.2
      string-width-cjs: /string-width@4.2.3
      strip-ansi: 7.1.0
      strip-ansi-cjs: /strip-ansi@6.0.1
      wrap-ansi: 8.1.0
      wrap-ansi-cjs: /wrap-ansi@7.0.0
    dev: true

  /@jridgewell/gen-mapping@0.3.8:
    resolution: {integrity: sha512-imAbBGkb+ebQyxKgzv5Hu2nmROxoDOXHh80evxdoXNOrvAnVx7zimzc1Oo5h9RlfV4vPXaE2iM5pOFbvOCClWA==}
    engines: {node: '>=6.0.0'}
    dependencies:
      '@jridgewell/set-array': 1.2.1
      '@jridgewell/sourcemap-codec': 1.5.0
      '@jridgewell/trace-mapping': 0.3.25
    dev: true

  /@jridgewell/resolve-uri@3.1.2:
    resolution: {integrity: sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==}
    engines: {node: '>=6.0.0'}
    dev: true

  /@jridgewell/set-array@1.2.1:
    resolution: {integrity: sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==}
    engines: {node: '>=6.0.0'}
    dev: true

  /@jridgewell/sourcemap-codec@1.5.0:
    resolution: {integrity: sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==}
    dev: true

  /@jridgewell/trace-mapping@0.3.25:
    resolution: {integrity: sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==}
    dependencies:
      '@jridgewell/resolve-uri': 3.1.2
      '@jridgewell/sourcemap-codec': 1.5.0
    dev: true

  /@livekit/mutex@1.0.0:
    resolution: {integrity: sha512-aiUhoThBNF9UyGTxEURFzJLhhPLIVTnQiEVMjRhPnfHNKLfo2JY9xovHKIus7B78UD5hsP6DlgpmAsjrz4U0Iw==}
    dev: false

  /@livekit/protocol@1.29.4:
    resolution: {integrity: sha512-dsqxvABHilrMA0BU5m1w8cMWSVeDjV2ZUIUDClNQZju3c30DLMfEYDHU5nmXDfaaHjNIgoRbYR7upJMozG8JJg==}
    dependencies:
      '@bufbuild/protobuf': 1.10.0
    dev: false

  /@next/env@15.3.0:
    resolution: {integrity: sha512-6mDmHX24nWlHOlbwUiAOmMyY7KELimmi+ed8qWcJYjqXeC+G6JzPZ3QosOAfjNwgMIzwhXBiRiCgdh8axTTdTA==}
    dev: false

  /@next/eslint-plugin-next@15.3.1:
    resolution: {integrity: sha512-oEs4dsfM6iyER3jTzMm4kDSbrQJq8wZw5fmT6fg2V3SMo+kgG+cShzLfEV20senZzv8VF+puNLheiGPlBGsv2A==}
    dependencies:
      fast-glob: 3.3.1
    dev: true

  /@next/swc-darwin-arm64@15.3.0:
    resolution: {integrity: sha512-PDQcByT0ZfF2q7QR9d+PNj3wlNN4K6Q8JoHMwFyk252gWo4gKt7BF8Y2+KBgDjTFBETXZ/TkBEUY7NIIY7A/Kw==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [darwin]
    requiresBuild: true
    dev: false
    optional: true

  /@next/swc-darwin-x64@15.3.0:
    resolution: {integrity: sha512-m+eO21yg80En8HJ5c49AOQpFDq+nP51nu88ZOMCorvw3g//8g1JSUsEiPSiFpJo1KCTQ+jm9H0hwXK49H/RmXg==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [darwin]
    requiresBuild: true
    dev: false
    optional: true

  /@next/swc-linux-arm64-gnu@15.3.0:
    resolution: {integrity: sha512-H0Kk04ZNzb6Aq/G6e0un4B3HekPnyy6D+eUBYPJv9Abx8KDYgNMWzKt4Qhj57HXV3sTTjsfc1Trc1SxuhQB+Tg==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@next/swc-linux-arm64-musl@15.3.0:
    resolution: {integrity: sha512-k8GVkdMrh/+J9uIv/GpnHakzgDQhrprJ/FbGQvwWmstaeFG06nnAoZCJV+wO/bb603iKV1BXt4gHG+s2buJqZA==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@next/swc-linux-x64-gnu@15.3.0:
    resolution: {integrity: sha512-ZMQ9yzDEts/vkpFLRAqfYO1wSpIJGlQNK9gZ09PgyjBJUmg8F/bb8fw2EXKgEaHbCc4gmqMpDfh+T07qUphp9A==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@next/swc-linux-x64-musl@15.3.0:
    resolution: {integrity: sha512-RFwq5VKYTw9TMr4T3e5HRP6T4RiAzfDJ6XsxH8j/ZeYq2aLsBqCkFzwMI0FmnSsLaUbOb46Uov0VvN3UciHX5A==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [linux]
    requiresBuild: true
    dev: false
    optional: true

  /@next/swc-win32-arm64-msvc@15.3.0:
    resolution: {integrity: sha512-a7kUbqa/k09xPjfCl0RSVAvEjAkYBYxUzSVAzk2ptXiNEL+4bDBo9wNC43G/osLA/EOGzG4CuNRFnQyIHfkRgQ==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [win32]
    requiresBuild: true
    dev: false
    optional: true

  /@next/swc-win32-x64-msvc@15.3.0:
    resolution: {integrity: sha512-vHUQS4YVGJPmpjn7r5lEZuMhK5UQBNBRSB+iGDvJjaNk649pTIcRluDWNb9siunyLLiu/LDPHfvxBtNamyuLTw==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [win32]
    requiresBuild: true
    dev: false
    optional: true

  /@nodelib/fs.scandir@2.1.5:
    resolution: {integrity: sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==}
    engines: {node: '>= 8'}
    dependencies:
      '@nodelib/fs.stat': 2.0.5
      run-parallel: 1.2.0
    dev: true

  /@nodelib/fs.stat@2.0.5:
    resolution: {integrity: sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==}
    engines: {node: '>= 8'}
    dev: true

  /@nodelib/fs.walk@1.2.8:
    resolution: {integrity: sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==}
    engines: {node: '>= 8'}
    dependencies:
      '@nodelib/fs.scandir': 2.1.5
      fastq: 1.17.1
    dev: true

  /@pkgjs/parseargs@0.11.0:
    resolution: {integrity: sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==}
    engines: {node: '>=14'}
    requiresBuild: true
    dev: true
    optional: true

  /@pkgr/core@0.2.4:
    resolution: {integrity: sha512-ROFF39F6ZrnzSUEmQQZUar0Jt4xVoP9WnDRdWwF4NNcXs3xBTLgBUDoOwW141y1jP+S8nahIbdxbFC7IShw9Iw==}
    engines: {node: ^12.20.0 || ^14.18.0 || >=16.0.0}
    dev: true

  /@protobufjs/aspromise@1.1.2:
    resolution: {integrity: sha512-j+gKExEuLmKwvz3OgROXtrJ2UG2x8Ch2YZUxahh+s1F2HZ+wAceUNLkvy6zKCPVRkU++ZWQrdxsUeQXmcg4uoQ==}
    dev: false

  /@protobufjs/base64@1.1.2:
    resolution: {integrity: sha512-AZkcAA5vnN/v4PDqKyMR5lx7hZttPDgClv83E//FMNhR2TMcLUhfRUBHCmSl0oi9zMgDDqRUJkSxO3wm85+XLg==}
    dev: false

  /@protobufjs/codegen@2.0.4:
    resolution: {integrity: sha512-YyFaikqM5sH0ziFZCN3xDC7zeGaB/d0IUb9CATugHWbd1FRFwWwt4ld4OYMPWu5a3Xe01mGAULCdqhMlPl29Jg==}
    dev: false

  /@protobufjs/eventemitter@1.1.0:
    resolution: {integrity: sha512-j9ednRT81vYJ9OfVuXG6ERSTdEL1xVsNgqpkxMsbIabzSo3goCjDIveeGv5d03om39ML71RdmrGNjG5SReBP/Q==}
    dev: false

  /@protobufjs/fetch@1.1.0:
    resolution: {integrity: sha512-lljVXpqXebpsijW71PZaCYeIcE5on1w5DlQy5WH6GLbFryLUrBD4932W/E2BSpfRJWseIL4v/KPgBFxDOIdKpQ==}
    dependencies:
      '@protobufjs/aspromise': 1.1.2
      '@protobufjs/inquire': 1.1.0
    dev: false

  /@protobufjs/float@1.0.2:
    resolution: {integrity: sha512-Ddb+kVXlXst9d+R9PfTIxh1EdNkgoRe5tOX6t01f1lYWOvJnSPDBlG241QLzcyPdoNTsblLUdujGSE4RzrTZGQ==}
    dev: false

  /@protobufjs/inquire@1.1.0:
    resolution: {integrity: sha512-kdSefcPdruJiFMVSbn801t4vFK7KB/5gd2fYvrxhuJYg8ILrmn9SKSX2tZdV6V+ksulWqS7aXjBcRXl3wHoD9Q==}
    dev: false

  /@protobufjs/path@1.1.2:
    resolution: {integrity: sha512-6JOcJ5Tm08dOHAbdR3GrvP+yUUfkjG5ePsHYczMFLq3ZmMkAD98cDgcT2iA1lJ9NVwFd4tH/iSSoe44YWkltEA==}
    dev: false

  /@protobufjs/pool@1.1.0:
    resolution: {integrity: sha512-0kELaGSIDBKvcgS4zkjz1PeddatrjYcmMWOlAuAPwAeccUrPHdUqo/J6LiymHHEiJT5NrF1UVwxY14f+fy4WQw==}
    dev: false

  /@protobufjs/utf8@1.1.0:
    resolution: {integrity: sha512-Vvn3zZrhQZkkBE8LSuW3em98c0FwgO4nxzv6OdSxPKJIEKY2bGbHn+mhGIPerzI4twdxaP8/0+06HBpwf345Lw==}
    dev: false

  /@radix-ui/number@1.1.1:
    resolution: {integrity: sha512-MkKCwxlXTgz6CFoJx3pCwn07GKp36+aZyu/u2Ln2VrA5DcdyCZkASEDBTd8x5whTQQL5CiYf4prXKLcgQdv29g==}
    dev: false

  /@radix-ui/primitive@1.1.2:
    resolution: {integrity: sha512-XnbHrrprsNqZKQhStrSwgRUQzoCI1glLzdw79xiZPoofhGICeZRSQ3dIxAKH1gb3OHfNf4d6f+vAv3kil2eggA==}
    dev: false

  /@radix-ui/react-arrow@1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-2dvVU4jva0qkNZH6HHWuSz5FN5GeU5tymvCgutF8WaXz9WnD1NgUhy73cqzkjkN4Zkn8lfTPv5JIfrC221W+Nw==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-collection@1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-mM2pxoQw5HJ49rkzwOs7Y6J4oYH22wS8BfK2/bBxROlI4xuR0c4jEenQP63LlTlDkO6Buj2Vt+QYAYcOgqtrXA==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-context': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-slot': 1.2.0(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-compose-refs@1.1.2(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-z4eqJvfiNnFMHIIvXP3CY57y2WJs5g2v3X0zm9mEJkrkNv4rDxu+sg9Jh8EkXyeqBkB7SOcboo9dMVqhyrACIg==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-context@1.1.2(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-jCi/QKUM2r1Ju5a3J64TH2A5SpKAgh0LpknyqdQ4m6DCV0xJ2HG1xARRwNGPQfi1SLdLWZ1OJz6F4OMBBNiGJA==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-direction@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-1UEWRX6jnOA2y4H5WczZ44gOOjTEmlqv1uNW4GAJEO5+bauCBhv8snY65Iw5/VOS/ghKN9gr2KjnLKxrsvoMVw==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-dismissable-layer@1.1.6(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-7gpgMT2gyKym9Jz2ZhlRXSg2y6cNQIK8d/cqBZ0RBCaps8pFryCWXiUKI+uHGFrhMrbGUP7U6PWgiXzIxoyF3Q==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/primitive': 1.1.2
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-escape-keydown': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-focus-guards@1.1.2(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-fyjAACV62oPV925xFCrH8DR5xWhg9KYtJT4s3u54jxp+L/hbpTY2kIeEFFbFe+a/HCE94zGQMZLIpVTPVZDhaA==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-focus-scope@1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-4XaDlq0bPt7oJwR+0k0clCiCO/7lO7NKZTAaJBYxDNQT/vj4ig0/UvctrRscZaFREpRvUTkpKR96ov1e6jptQg==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-id@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-kGkGegYIdQsOb4XjsfM97rXsiHaBwco+hFI66oO4s9LU+PLAC5oJ7khdOVFxkhsmlbpUqDAvXw11CluXP+jkHg==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-popper@1.2.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-iNb9LYUMkne9zIahukgQmHlSBp9XWGeQQ7FvUGNk45ywzOb6kQa+Ca38OphXlWDiKvyneo9S+KSJsLfLt8812A==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@floating-ui/react-dom': 2.1.2(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-arrow': 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-context': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-rect': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-size': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/rect': 1.1.1
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-portal@1.1.5(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-ps/67ZqsFm+Mb6lSPJpfhRLrVL2i2fntgCmGMqqth4eaGUf+knAuuRtWVJrNjUhExgmdRqftSgzpf0DF0n6yXA==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-primitive@2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-Pf/t/GkndH7CQ8wE2hbkXA+WyZ83fhQQn5DDmwDiDo6AwN/fhaH8oqZ0jRjMrO2iaMhDi6P1HRx6AZwyMinY1g==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/react-slot': 1.2.0(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-roving-focus@1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-ufbpLUjZiOg4iYgb2hQrWXEPYX6jOLBbR27bDyAff5GYMRrCzcze8lukjuXVUQvJ6HZe8+oL+hhswDcjmcgVyg==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/primitive': 1.1.2
      '@radix-ui/react-collection': 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-context': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-direction': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-id': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-controllable-state': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-select@2.1.7(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-exzGIRtc7S8EIM2KjFg+7lJZsH7O7tpaBaJbBNVDnOZNhtoQ2iV+iSNfi2Wth0m6h3trJkMVvzAehB3c6xj/3Q==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/number': 1.1.1
      '@radix-ui/primitive': 1.1.2
      '@radix-ui/react-collection': 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-context': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-direction': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-dismissable-layer': 1.1.6(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-focus-guards': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-focus-scope': 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-id': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-popper': 1.2.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-portal': 1.1.5(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-slot': 1.2.0(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-controllable-state': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-previous': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-visually-hidden': 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      aria-hidden: 1.2.4
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
      react-remove-scroll: 2.6.3(@types/react@19.0.1)(react@19.1.0)
    dev: false

  /@radix-ui/react-slot@1.2.0(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-ujc+V6r0HNDviYqIK3rW4ffgYiZ8g5DEHrGJVk4x7kTlLXRDILnKX9vAUYeIsLOoDpDJ0ujpqMkjH4w2ofuo6w==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-switch@1.1.4(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-zGP6W8plLeogoeGMiTHJ/uvf+TE1C2chVsEwfP8YlvpQKJHktG+iCkUtCLGPAuDV8/qDSmIRPm4NggaTxFMVBQ==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/primitive': 1.1.2
      '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-context': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-controllable-state': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-previous': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-use-size': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-toggle-group@1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-khTzdGIxy8WurYUEUrapvj5aOev/tUA8TDEFi1D0Dn3yX+KR5AqjX0b7E5sL9ngRRpxDN2RRJdn5siasu5jtcg==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/primitive': 1.1.2
      '@radix-ui/react-context': 1.1.2(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-direction': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-roving-focus': 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-toggle': 1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-controllable-state': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-toggle@1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-Za5HHd9nvsiZ2t3EI/dVd4Bm/JydK+D22uHKk46fPtvuPxVCJBUo5mQybN+g5sZe35y7I6GDTTfdkVv5SnxlFg==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/primitive': 1.1.2
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@radix-ui/react-use-controllable-state': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/react-use-callback-ref@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-FkBMwD+qbGQeMu1cOHnuGB6x4yzPjho8ap5WtbEJ26umhgqVXbhekKUQO+hZEL1vU92a3wHwdp0HAcqAUF5iDg==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-use-controllable-state@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-YnEXIy8/ga01Y1PN0VfaNH//MhA91JlEGVBDxDzROqwrAtG5Yr2QGEPz8A/rJA3C7ZAHryOYGaUv8fLSW2H/mg==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-use-escape-keydown@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-Il0+boE7w/XebUHyBjroE+DbByORGR9KKmITzbR7MyQ4akpORYP/ZmbhAr0DG7RmmBqoOnZdy2QlvajJ2QA59g==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-use-layout-effect@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-RbJRS4UWQFkzHTTwVymMTUv8EqYhOp8dOOviLj2ugtTiXRaRQS7GLGxZTLL1jWhMeoSCf5zmcZkqTl9IiYfXcQ==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-use-previous@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-2dHfToCj/pzca2Ck724OZ5L0EVrr3eHRNsG/b3xQJLA2hZpVCS99bLAX+hm1IHXDEnzU6by5z/5MIY794/a8NQ==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-use-rect@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-QTYuDesS0VtuHNNvMh+CjlKJ4LJickCMUAqjlE3+j8w+RlRpwyX3apEQKGFzbZGdo7XNG1tXa+bQqIE7HIXT2w==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@radix-ui/rect': 1.1.1
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-use-size@1.1.1(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-ewrXRDTAqAXlkl6t/fkXWNAhFX9I+CkKlw6zjEwk86RSPKwZr3xpBRso655aqYafwtnbpHLj6toFzmd6xdVptQ==}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.0.1)(react@19.1.0)
      '@types/react': 19.0.1
      react: 19.1.0
    dev: false

  /@radix-ui/react-visually-hidden@1.1.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-oXSF3ZQRd5fvomd9hmUCb2EHSZbPp3ZSHAHJJU/DlF9XoFkJBBW8RHU/E8WEH+RbSfJd/QFA0sl8ClJXknBwHQ==}
    peerDependencies:
      '@types/react': '*'
      '@types/react-dom': '*'
      react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
      react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
      '@types/react-dom':
        optional: true
    dependencies:
      '@radix-ui/react-primitive': 2.0.3(@types/react-dom@19.1.2)(@types/react@19.0.1)(react-dom@19.1.0)(react@19.1.0)
      '@types/react': 19.0.1
      '@types/react-dom': 19.1.2(@types/react@19.0.1)
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
    dev: false

  /@radix-ui/rect@1.1.1:
    resolution: {integrity: sha512-HPwpGIzkl28mWyZqG52jiqDJ12waP11Pa1lGoiyUkIEuMLBP0oeK/C89esbXrxsky5we7dfd8U58nm0SgAWpVw==}
    dev: false

  /@rtsao/scc@1.1.0:
    resolution: {integrity: sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==}
    dev: true

  /@swc/counter@0.1.3:
    resolution: {integrity: sha512-e2BR4lsJkkRlKZ/qCHPw9ZaSxc0MVUd7gtbtaB7aMvHeJVYe8sOB8DBZkP2DtISHGSku9sCK6T6cnY0CtXrOCQ==}
    dev: false

  /@swc/helpers@0.5.15:
    resolution: {integrity: sha512-JQ5TuMi45Owi4/BIMAJBoSQoOJu12oOk/gADqlcUL9JEdHB8vyjUSsxqeNXnmXHjYKMi2WcYtezGEEhqUI/E2g==}
    dependencies:
      tslib: 2.8.1
    dev: false

  /@types/estree@1.0.7:
    resolution: {integrity: sha512-w28IoSUCJpidD/TGviZwwMJckNESJZXFu7NBZ5YJ4mEUnNraUn9Pm8HSZm/jDF1pDWYKspWE7oVphigUPRakIQ==}
    dev: true

  /@types/json-schema@7.0.15:
    resolution: {integrity: sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==}
    dev: true

  /@types/json5@0.0.29:
    resolution: {integrity: sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==}
    dev: true

  /@types/node-fetch@2.6.12:
    resolution: {integrity: sha512-8nneRWKCg3rMtF69nLQJnOYUcbafYeFSjqkw3jCRLsqkWFlHaoQrr5mXmofFGOx3DKn7UfmBMyov8ySvLRVldA==}
    dependencies:
      '@types/node': 20.5.7
      form-data: 4.0.1
    dev: false

  /@types/node@18.19.68:
    resolution: {integrity: sha512-QGtpFH1vB99ZmTa63K4/FU8twThj4fuVSBkGddTp7uIL/cuoLWIUSL2RcOaigBhfR+hg5pgGkBnkoOxrTVBMKw==}
    dependencies:
      undici-types: 5.26.5
    dev: false

  /@types/node@20.5.7:
    resolution: {integrity: sha512-dP7f3LdZIysZnmvP3ANJYTSwg+wLLl8p7RqniVlV7j+oXSXAbt9h0WIBFmJy5inWZoX9wZN6eXx+YXd9Rh3RBA==}

  /@types/react-dom@19.1.2(@types/react@19.0.1):
    resolution: {integrity: sha512-XGJkWF41Qq305SKWEILa1O8vzhb3aOo3ogBlSmiqNko/WmRb6QIaweuZCXjKygVDXpzXb5wyxKTSOsmkuqj+Qw==}
    peerDependencies:
      '@types/react': ^19.0.0
    dependencies:
      '@types/react': 19.0.1

  /@types/react@19.0.1:
    resolution: {integrity: sha512-YW6614BDhqbpR5KtUYzTA+zlA7nayzJRA9ljz9CQoxthR0sDisYZLuvSMsil36t4EH/uAt8T52Xb4sVw17G+SQ==}
    dependencies:
      csstype: 3.1.3

  /@typescript-eslint/eslint-plugin@8.31.0(@typescript-eslint/parser@8.31.0)(eslint@9.25.1)(typescript@5.0.4):
    resolution: {integrity: sha512-evaQJZ/J/S4wisevDvC1KFZkPzRetH8kYZbkgcTRyql3mcKsf+ZFDV1BVWUGTCAW5pQHoqn5gK5b8kn7ou9aFQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    peerDependencies:
      '@typescript-eslint/parser': ^8.0.0 || ^8.0.0-alpha.0
      eslint: ^8.57.0 || ^9.0.0
      typescript: '>=4.8.4 <5.9.0'
    dependencies:
      '@eslint-community/regexpp': 4.12.1
      '@typescript-eslint/parser': 8.31.0(eslint@9.25.1)(typescript@5.0.4)
      '@typescript-eslint/scope-manager': 8.31.0
      '@typescript-eslint/type-utils': 8.31.0(eslint@9.25.1)(typescript@5.0.4)
      '@typescript-eslint/utils': 8.31.0(eslint@9.25.1)(typescript@5.0.4)
      '@typescript-eslint/visitor-keys': 8.31.0
      eslint: 9.25.1
      graphemer: 1.4.0
      ignore: 5.3.2
      natural-compare: 1.4.0
      ts-api-utils: 2.1.0(typescript@5.0.4)
      typescript: 5.0.4
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@typescript-eslint/parser@8.31.0(eslint@9.25.1)(typescript@5.0.4):
    resolution: {integrity: sha512-67kYYShjBR0jNI5vsf/c3WG4u+zDnCTHTPqVMQguffaWWFs7artgwKmfwdifl+r6XyM5LYLas/dInj2T0SgJyw==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    peerDependencies:
      eslint: ^8.57.0 || ^9.0.0
      typescript: '>=4.8.4 <5.9.0'
    dependencies:
      '@typescript-eslint/scope-manager': 8.31.0
      '@typescript-eslint/types': 8.31.0
      '@typescript-eslint/typescript-estree': 8.31.0(typescript@5.0.4)
      '@typescript-eslint/visitor-keys': 8.31.0
      debug: 4.4.0
      eslint: 9.25.1
      typescript: 5.0.4
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@typescript-eslint/scope-manager@8.31.0:
    resolution: {integrity: sha512-knO8UyF78Nt8O/B64i7TlGXod69ko7z6vJD9uhSlm0qkAbGeRUSudcm0+K/4CrRjrpiHfBCjMWlc08Vav1xwcw==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      '@typescript-eslint/types': 8.31.0
      '@typescript-eslint/visitor-keys': 8.31.0
    dev: true

  /@typescript-eslint/type-utils@8.31.0(eslint@9.25.1)(typescript@5.0.4):
    resolution: {integrity: sha512-DJ1N1GdjI7IS7uRlzJuEDCgDQix3ZVYVtgeWEyhyn4iaoitpMBX6Ndd488mXSx0xah/cONAkEaYyylDyAeHMHg==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    peerDependencies:
      eslint: ^8.57.0 || ^9.0.0
      typescript: '>=4.8.4 <5.9.0'
    dependencies:
      '@typescript-eslint/typescript-estree': 8.31.0(typescript@5.0.4)
      '@typescript-eslint/utils': 8.31.0(eslint@9.25.1)(typescript@5.0.4)
      debug: 4.4.0
      eslint: 9.25.1
      ts-api-utils: 2.1.0(typescript@5.0.4)
      typescript: 5.0.4
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@typescript-eslint/types@8.31.0:
    resolution: {integrity: sha512-Ch8oSjVyYyJxPQk8pMiP2FFGYatqXQfQIaMp+TpuuLlDachRWpUAeEu1u9B/v/8LToehUIWyiKcA/w5hUFRKuQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dev: true

  /@typescript-eslint/typescript-estree@8.31.0(typescript@5.0.4):
    resolution: {integrity: sha512-xLmgn4Yl46xi6aDSZ9KkyfhhtnYI15/CvHbpOy/eR5NWhK/BK8wc709KKwhAR0m4ZKRP7h07bm4BWUYOCuRpQQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    peerDependencies:
      typescript: '>=4.8.4 <5.9.0'
    dependencies:
      '@typescript-eslint/types': 8.31.0
      '@typescript-eslint/visitor-keys': 8.31.0
      debug: 4.4.0
      fast-glob: 3.3.2
      is-glob: 4.0.3
      minimatch: 9.0.5
      semver: 7.7.1
      ts-api-utils: 2.1.0(typescript@5.0.4)
      typescript: 5.0.4
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@typescript-eslint/utils@8.31.0(eslint@9.25.1)(typescript@5.0.4):
    resolution: {integrity: sha512-qi6uPLt9cjTFxAb1zGNgTob4x9ur7xC6mHQJ8GwEzGMGE9tYniublmJaowOJ9V2jUzxrltTPfdG2nKlWsq0+Ww==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    peerDependencies:
      eslint: ^8.57.0 || ^9.0.0
      typescript: '>=4.8.4 <5.9.0'
    dependencies:
      '@eslint-community/eslint-utils': 4.4.1(eslint@9.25.1)
      '@typescript-eslint/scope-manager': 8.31.0
      '@typescript-eslint/types': 8.31.0
      '@typescript-eslint/typescript-estree': 8.31.0(typescript@5.0.4)
      eslint: 9.25.1
      typescript: 5.0.4
    transitivePeerDependencies:
      - supports-color
    dev: true

  /@typescript-eslint/visitor-keys@8.31.0:
    resolution: {integrity: sha512-QcGHmlRHWOl93o64ZUMNewCdwKGU6WItOU52H0djgNmn1EOrhVudrDzXz4OycCRSCPwFCDrE2iIt5vmuUdHxuQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      '@typescript-eslint/types': 8.31.0
      eslint-visitor-keys: 4.2.0
    dev: true

  /abort-controller@3.0.0:
    resolution: {integrity: sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==}
    engines: {node: '>=6.5'}
    dependencies:
      event-target-shim: 5.0.1
    dev: false

  /acorn-jsx@5.3.2(acorn@8.14.0):
    resolution: {integrity: sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==}
    peerDependencies:
      acorn: ^6.0.0 || ^7.0.0 || ^8.0.0
    dependencies:
      acorn: 8.14.0
    dev: true

  /acorn@8.14.0:
    resolution: {integrity: sha512-cl669nCJTZBsL97OF4kUQm5g5hC2uihk0NxY3WENAC0TYdILVkAyHymAntgxGkl7K+t0cXIrH5siy5S4XkFycA==}
    engines: {node: '>=0.4.0'}
    hasBin: true
    dev: true

  /agentkeepalive@4.5.0:
    resolution: {integrity: sha512-5GG/5IbQQpC9FpkRGsSvZI5QYeSCzlJHdpBQntCsuTOxhKD8lqKhrleg2Yi7yvMIf82Ycmmqln9U8V9qwEiJew==}
    engines: {node: '>= 8.0.0'}
    dependencies:
      humanize-ms: 1.2.1
    dev: false

  /ahooks@3.8.4(react@19.1.0):
    resolution: {integrity: sha512-39wDEw2ZHvypaT14EpMMk4AzosHWt0z9bulY0BeDsvc9PqJEV+Kjh/4TZfftSsotBMq52iYIOFPd3PR56e0ZJg==}
    engines: {node: '>=8.0.0'}
    peerDependencies:
      react: ^16.8.0 || ^17.0.0 || ^18.0.0
    dependencies:
      '@babel/runtime': 7.26.0
      dayjs: 1.11.13
      intersection-observer: 0.12.2
      js-cookie: 3.0.5
      lodash: 4.17.21
      react: 19.1.0
      react-fast-compare: 3.2.2
      resize-observer-polyfill: 1.5.1
      screenfull: 5.2.0
      tslib: 2.8.1
    dev: false

  /ajv@6.12.6:
    resolution: {integrity: sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==}
    dependencies:
      fast-deep-equal: 3.1.3
      fast-json-stable-stringify: 2.1.0
      json-schema-traverse: 0.4.1
      uri-js: 4.4.1
    dev: true

  /ansi-regex@5.0.1:
    resolution: {integrity: sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==}
    engines: {node: '>=8'}
    dev: true

  /ansi-regex@6.1.0:
    resolution: {integrity: sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==}
    engines: {node: '>=12'}
    dev: true

  /ansi-styles@4.3.0:
    resolution: {integrity: sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==}
    engines: {node: '>=8'}
    dependencies:
      color-convert: 2.0.1
    dev: true

  /ansi-styles@6.2.1:
    resolution: {integrity: sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==}
    engines: {node: '>=12'}
    dev: true

  /any-promise@1.3.0:
    resolution: {integrity: sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==}
    dev: true

  /anymatch@3.1.3:
    resolution: {integrity: sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==}
    engines: {node: '>= 8'}
    dependencies:
      normalize-path: 3.0.0
      picomatch: 2.3.1
    dev: true

  /arg@5.0.2:
    resolution: {integrity: sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==}
    dev: true

  /argparse@2.0.1:
    resolution: {integrity: sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==}
    dev: true

  /aria-hidden@1.2.4:
    resolution: {integrity: sha512-y+CcFFwelSXpLZk/7fMB2mUbGtX9lKycf1MWJ7CaTIERyitVlyQx6C+sxcROU2BAJ24OiZyK+8wj2i8AlBoS3A==}
    engines: {node: '>=10'}
    dependencies:
      tslib: 2.8.1
    dev: false

  /array-buffer-byte-length@1.0.1:
    resolution: {integrity: sha512-ahC5W1xgou+KTXix4sAO8Ki12Q+jf4i0+tmk3sC+zgcynshkHxzpXdImBehiUYKKKDwvfFiJl1tZt6ewscS1Mg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      is-array-buffer: 3.0.5
    dev: true

  /array-includes@3.1.8:
    resolution: {integrity: sha512-itaWrbYbqpGXkGhZPGUulwnhVf5Hpy1xiCFsGqyIGglbBxmG5vSjxQen3/WGOjPpNEv1RtBLKxbmVXm8HpJStQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-object-atoms: 1.1.1
      get-intrinsic: 1.3.0
      is-string: 1.1.1
    dev: true

  /array.prototype.findlast@1.2.5:
    resolution: {integrity: sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-errors: 1.3.0
      es-object-atoms: 1.1.1
      es-shim-unscopables: 1.0.2
    dev: true

  /array.prototype.findlastindex@1.2.5:
    resolution: {integrity: sha512-zfETvRFA8o7EiNn++N5f/kaCw221hrpGsDmcpndVupkPzEc1Wuf3VgC0qby1BbHs7f5DVYjgtEU2LLh5bqeGfQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-errors: 1.3.0
      es-object-atoms: 1.1.1
      es-shim-unscopables: 1.0.2
    dev: true

  /array.prototype.flat@1.3.3:
    resolution: {integrity: sha512-rwG/ja1neyLqCuGZ5YYrznA62D4mZXg0i1cIskIUKSiqF3Cje9/wXAls9B9s1Wa2fomMsIv8czB8jZcPmxCXFg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-shim-unscopables: 1.0.2
    dev: true

  /array.prototype.flatmap@1.3.3:
    resolution: {integrity: sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-shim-unscopables: 1.0.2
    dev: true

  /array.prototype.tosorted@1.1.4:
    resolution: {integrity: sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-errors: 1.3.0
      es-shim-unscopables: 1.0.2
    dev: true

  /arraybuffer.prototype.slice@1.0.4:
    resolution: {integrity: sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      array-buffer-byte-length: 1.0.1
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      is-array-buffer: 3.0.5
    dev: true

  /asynckit@0.4.0:
    resolution: {integrity: sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==}
    dev: false

  /autoprefixer@10.4.19(postcss@8.4.38):
    resolution: {integrity: sha512-BaENR2+zBZ8xXhM4pUaKUxlVdxZ0EZhjvbopwnXmxRUfqDmwSpC2lAi/QXvx7NRdPCo1WKEcEF6mV64si1z4Ew==}
    engines: {node: ^10 || ^12 || >=14}
    hasBin: true
    peerDependencies:
      postcss: ^8.1.0
    dependencies:
      browserslist: 4.24.3
      caniuse-lite: 1.0.30001690
      fraction.js: 4.3.7
      normalize-range: 0.1.2
      picocolors: 1.1.1
      postcss: 8.4.38
      postcss-value-parser: 4.2.0
    dev: true

  /available-typed-arrays@1.0.7:
    resolution: {integrity: sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      possible-typed-array-names: 1.0.0
    dev: true

  /balanced-match@1.0.2:
    resolution: {integrity: sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==}
    dev: true

  /binary-extensions@2.3.0:
    resolution: {integrity: sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==}
    engines: {node: '>=8'}
    dev: true

  /brace-expansion@1.1.11:
    resolution: {integrity: sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==}
    dependencies:
      balanced-match: 1.0.2
      concat-map: 0.0.1
    dev: true

  /brace-expansion@2.0.1:
    resolution: {integrity: sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==}
    dependencies:
      balanced-match: 1.0.2
    dev: true

  /braces@3.0.3:
    resolution: {integrity: sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==}
    engines: {node: '>=8'}
    dependencies:
      fill-range: 7.1.1
    dev: true

  /browserslist@4.24.3:
    resolution: {integrity: sha512-1CPmv8iobE2fyRMV97dAcMVegvvWKxmq94hkLiAkUGwKVTyDLw33K+ZxiFrREKmmps4rIw6grcCFCnTMSZ/YiA==}
    engines: {node: ^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7}
    hasBin: true
    dependencies:
      caniuse-lite: 1.0.30001690
      electron-to-chromium: 1.5.75
      node-releases: 2.0.19
      update-browserslist-db: 1.1.1(browserslist@4.24.3)
    dev: true

  /busboy@1.6.0:
    resolution: {integrity: sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==}
    engines: {node: '>=10.16.0'}
    dependencies:
      streamsearch: 1.1.0
    dev: false

  /call-bind-apply-helpers@1.0.2:
    resolution: {integrity: sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      es-errors: 1.3.0
      function-bind: 1.1.2
    dev: true

  /call-bind@1.0.8:
    resolution: {integrity: sha512-oKlSFMcMwpUg2ednkhQ454wfWiU/ul3CkJe/PEHcTKuiX6RpbehUiFMXu13HalGZxfUwCQzZG747YXBn1im9ww==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-define-property: 1.0.1
      get-intrinsic: 1.3.0
      set-function-length: 1.2.2
    dev: true

  /call-bound@1.0.4:
    resolution: {integrity: sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind-apply-helpers: 1.0.2
      get-intrinsic: 1.3.0
    dev: true

  /callsites@3.1.0:
    resolution: {integrity: sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==}
    engines: {node: '>=6'}
    dev: true

  /camelcase-css@2.0.1:
    resolution: {integrity: sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==}
    engines: {node: '>= 6'}
    dev: true

  /caniuse-lite@1.0.30001690:
    resolution: {integrity: sha512-5ExiE3qQN6oF8Clf8ifIDcMRCRE/dMGcETG/XGMD8/XiXm6HXQgQTh1yZYLXXpSOsEUlJm1Xr7kGULZTuGtP/w==}

  /chalk@4.1.2:
    resolution: {integrity: sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==}
    engines: {node: '>=10'}
    dependencies:
      ansi-styles: 4.3.0
      supports-color: 7.2.0
    dev: true

  /chokidar@3.6.0:
    resolution: {integrity: sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==}
    engines: {node: '>= 8.10.0'}
    dependencies:
      anymatch: 3.1.3
      braces: 3.0.3
      glob-parent: 5.1.2
      is-binary-path: 2.1.0
      is-glob: 4.0.3
      normalize-path: 3.0.0
      readdirp: 3.6.0
    optionalDependencies:
      fsevents: 2.3.3
    dev: true

  /client-only@0.0.1:
    resolution: {integrity: sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==}
    dev: false

  /color-convert@2.0.1:
    resolution: {integrity: sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==}
    engines: {node: '>=7.0.0'}
    dependencies:
      color-name: 1.1.4

  /color-name@1.1.4:
    resolution: {integrity: sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==}
    requiresBuild: true

  /color-string@1.9.1:
    resolution: {integrity: sha512-shrVawQFojnZv6xM40anx4CkoDP+fZsw/ZerEMsW/pyzsRbElpsL/DBVW7q3ExxwusdNXI3lXpuhEZkzs8p5Eg==}
    requiresBuild: true
    dependencies:
      color-name: 1.1.4
      simple-swizzle: 0.2.2
    dev: false
    optional: true

  /color@4.2.3:
    resolution: {integrity: sha512-1rXeuUUiGGrykh+CeBdu5Ie7OJwinCgQY0bc7GCRxy5xVHy+moaqkpL/jqQq0MtQOeYcrqEz4abc5f0KtU7W4A==}
    engines: {node: '>=12.5.0'}
    requiresBuild: true
    dependencies:
      color-convert: 2.0.1
      color-string: 1.9.1
    dev: false
    optional: true

  /combined-stream@1.0.8:
    resolution: {integrity: sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==}
    engines: {node: '>= 0.8'}
    dependencies:
      delayed-stream: 1.0.0
    dev: false

  /commander@4.1.1:
    resolution: {integrity: sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==}
    engines: {node: '>= 6'}
    dev: true

  /concat-map@0.0.1:
    resolution: {integrity: sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==}
    dev: true

  /cross-spawn@7.0.6:
    resolution: {integrity: sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==}
    engines: {node: '>= 8'}
    dependencies:
      path-key: 3.1.1
      shebang-command: 2.0.0
      which: 2.0.2
    dev: true

  /cssesc@3.0.0:
    resolution: {integrity: sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==}
    engines: {node: '>=4'}
    hasBin: true
    dev: true

  /csstype@3.1.3:
    resolution: {integrity: sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==}

  /data-view-buffer@1.0.1:
    resolution: {integrity: sha512-0lht7OugA5x3iJLOWFhWK/5ehONdprk0ISXqVFn/NFrDu+cuc8iADFrGQz5BnRK7LLU3JmkbXSxaqX+/mXYtUA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      es-errors: 1.3.0
      is-data-view: 1.0.2
    dev: true

  /data-view-byte-length@1.0.1:
    resolution: {integrity: sha512-4J7wRJD3ABAzr8wP+OcIcqq2dlUKp4DVflx++hs5h5ZKydWMI6/D/fAot+yh6g2tHh8fLFTvNOaVN357NvSrOQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      es-errors: 1.3.0
      is-data-view: 1.0.2
    dev: true

  /data-view-byte-offset@1.0.1:
    resolution: {integrity: sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      is-data-view: 1.0.2
    dev: true

  /dayjs@1.11.13:
    resolution: {integrity: sha512-oaMBel6gjolK862uaPQOVTA7q3TZhuSvuMQAAglQDOWYO9A91IrAOUJEyKVlqJlHE0vq5p5UXxzdPfMH/x6xNg==}
    dev: false

  /debug@3.2.7:
    resolution: {integrity: sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true
    dependencies:
      ms: 2.1.3
    dev: true

  /debug@4.4.0:
    resolution: {integrity: sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true
    dependencies:
      ms: 2.1.3
    dev: true

  /deep-is@0.1.4:
    resolution: {integrity: sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==}
    dev: true

  /define-data-property@1.1.4:
    resolution: {integrity: sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==}
    engines: {node: '>= 0.4'}
    dependencies:
      es-define-property: 1.0.1
      es-errors: 1.3.0
      gopd: 1.2.0
    dev: true

  /define-properties@1.2.1:
    resolution: {integrity: sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==}
    engines: {node: '>= 0.4'}
    dependencies:
      define-data-property: 1.1.4
      has-property-descriptors: 1.0.2
      object-keys: 1.1.1
    dev: true

  /delayed-stream@1.0.0:
    resolution: {integrity: sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==}
    engines: {node: '>=0.4.0'}
    dev: false

  /detect-libc@2.0.3:
    resolution: {integrity: sha512-bwy0MGW55bG41VqxxypOsdSdGqLwXPI/focwgTYCFMbdUiBAxLg9CFzG08sz2aqzknwiX7Hkl0bQENjg8iLByw==}
    engines: {node: '>=8'}
    requiresBuild: true
    dev: false
    optional: true

  /detect-node-es@1.1.0:
    resolution: {integrity: sha512-ypdmJU/TbBby2Dxibuv7ZLW3Bs1QEmM7nHjEANfohJLvE0XVujisn1qPJcZxg+qDucsr+bP6fLD1rPS3AhJ7EQ==}
    dev: false

  /didyoumean@1.2.2:
    resolution: {integrity: sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==}
    dev: true

  /dlv@1.1.3:
    resolution: {integrity: sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==}
    dev: true

  /doctrine@2.1.0:
    resolution: {integrity: sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==}
    engines: {node: '>=0.10.0'}
    dependencies:
      esutils: 2.0.3
    dev: true

  /dunder-proto@1.0.1:
    resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-errors: 1.3.0
      gopd: 1.2.0
    dev: true

  /eastasianwidth@0.2.0:
    resolution: {integrity: sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==}
    dev: true

  /electron-to-chromium@1.5.75:
    resolution: {integrity: sha512-Lf3++DumRE/QmweGjU+ZcKqQ+3bKkU/qjaKYhIJKEOhgIO9Xs6IiAQFkfFoj+RhgDk4LUeNsLo6plExHqSyu6Q==}
    dev: true

  /emoji-regex@8.0.0:
    resolution: {integrity: sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==}
    dev: true

  /emoji-regex@9.2.2:
    resolution: {integrity: sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==}
    dev: true

  /es-abstract@1.23.6:
    resolution: {integrity: sha512-Ifco6n3yj2tMZDWNLyloZrytt9lqqlwvS83P3HtaETR0NUOYnIULGGHpktqYGObGy+8wc1okO25p8TjemhImvA==}
    engines: {node: '>= 0.4'}
    dependencies:
      array-buffer-byte-length: 1.0.1
      arraybuffer.prototype.slice: 1.0.4
      available-typed-arrays: 1.0.7
      call-bind: 1.0.8
      call-bound: 1.0.4
      data-view-buffer: 1.0.1
      data-view-byte-length: 1.0.1
      data-view-byte-offset: 1.0.1
      es-define-property: 1.0.1
      es-errors: 1.3.0
      es-object-atoms: 1.1.1
      es-set-tostringtag: 2.0.3
      es-to-primitive: 1.3.0
      function.prototype.name: 1.1.7
      get-intrinsic: 1.3.0
      get-symbol-description: 1.1.0
      globalthis: 1.0.4
      gopd: 1.2.0
      has-property-descriptors: 1.0.2
      has-proto: 1.2.0
      has-symbols: 1.1.0
      hasown: 2.0.2
      internal-slot: 1.1.0
      is-array-buffer: 3.0.5
      is-callable: 1.2.7
      is-data-view: 1.0.2
      is-negative-zero: 2.0.3
      is-regex: 1.2.1
      is-shared-array-buffer: 1.0.4
      is-string: 1.1.1
      is-typed-array: 1.1.15
      is-weakref: 1.1.0
      math-intrinsics: 1.1.0
      object-inspect: 1.13.3
      object-keys: 1.1.1
      object.assign: 4.1.7
      regexp.prototype.flags: 1.5.3
      safe-array-concat: 1.1.3
      safe-regex-test: 1.1.0
      string.prototype.trim: 1.2.10
      string.prototype.trimend: 1.0.9
      string.prototype.trimstart: 1.0.8
      typed-array-buffer: 1.0.3
      typed-array-byte-length: 1.0.3
      typed-array-byte-offset: 1.0.4
      typed-array-length: 1.0.7
      unbox-primitive: 1.1.0
      which-typed-array: 1.1.18
    dev: true

  /es-define-property@1.0.1:
    resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}
    engines: {node: '>= 0.4'}
    dev: true

  /es-errors@1.3.0:
    resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}
    engines: {node: '>= 0.4'}
    dev: true

  /es-iterator-helpers@1.2.1:
    resolution: {integrity: sha512-uDn+FE1yrDzyC0pCo961B2IHbdM8y/ACZsKD4dG6WqrjV53BADjwa7D+1aom2rsNVfLyDgU/eigvlJGJ08OQ4w==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-errors: 1.3.0
      es-set-tostringtag: 2.0.3
      function-bind: 1.1.2
      get-intrinsic: 1.3.0
      globalthis: 1.0.4
      gopd: 1.2.0
      has-property-descriptors: 1.0.2
      has-proto: 1.2.0
      has-symbols: 1.1.0
      internal-slot: 1.1.0
      iterator.prototype: 1.1.4
      safe-array-concat: 1.1.3
    dev: true

  /es-object-atoms@1.1.1:
    resolution: {integrity: sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==}
    engines: {node: '>= 0.4'}
    dependencies:
      es-errors: 1.3.0
    dev: true

  /es-set-tostringtag@2.0.3:
    resolution: {integrity: sha512-3T8uNMC3OQTHkFUsFq8r/BwAXLHvU/9O9mE0fBc/MY5iq/8H7ncvO947LmYA6ldWw9Uh8Yhf25zu6n7nML5QWQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      get-intrinsic: 1.3.0
      has-tostringtag: 1.0.2
      hasown: 2.0.2
    dev: true

  /es-shim-unscopables@1.0.2:
    resolution: {integrity: sha512-J3yBRXCzDu4ULnQwxyToo/OjdMx6akgVC7K6few0a7F/0wLtmKKN7I73AH5T2836UuXRqN7Qg+IIUw/+YJksRw==}
    dependencies:
      hasown: 2.0.2
    dev: true

  /es-to-primitive@1.3.0:
    resolution: {integrity: sha512-w+5mJ3GuFL+NjVtJlvydShqE1eN3h3PbI7/5LAsYJP/2qtuMXjfL2LpHSRqo4b4eSF5K/DH1JXKUAHSB2UW50g==}
    engines: {node: '>= 0.4'}
    dependencies:
      is-callable: 1.2.7
      is-date-object: 1.1.0
      is-symbol: 1.1.1
    dev: true

  /escalade@3.2.0:
    resolution: {integrity: sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==}
    engines: {node: '>=6'}
    dev: true

  /escape-string-regexp@4.0.0:
    resolution: {integrity: sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==}
    engines: {node: '>=10'}
    dev: true

  /eslint-config-prettier@10.1.2(eslint@9.25.1):
    resolution: {integrity: sha512-Epgp/EofAUeEpIdZkW60MHKvPyru1ruQJxPL+WIycnaPApuseK0Zpkrh/FwL9oIpQvIhJwV7ptOy0DWUjTlCiA==}
    hasBin: true
    peerDependencies:
      eslint: '>=7.0.0'
    dependencies:
      eslint: 9.25.1
    dev: true

  /eslint-import-resolver-node@0.3.9:
    resolution: {integrity: sha512-WFj2isz22JahUv+B788TlO3N6zL3nNJGU8CcZbPZvVEkBPaJdCV4vy5wyghty5ROFbCRnm132v8BScu5/1BQ8g==}
    dependencies:
      debug: 3.2.7
      is-core-module: 2.16.0
      resolve: 1.22.10
    transitivePeerDependencies:
      - supports-color
    dev: true

  /eslint-module-utils@2.12.0(@typescript-eslint/parser@8.31.0)(eslint-import-resolver-node@0.3.9)(eslint@9.25.1):
    resolution: {integrity: sha512-wALZ0HFoytlyh/1+4wuZ9FJCD/leWHQzzrxJ8+rebyReSLk7LApMyd3WJaLVoN+D5+WIdJyDK1c6JnE65V4Zyg==}
    engines: {node: '>=4'}
    peerDependencies:
      '@typescript-eslint/parser': '*'
      eslint: '*'
      eslint-import-resolver-node: '*'
      eslint-import-resolver-typescript: '*'
      eslint-import-resolver-webpack: '*'
    peerDependenciesMeta:
      '@typescript-eslint/parser':
        optional: true
      eslint:
        optional: true
      eslint-import-resolver-node:
        optional: true
      eslint-import-resolver-typescript:
        optional: true
      eslint-import-resolver-webpack:
        optional: true
    dependencies:
      '@typescript-eslint/parser': 8.31.0(eslint@9.25.1)(typescript@5.0.4)
      debug: 3.2.7
      eslint: 9.25.1
      eslint-import-resolver-node: 0.3.9
    transitivePeerDependencies:
      - supports-color
    dev: true

  /eslint-plugin-es@3.0.1(eslint@9.25.1):
    resolution: {integrity: sha512-GUmAsJaN4Fc7Gbtl8uOBlayo2DqhwWvEzykMHSCZHU3XdJ+NSzzZcVhXh3VxX5icqQ+oQdIEawXX8xkR3mIFmQ==}
    engines: {node: '>=8.10.0'}
    peerDependencies:
      eslint: '>=4.19.1'
    dependencies:
      eslint: 9.25.1
      eslint-utils: 2.1.0
      regexpp: 3.2.0
    dev: true

  /eslint-plugin-import@2.31.0(@typescript-eslint/parser@8.31.0)(eslint@9.25.1):
    resolution: {integrity: sha512-ixmkI62Rbc2/w8Vfxyh1jQRTdRTF52VxwRVHl/ykPAmqG+Nb7/kNn+byLP0LxPgI7zWA16Jt82SybJInmMia3A==}
    engines: {node: '>=4'}
    peerDependencies:
      '@typescript-eslint/parser': '*'
      eslint: ^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8 || ^9
    peerDependenciesMeta:
      '@typescript-eslint/parser':
        optional: true
    dependencies:
      '@rtsao/scc': 1.1.0
      '@typescript-eslint/parser': 8.31.0(eslint@9.25.1)(typescript@5.0.4)
      array-includes: 3.1.8
      array.prototype.findlastindex: 1.2.5
      array.prototype.flat: 1.3.3
      array.prototype.flatmap: 1.3.3
      debug: 3.2.7
      doctrine: 2.1.0
      eslint: 9.25.1
      eslint-import-resolver-node: 0.3.9
      eslint-module-utils: 2.12.0(@typescript-eslint/parser@8.31.0)(eslint-import-resolver-node@0.3.9)(eslint@9.25.1)
      hasown: 2.0.2
      is-core-module: 2.16.0
      is-glob: 4.0.3
      minimatch: 3.1.2
      object.fromentries: 2.0.8
      object.groupby: 1.0.3
      object.values: 1.2.1
      semver: 6.3.1
      string.prototype.trimend: 1.0.9
      tsconfig-paths: 3.15.0
    transitivePeerDependencies:
      - eslint-import-resolver-typescript
      - eslint-import-resolver-webpack
      - supports-color
    dev: true

  /eslint-plugin-node@11.1.0(eslint@9.25.1):
    resolution: {integrity: sha512-oUwtPJ1W0SKD0Tr+wqu92c5xuCeQqB3hSCHasn/ZgjFdA9iDGNkNf2Zi9ztY7X+hNuMib23LNGRm6+uN+KLE3g==}
    engines: {node: '>=8.10.0'}
    peerDependencies:
      eslint: '>=5.16.0'
    dependencies:
      eslint: 9.25.1
      eslint-plugin-es: 3.0.1(eslint@9.25.1)
      eslint-utils: 2.1.0
      ignore: 5.3.2
      minimatch: 3.1.2
      resolve: 1.22.10
      semver: 6.3.1
    dev: true

  /eslint-plugin-prettier@5.2.6(eslint-config-prettier@10.1.2)(eslint@9.25.1)(prettier@3.4.2):
    resolution: {integrity: sha512-mUcf7QG2Tjk7H055Jk0lGBjbgDnfrvqjhXh9t2xLMSCjZVcw9Rb1V6sVNXO0th3jgeO7zllWPTNRil3JW94TnQ==}
    engines: {node: ^14.18.0 || >=16.0.0}
    peerDependencies:
      '@types/eslint': '>=8.0.0'
      eslint: '>=8.0.0'
      eslint-config-prettier: '>= 7.0.0 <10.0.0 || >=10.1.0'
      prettier: '>=3.0.0'
    peerDependenciesMeta:
      '@types/eslint':
        optional: true
      eslint-config-prettier:
        optional: true
    dependencies:
      eslint: 9.25.1
      eslint-config-prettier: 10.1.2(eslint@9.25.1)
      prettier: 3.4.2
      prettier-linter-helpers: 1.0.0
      synckit: 0.11.4
    dev: true

  /eslint-plugin-react-hooks@5.2.0(eslint@9.25.1):
    resolution: {integrity: sha512-+f15FfK64YQwZdJNELETdn5ibXEUQmW1DZL6KXhNnc2heoy/sg9VJJeT7n8TlMWouzWqSWavFkIhHyIbIAEapg==}
    engines: {node: '>=10'}
    peerDependencies:
      eslint: ^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0
    dependencies:
      eslint: 9.25.1
    dev: true

  /eslint-plugin-react@7.37.5(eslint@9.25.1):
    resolution: {integrity: sha512-Qteup0SqU15kdocexFNAJMvCJEfa2xUKNV4CC1xsVMrIIqEy3SQ/rqyxCWNzfrd3/ldy6HMlD2e0JDVpDg2qIA==}
    engines: {node: '>=4'}
    peerDependencies:
      eslint: ^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7
    dependencies:
      array-includes: 3.1.8
      array.prototype.findlast: 1.2.5
      array.prototype.flatmap: 1.3.3
      array.prototype.tosorted: 1.1.4
      doctrine: 2.1.0
      es-iterator-helpers: 1.2.1
      eslint: 9.25.1
      estraverse: 5.3.0
      hasown: 2.0.2
      jsx-ast-utils: 3.3.5
      minimatch: 3.1.2
      object.entries: 1.1.9
      object.fromentries: 2.0.8
      object.values: 1.2.1
      prop-types: 15.8.1
      resolve: 2.0.0-next.5
      semver: 6.3.1
      string.prototype.matchall: 4.0.12
      string.prototype.repeat: 1.0.0
    dev: true

  /eslint-plugin-unused-imports@4.1.4(@typescript-eslint/eslint-plugin@8.31.0)(eslint@9.25.1):
    resolution: {integrity: sha512-YptD6IzQjDardkl0POxnnRBhU1OEePMV0nd6siHaRBbd+lyh6NAhFEobiznKU7kTsSsDeSD62Pe7kAM1b7dAZQ==}
    peerDependencies:
      '@typescript-eslint/eslint-plugin': ^8.0.0-0 || ^7.0.0 || ^6.0.0 || ^5.0.0
      eslint: ^9.0.0 || ^8.0.0
    peerDependenciesMeta:
      '@typescript-eslint/eslint-plugin':
        optional: true
    dependencies:
      '@typescript-eslint/eslint-plugin': 8.31.0(@typescript-eslint/parser@8.31.0)(eslint@9.25.1)(typescript@5.0.4)
      eslint: 9.25.1
    dev: true

  /eslint-scope@8.3.0:
    resolution: {integrity: sha512-pUNxi75F8MJ/GdeKtVLSbYg4ZI34J6C0C7sbL4YOp2exGwen7ZsuBqKzUhXd0qMQ362yET3z+uPwKeg/0C2XCQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      esrecurse: 4.3.0
      estraverse: 5.3.0
    dev: true

  /eslint-utils@2.1.0:
    resolution: {integrity: sha512-w94dQYoauyvlDc43XnGB8lU3Zt713vNChgt4EWwhXAP2XkBvndfxF0AgIqKOOasjPIPzj9JqgwkwbCYD0/V3Zg==}
    engines: {node: '>=6'}
    dependencies:
      eslint-visitor-keys: 1.3.0
    dev: true

  /eslint-visitor-keys@1.3.0:
    resolution: {integrity: sha512-6J72N8UNa462wa/KFODt/PJ3IU60SDpC3QXC1Hjc1BXXpfL2C9R5+AU7jhe0F6GREqVMh4Juu+NY7xn+6dipUQ==}
    engines: {node: '>=4'}
    dev: true

  /eslint-visitor-keys@3.4.3:
    resolution: {integrity: sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}
    dev: true

  /eslint-visitor-keys@4.2.0:
    resolution: {integrity: sha512-UyLnSehNt62FFhSwjZlHmeokpRK59rcz29j+F1/aDgbkbRTk7wIc9XzdoasMUbRNKDM0qQt/+BJ4BrpFeABemw==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dev: true

  /eslint@9.25.1:
    resolution: {integrity: sha512-E6Mtz9oGQWDCpV12319d59n4tx9zOTXSTmc8BLVxBx+G/0RdM5MvEEJLU9c0+aleoePYYgVTOsRblx433qmhWQ==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    hasBin: true
    peerDependencies:
      jiti: '*'
    peerDependenciesMeta:
      jiti:
        optional: true
    dependencies:
      '@eslint-community/eslint-utils': 4.4.1(eslint@9.25.1)
      '@eslint-community/regexpp': 4.12.1
      '@eslint/config-array': 0.20.0
      '@eslint/config-helpers': 0.2.1
      '@eslint/core': 0.13.0
      '@eslint/eslintrc': 3.3.1
      '@eslint/js': 9.25.1
      '@eslint/plugin-kit': 0.2.8
      '@humanfs/node': 0.16.6
      '@humanwhocodes/module-importer': 1.0.1
      '@humanwhocodes/retry': 0.4.2
      '@types/estree': 1.0.7
      '@types/json-schema': 7.0.15
      ajv: 6.12.6
      chalk: 4.1.2
      cross-spawn: 7.0.6
      debug: 4.4.0
      escape-string-regexp: 4.0.0
      eslint-scope: 8.3.0
      eslint-visitor-keys: 4.2.0
      espree: 10.3.0
      esquery: 1.6.0
      esutils: 2.0.3
      fast-deep-equal: 3.1.3
      file-entry-cache: 8.0.0
      find-up: 5.0.0
      glob-parent: 6.0.2
      ignore: 5.3.2
      imurmurhash: 0.1.4
      is-glob: 4.0.3
      json-stable-stringify-without-jsonify: 1.0.1
      lodash.merge: 4.6.2
      minimatch: 3.1.2
      natural-compare: 1.4.0
      optionator: 0.9.4
    transitivePeerDependencies:
      - supports-color
    dev: true

  /espree@10.3.0:
    resolution: {integrity: sha512-0QYC8b24HWY8zjRnDTL6RiHfDbAWn63qb4LMj1Z4b076A4une81+z03Kg7l7mn/48PUTqoLptSXez8oknU8Clg==}
    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}
    dependencies:
      acorn: 8.14.0
      acorn-jsx: 5.3.2(acorn@8.14.0)
      eslint-visitor-keys: 4.2.0
    dev: true

  /esquery@1.6.0:
    resolution: {integrity: sha512-ca9pw9fomFcKPvFLXhBKUK90ZvGibiGOvRJNbjljY7s7uq/5YO4BOzcYtJqExdx99rF6aAcnRxHmcUHcz6sQsg==}
    engines: {node: '>=0.10'}
    dependencies:
      estraverse: 5.3.0
    dev: true

  /esrecurse@4.3.0:
    resolution: {integrity: sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==}
    engines: {node: '>=4.0'}
    dependencies:
      estraverse: 5.3.0
    dev: true

  /estraverse@5.3.0:
    resolution: {integrity: sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==}
    engines: {node: '>=4.0'}
    dev: true

  /esutils@2.0.3:
    resolution: {integrity: sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==}
    engines: {node: '>=0.10.0'}
    dev: true

  /event-target-shim@5.0.1:
    resolution: {integrity: sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==}
    engines: {node: '>=6'}
    dev: false

  /events@3.3.0:
    resolution: {integrity: sha512-mQw+2fkQbALzQ7V0MY0IqdnXNOeTtP4r0lN9z7AAawCXgqea7bDii20AYrIBrFd/Hx0M2Ocz6S111CaFkUcb0Q==}
    engines: {node: '>=0.8.x'}
    dev: false

  /fast-deep-equal@3.1.3:
    resolution: {integrity: sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==}
    dev: true

  /fast-diff@1.3.0:
    resolution: {integrity: sha512-VxPP4NqbUjj6MaAOafWeUn2cXWLcCtljklUtZf0Ind4XQ+QPtmA0b18zZy0jIQx+ExRVCR/ZQpBmik5lXshNsw==}
    dev: true

  /fast-glob@3.3.1:
    resolution: {integrity: sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==}
    engines: {node: '>=8.6.0'}
    dependencies:
      '@nodelib/fs.stat': 2.0.5
      '@nodelib/fs.walk': 1.2.8
      glob-parent: 5.1.2
      merge2: 1.4.1
      micromatch: 4.0.8
    dev: true

  /fast-glob@3.3.2:
    resolution: {integrity: sha512-oX2ruAFQwf/Orj8m737Y5adxDQO0LAB7/S5MnxCdTNDd4p6BsyIVsv9JQsATbTSq8KHRpLwIHbVlUNatxd+1Ow==}
    engines: {node: '>=8.6.0'}
    dependencies:
      '@nodelib/fs.stat': 2.0.5
      '@nodelib/fs.walk': 1.2.8
      glob-parent: 5.1.2
      merge2: 1.4.1
      micromatch: 4.0.8
    dev: true

  /fast-json-stable-stringify@2.1.0:
    resolution: {integrity: sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==}
    dev: true

  /fast-levenshtein@2.0.6:
    resolution: {integrity: sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==}
    dev: true

  /fastq@1.17.1:
    resolution: {integrity: sha512-sRVD3lWVIXWg6By68ZN7vho9a1pQcN/WBFaAAsDDFzlJjvoGx0P8z7V1t72grFJfJhu3YPZBuu25f7Kaw2jN1w==}
    dependencies:
      reusify: 1.0.4
    dev: true

  /file-entry-cache@8.0.0:
    resolution: {integrity: sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==}
    engines: {node: '>=16.0.0'}
    dependencies:
      flat-cache: 4.0.1
    dev: true

  /fill-range@7.1.1:
    resolution: {integrity: sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==}
    engines: {node: '>=8'}
    dependencies:
      to-regex-range: 5.0.1
    dev: true

  /find-up@5.0.0:
    resolution: {integrity: sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==}
    engines: {node: '>=10'}
    dependencies:
      locate-path: 6.0.0
      path-exists: 4.0.0
    dev: true

  /flat-cache@4.0.1:
    resolution: {integrity: sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==}
    engines: {node: '>=16'}
    dependencies:
      flatted: 3.3.2
      keyv: 4.5.4
    dev: true

  /flatted@3.3.2:
    resolution: {integrity: sha512-AiwGJM8YcNOaobumgtng+6NHuOqC3A7MixFeDafM3X9cIUM+xUXoS5Vfgf+OihAYe20fxqNM9yPBXJzRtZ/4eA==}
    dev: true

  /for-each@0.3.3:
    resolution: {integrity: sha512-jqYfLp7mo9vIyQf8ykW2v7A+2N4QjeCeI5+Dz9XraiO1ign81wjiH7Fb9vSOWvQfNtmSa4H2RoQTrrXivdUZmw==}
    dependencies:
      is-callable: 1.2.7
    dev: true

  /foreground-child@3.3.0:
    resolution: {integrity: sha512-Ld2g8rrAyMYFXBhEqMz8ZAHBi4J4uS1i/CxGMDnjyFWddMXLVcDp051DZfu+t7+ab7Wv6SMqpWmyFIj5UbfFvg==}
    engines: {node: '>=14'}
    dependencies:
      cross-spawn: 7.0.6
      signal-exit: 4.1.0
    dev: true

  /form-data-encoder@1.7.2:
    resolution: {integrity: sha512-qfqtYan3rxrnCk1VYaA4H+Ms9xdpPqvLZa6xmMgFvhO32x7/3J/ExcTd6qpxM0vH2GdMI+poehyBZvqfMTto8A==}
    dev: false

  /form-data@4.0.1:
    resolution: {integrity: sha512-tzN8e4TX8+kkxGPK8D5u0FNmjPUjw3lwC9lSLxxoB/+GtsJG91CO8bSWy73APlgAZzZbXEYZJuxjkHH2w+Ezhw==}
    engines: {node: '>= 6'}
    dependencies:
      asynckit: 0.4.0
      combined-stream: 1.0.8
      mime-types: 2.1.35
    dev: false

  /formdata-node@4.4.1:
    resolution: {integrity: sha512-0iirZp3uVDjVGt9p49aTaqjk84TrglENEDuqfdlZQ1roC9CWlPk6Avf8EEnZNcAqPonwkG35x4n3ww/1THYAeQ==}
    engines: {node: '>= 12.20'}
    dependencies:
      node-domexception: 1.0.0
      web-streams-polyfill: 4.0.0-beta.3
    dev: false

  /fraction.js@4.3.7:
    resolution: {integrity: sha512-ZsDfxO51wGAXREY55a7la9LScWpwv9RxIrYABrlvOFBlH/ShPnrtsXeuUIfXKKOVicNxQ+o8JTbJvjS4M89yew==}
    dev: true

  /fsevents@2.3.3:
    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
    os: [darwin]
    requiresBuild: true
    dev: true
    optional: true

  /function-bind@1.1.2:
    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}
    dev: true

  /function.prototype.name@1.1.7:
    resolution: {integrity: sha512-2g4x+HqTJKM9zcJqBSpjoRmdcPFtJM60J3xJisTQSXBWka5XqyBN/2tNUgma1mztTXyDuUsEtYe5qcs7xYzYQA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      functions-have-names: 1.2.3
      hasown: 2.0.2
      is-callable: 1.2.7
    dev: true

  /functions-have-names@1.2.3:
    resolution: {integrity: sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==}
    dev: true

  /get-intrinsic@1.3.0:
    resolution: {integrity: sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-define-property: 1.0.1
      es-errors: 1.3.0
      es-object-atoms: 1.1.1
      function-bind: 1.1.2
      get-proto: 1.0.1
      gopd: 1.2.0
      has-symbols: 1.1.0
      hasown: 2.0.2
      math-intrinsics: 1.1.0
    dev: true

  /get-nonce@1.0.1:
    resolution: {integrity: sha512-FJhYRoDaiatfEkUK8HKlicmu/3SGFD51q3itKDGoSTysQJBnfOcxU5GxnhE1E6soB76MbT0MBtnKJuXyAx+96Q==}
    engines: {node: '>=6'}
    dev: false

  /get-proto@1.0.1:
    resolution: {integrity: sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==}
    engines: {node: '>= 0.4'}
    dependencies:
      dunder-proto: 1.0.1
      es-object-atoms: 1.1.1
    dev: true

  /get-symbol-description@1.1.0:
    resolution: {integrity: sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
    dev: true

  /glob-parent@5.1.2:
    resolution: {integrity: sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==}
    engines: {node: '>= 6'}
    dependencies:
      is-glob: 4.0.3
    dev: true

  /glob-parent@6.0.2:
    resolution: {integrity: sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==}
    engines: {node: '>=10.13.0'}
    dependencies:
      is-glob: 4.0.3
    dev: true

  /glob@10.4.5:
    resolution: {integrity: sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==}
    hasBin: true
    dependencies:
      foreground-child: 3.3.0
      jackspeak: 3.4.3
      minimatch: 9.0.5
      minipass: 7.1.2
      package-json-from-dist: 1.0.1
      path-scurry: 1.11.1
    dev: true

  /globals@14.0.0:
    resolution: {integrity: sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==}
    engines: {node: '>=18'}
    dev: true

  /globalthis@1.0.4:
    resolution: {integrity: sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      define-properties: 1.2.1
      gopd: 1.2.0
    dev: true

  /gopd@1.2.0:
    resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}
    engines: {node: '>= 0.4'}
    dev: true

  /graphemer@1.4.0:
    resolution: {integrity: sha512-EtKwoO6kxCL9WO5xipiHTZlSzBm7WLT627TqC/uVRd0HKmq8NXyebnNYxDoBi7wt8eTWrUrKXCOVaFq9x1kgag==}
    dev: true

  /has-bigints@1.1.0:
    resolution: {integrity: sha512-R3pbpkcIqv2Pm3dUwgjclDRVmWpTJW2DcMzcIhEXEx1oh/CEMObMm3KLmRJOdvhM7o4uQBnwr8pzRK2sJWIqfg==}
    engines: {node: '>= 0.4'}
    dev: true

  /has-flag@4.0.0:
    resolution: {integrity: sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==}
    engines: {node: '>=8'}
    dev: true

  /has-property-descriptors@1.0.2:
    resolution: {integrity: sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==}
    dependencies:
      es-define-property: 1.0.1
    dev: true

  /has-proto@1.2.0:
    resolution: {integrity: sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      dunder-proto: 1.0.1
    dev: true

  /has-symbols@1.1.0:
    resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}
    engines: {node: '>= 0.4'}
    dev: true

  /has-tostringtag@1.0.2:
    resolution: {integrity: sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==}
    engines: {node: '>= 0.4'}
    dependencies:
      has-symbols: 1.1.0
    dev: true

  /hasown@2.0.2:
    resolution: {integrity: sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      function-bind: 1.1.2
    dev: true

  /humanize-ms@1.2.1:
    resolution: {integrity: sha512-Fl70vYtsAFb/C06PTS9dZBo7ihau+Tu/DNCk/OyHhea07S+aeMWpFFkUaXRa8fI+ScZbEI8dfSxwY7gxZ9SAVQ==}
    dependencies:
      ms: 2.1.3
    dev: false

  /ignore@5.3.2:
    resolution: {integrity: sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==}
    engines: {node: '>= 4'}
    dev: true

  /import-fresh@3.3.0:
    resolution: {integrity: sha512-veYYhQa+D1QBKznvhUHxb8faxlrwUnxseDAbAp457E0wLNio2bOSKnjYDhMj+YiAq61xrMGhQk9iXVk5FzgQMw==}
    engines: {node: '>=6'}
    dependencies:
      parent-module: 1.0.1
      resolve-from: 4.0.0
    dev: true

  /imurmurhash@0.1.4:
    resolution: {integrity: sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==}
    engines: {node: '>=0.8.19'}
    dev: true

  /internal-slot@1.1.0:
    resolution: {integrity: sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==}
    engines: {node: '>= 0.4'}
    dependencies:
      es-errors: 1.3.0
      hasown: 2.0.2
      side-channel: 1.1.0
    dev: true

  /intersection-observer@0.12.2:
    resolution: {integrity: sha512-7m1vEcPCxXYI8HqnL8CKI6siDyD+eIWSwgB3DZA+ZTogxk9I4CDnj4wilt9x/+/QbHI4YG5YZNmC6458/e9Ktg==}
    dev: false

  /is-array-buffer@3.0.5:
    resolution: {integrity: sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      get-intrinsic: 1.3.0
    dev: true

  /is-arrayish@0.3.2:
    resolution: {integrity: sha512-eVRqCvVlZbuw3GrM63ovNSNAeA1K16kaR/LRY/92w0zxQ5/1YzwblUX652i4Xs9RwAGjW9d9y6X88t8OaAJfWQ==}
    requiresBuild: true
    dev: false
    optional: true

  /is-async-function@2.0.0:
    resolution: {integrity: sha512-Y1JXKrfykRJGdlDwdKlLpLyMIiWqWvuSd17TvZk68PLAOGOoF4Xyav1z0Xhoi+gCYjZVeC5SI+hYFOfvXmGRCA==}
    engines: {node: '>= 0.4'}
    dependencies:
      has-tostringtag: 1.0.2
    dev: true

  /is-bigint@1.1.0:
    resolution: {integrity: sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      has-bigints: 1.1.0
    dev: true

  /is-binary-path@2.1.0:
    resolution: {integrity: sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==}
    engines: {node: '>=8'}
    dependencies:
      binary-extensions: 2.3.0
    dev: true

  /is-boolean-object@1.2.1:
    resolution: {integrity: sha512-l9qO6eFlUETHtuihLcYOaLKByJ1f+N4kthcU9YjHy3N+B3hWv0y/2Nd0mu/7lTFnRQHTrSdXF50HQ3bl5fEnng==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      has-tostringtag: 1.0.2
    dev: true

  /is-callable@1.2.7:
    resolution: {integrity: sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==}
    engines: {node: '>= 0.4'}
    dev: true

  /is-core-module@2.16.0:
    resolution: {integrity: sha512-urTSINYfAYgcbLb0yDQ6egFm6h3Mo1DcF9EkyXSRjjzdHbsulg01qhwWuXdOoUBuTkbQ80KDboXa0vFJ+BDH+g==}
    engines: {node: '>= 0.4'}
    dependencies:
      hasown: 2.0.2
    dev: true

  /is-data-view@1.0.2:
    resolution: {integrity: sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      get-intrinsic: 1.3.0
      is-typed-array: 1.1.15
    dev: true

  /is-date-object@1.1.0:
    resolution: {integrity: sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      has-tostringtag: 1.0.2
    dev: true

  /is-extglob@2.1.1:
    resolution: {integrity: sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==}
    engines: {node: '>=0.10.0'}
    dev: true

  /is-finalizationregistry@1.1.1:
    resolution: {integrity: sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
    dev: true

  /is-fullwidth-code-point@3.0.0:
    resolution: {integrity: sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==}
    engines: {node: '>=8'}
    dev: true

  /is-generator-function@1.0.10:
    resolution: {integrity: sha512-jsEjy9l3yiXEQ+PsXdmBwEPcOxaXWLspKdplFUVI9vq1iZgIekeC0L167qeu86czQaxed3q/Uzuw0swL0irL8A==}
    engines: {node: '>= 0.4'}
    dependencies:
      has-tostringtag: 1.0.2
    dev: true

  /is-glob@4.0.3:
    resolution: {integrity: sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==}
    engines: {node: '>=0.10.0'}
    dependencies:
      is-extglob: 2.1.1
    dev: true

  /is-map@2.0.3:
    resolution: {integrity: sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==}
    engines: {node: '>= 0.4'}
    dev: true

  /is-negative-zero@2.0.3:
    resolution: {integrity: sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==}
    engines: {node: '>= 0.4'}
    dev: true

  /is-number-object@1.1.1:
    resolution: {integrity: sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      has-tostringtag: 1.0.2
    dev: true

  /is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}
    engines: {node: '>=0.12.0'}
    dev: true

  /is-regex@1.2.1:
    resolution: {integrity: sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      gopd: 1.2.0
      has-tostringtag: 1.0.2
      hasown: 2.0.2
    dev: true

  /is-set@2.0.3:
    resolution: {integrity: sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==}
    engines: {node: '>= 0.4'}
    dev: true

  /is-shared-array-buffer@1.0.4:
    resolution: {integrity: sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
    dev: true

  /is-string@1.1.1:
    resolution: {integrity: sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      has-tostringtag: 1.0.2
    dev: true

  /is-symbol@1.1.1:
    resolution: {integrity: sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      has-symbols: 1.1.0
      safe-regex-test: 1.1.0
    dev: true

  /is-typed-array@1.1.15:
    resolution: {integrity: sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      which-typed-array: 1.1.18
    dev: true

  /is-weakmap@2.0.2:
    resolution: {integrity: sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==}
    engines: {node: '>= 0.4'}
    dev: true

  /is-weakref@1.1.0:
    resolution: {integrity: sha512-SXM8Nwyys6nT5WP6pltOwKytLV7FqQ4UiibxVmW+EIosHcmCqkkjViTb5SNssDlkCiEYRP1/pdWUKVvZBmsR2Q==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
    dev: true

  /is-weakset@2.0.4:
    resolution: {integrity: sha512-mfcwb6IzQyOKTs84CQMrOwW4gQcaTOAWJ0zzJCl2WSPDrWk/OzDaImWFH3djXhb24g4eudZfLRozAvPGw4d9hQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      get-intrinsic: 1.3.0
    dev: true

  /isarray@2.0.5:
    resolution: {integrity: sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==}
    dev: true

  /isexe@2.0.0:
    resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}
    dev: true

  /iterator.prototype@1.1.4:
    resolution: {integrity: sha512-x4WH0BWmrMmg4oHHl+duwubhrvczGlyuGAZu3nvrf0UXOfPu8IhZObFEr7DE/iv01YgVZrsOiRcqw2srkKEDIA==}
    engines: {node: '>= 0.4'}
    dependencies:
      define-data-property: 1.1.4
      es-object-atoms: 1.1.1
      get-intrinsic: 1.3.0
      has-symbols: 1.1.0
      reflect.getprototypeof: 1.0.9
      set-function-name: 2.0.2
    dev: true

  /jackspeak@3.4.3:
    resolution: {integrity: sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==}
    dependencies:
      '@isaacs/cliui': 8.0.2
    optionalDependencies:
      '@pkgjs/parseargs': 0.11.0
    dev: true

  /jiti@1.21.7:
    resolution: {integrity: sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==}
    hasBin: true
    dev: true

  /js-cookie@3.0.5:
    resolution: {integrity: sha512-cEiJEAEoIbWfCZYKWhVwFuvPX1gETRYPw6LlaTKoxD3s2AkXzkCjnp6h0V77ozyqj0jakteJ4YqDJT830+lVGw==}
    engines: {node: '>=14'}
    dev: false

  /js-tokens@4.0.0:
    resolution: {integrity: sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==}
    dev: true

  /js-yaml@4.1.0:
    resolution: {integrity: sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==}
    hasBin: true
    dependencies:
      argparse: 2.0.1
    dev: true

  /json-buffer@3.0.1:
    resolution: {integrity: sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==}
    dev: true

  /json-schema-traverse@0.4.1:
    resolution: {integrity: sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==}
    dev: true

  /json-stable-stringify-without-jsonify@1.0.1:
    resolution: {integrity: sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==}
    dev: true

  /json5@1.0.2:
    resolution: {integrity: sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==}
    hasBin: true
    dependencies:
      minimist: 1.2.8
    dev: true

  /jsx-ast-utils@3.3.5:
    resolution: {integrity: sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==}
    engines: {node: '>=4.0'}
    dependencies:
      array-includes: 3.1.8
      array.prototype.flat: 1.3.3
      object.assign: 4.1.7
      object.values: 1.2.1
    dev: true

  /keyv@4.5.4:
    resolution: {integrity: sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==}
    dependencies:
      json-buffer: 3.0.1
    dev: true

  /levn@0.4.1:
    resolution: {integrity: sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==}
    engines: {node: '>= 0.8.0'}
    dependencies:
      prelude-ls: 1.2.1
      type-check: 0.4.0
    dev: true

  /lilconfig@3.1.3:
    resolution: {integrity: sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==}
    engines: {node: '>=14'}
    dev: true

  /lines-and-columns@1.2.4:
    resolution: {integrity: sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==}
    dev: true

  /livekit-client@2.7.5:
    resolution: {integrity: sha512-sPhHYwXvG75y1LDC50dDC9k6Z49L2vc/HcMRhzhi7yBca6ofPEebpB0bmPOry4ovrnFA+a8TL1pFR2mko1/clw==}
    dependencies:
      '@livekit/mutex': 1.0.0
      '@livekit/protocol': 1.29.4
      events: 3.3.0
      loglevel: 1.9.2
      sdp-transform: 2.15.0
      ts-debounce: 4.0.0
      tslib: 2.7.0
      typed-emitter: 2.1.0
      webrtc-adapter: 9.0.1
    dev: false

  /locate-path@6.0.0:
    resolution: {integrity: sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==}
    engines: {node: '>=10'}
    dependencies:
      p-locate: 5.0.0
    dev: true

  /lodash.merge@4.6.2:
    resolution: {integrity: sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==}
    dev: true

  /lodash@4.17.21:
    resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}
    dev: false

  /loglevel@1.9.2:
    resolution: {integrity: sha512-HgMmCqIJSAKqo68l0rS2AanEWfkxaZ5wNiEFb5ggm08lDs9Xl2KxBlX3PTcaD2chBM1gXAYf491/M2Rv8Jwayg==}
    engines: {node: '>= 0.6.0'}
    dev: false

  /long@5.2.3:
    resolution: {integrity: sha512-lcHwpNoggQTObv5apGNCTdJrO69eHOZMi4BNC+rTLER8iHAqGrUVeLh/irVIM7zTw2bOXA8T6uNPeujwOLg/2Q==}
    dev: false

  /loose-envify@1.4.0:
    resolution: {integrity: sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==}
    hasBin: true
    dependencies:
      js-tokens: 4.0.0
    dev: true

  /lru-cache@10.4.3:
    resolution: {integrity: sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==}
    dev: true

  /math-intrinsics@1.1.0:
    resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}
    engines: {node: '>= 0.4'}
    dev: true

  /merge2@1.4.1:
    resolution: {integrity: sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==}
    engines: {node: '>= 8'}
    dev: true

  /micromatch@4.0.8:
    resolution: {integrity: sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==}
    engines: {node: '>=8.6'}
    dependencies:
      braces: 3.0.3
      picomatch: 2.3.1
    dev: true

  /mime-db@1.52.0:
    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}
    engines: {node: '>= 0.6'}
    dev: false

  /mime-types@2.1.35:
    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}
    engines: {node: '>= 0.6'}
    dependencies:
      mime-db: 1.52.0
    dev: false

  /minimatch@3.1.2:
    resolution: {integrity: sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==}
    dependencies:
      brace-expansion: 1.1.11
    dev: true

  /minimatch@9.0.5:
    resolution: {integrity: sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==}
    engines: {node: '>=16 || 14 >=14.17'}
    dependencies:
      brace-expansion: 2.0.1
    dev: true

  /minimist@1.2.8:
    resolution: {integrity: sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==}
    dev: true

  /minipass@7.1.2:
    resolution: {integrity: sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==}
    engines: {node: '>=16 || 14 >=14.17'}
    dev: true

  /ms@2.1.3:
    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}

  /mz@2.7.0:
    resolution: {integrity: sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==}
    dependencies:
      any-promise: 1.3.0
      object-assign: 4.1.1
      thenify-all: 1.6.0
    dev: true

  /nanoid@3.3.8:
    resolution: {integrity: sha512-WNLf5Sd8oZxOm+TzppcYk8gVOgP+l58xNy58D0nbUnOxOWRWvlcCV4kUF7ltmI6PsrLl/BgKEyS4mqsGChFN0w==}
    engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}
    hasBin: true

  /natural-compare@1.4.0:
    resolution: {integrity: sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==}
    dev: true

  /next@15.3.0(react-dom@19.1.0)(react@19.1.0):
    resolution: {integrity: sha512-k0MgP6BsK8cZ73wRjMazl2y2UcXj49ZXLDEgx6BikWuby/CN+nh81qFFI16edgd7xYpe/jj2OZEIwCoqnzz0bQ==}
    engines: {node: ^18.18.0 || ^19.8.0 || >= 20.0.0}
    hasBin: true
    peerDependencies:
      '@opentelemetry/api': ^1.1.0
      '@playwright/test': ^1.41.2
      babel-plugin-react-compiler: '*'
      react: ^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0
      react-dom: ^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0
      sass: ^1.3.0
    peerDependenciesMeta:
      '@opentelemetry/api':
        optional: true
      '@playwright/test':
        optional: true
      babel-plugin-react-compiler:
        optional: true
      sass:
        optional: true
    dependencies:
      '@next/env': 15.3.0
      '@swc/counter': 0.1.3
      '@swc/helpers': 0.5.15
      busboy: 1.6.0
      caniuse-lite: 1.0.30001690
      postcss: 8.4.31
      react: 19.1.0
      react-dom: 19.1.0(react@19.1.0)
      styled-jsx: 5.1.6(react@19.1.0)
    optionalDependencies:
      '@next/swc-darwin-arm64': 15.3.0
      '@next/swc-darwin-x64': 15.3.0
      '@next/swc-linux-arm64-gnu': 15.3.0
      '@next/swc-linux-arm64-musl': 15.3.0
      '@next/swc-linux-x64-gnu': 15.3.0
      '@next/swc-linux-x64-musl': 15.3.0
      '@next/swc-win32-arm64-msvc': 15.3.0
      '@next/swc-win32-x64-msvc': 15.3.0
      sharp: 0.34.1
    transitivePeerDependencies:
      - '@babel/core'
      - babel-plugin-macros
    dev: false

  /node-domexception@1.0.0:
    resolution: {integrity: sha512-/jKZoMpw0F8GRwl4/eLROPA3cfcXtLApP0QzLmUT/HuPCZWyB7IY9ZrMeKw2O/nFIqPQB3PVM9aYm0F312AXDQ==}
    engines: {node: '>=10.5.0'}
    dev: false

  /node-fetch@2.7.0:
    resolution: {integrity: sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==}
    engines: {node: 4.x || >=6.0.0}
    peerDependencies:
      encoding: ^0.1.0
    peerDependenciesMeta:
      encoding:
        optional: true
    dependencies:
      whatwg-url: 5.0.0
    dev: false

  /node-releases@2.0.19:
    resolution: {integrity: sha512-xxOWJsBKtzAq7DY0J+DTzuz58K8e7sJbdgwkbMWQe8UYB6ekmsQ45q0M/tJDsGaZmbC+l7n57UV8Hl5tHxO9uw==}
    dev: true

  /normalize-path@3.0.0:
    resolution: {integrity: sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==}
    engines: {node: '>=0.10.0'}
    dev: true

  /normalize-range@0.1.2:
    resolution: {integrity: sha512-bdok/XvKII3nUpklnV6P2hxtMNrCboOjAcyBuQnWEhO665FwrSNRxU+AqpsyvO6LgGYPspN+lu5CLtw4jPRKNA==}
    engines: {node: '>=0.10.0'}
    dev: true

  /object-assign@4.1.1:
    resolution: {integrity: sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==}
    engines: {node: '>=0.10.0'}
    dev: true

  /object-hash@3.0.0:
    resolution: {integrity: sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==}
    engines: {node: '>= 6'}
    dev: true

  /object-inspect@1.13.3:
    resolution: {integrity: sha512-kDCGIbxkDSXE3euJZZXzc6to7fCrKHNI/hSRQnRuQ+BWjFNzZwiFF8fj/6o2t2G9/jTj8PSIYTfCLelLZEeRpA==}
    engines: {node: '>= 0.4'}
    dev: true

  /object-keys@1.1.1:
    resolution: {integrity: sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==}
    engines: {node: '>= 0.4'}
    dev: true

  /object.assign@4.1.7:
    resolution: {integrity: sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      define-properties: 1.2.1
      es-object-atoms: 1.1.1
      has-symbols: 1.1.0
      object-keys: 1.1.1
    dev: true

  /object.entries@1.1.9:
    resolution: {integrity: sha512-8u/hfXFRBD1O0hPUjioLhoWFHRmt6tKA4/vZPyckBr18l1KE9uHrFaFaUi8MDRTpi4uak2goyPTSNJLXX2k2Hw==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      define-properties: 1.2.1
      es-object-atoms: 1.1.1
    dev: true

  /object.fromentries@2.0.8:
    resolution: {integrity: sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-object-atoms: 1.1.1
    dev: true

  /object.groupby@1.0.3:
    resolution: {integrity: sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-abstract: 1.23.6
    dev: true

  /object.values@1.2.1:
    resolution: {integrity: sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      define-properties: 1.2.1
      es-object-atoms: 1.1.1
    dev: true

  /openai@4.52.1:
    resolution: {integrity: sha512-kv2hevAWZZ3I/vd2t8znGO2rd8wkowncsfcYpo8i+wU9ML+JEcdqiViANXXjWWGjIhajFNixE6gOY1fEgqILAg==}
    hasBin: true
    dependencies:
      '@types/node': 18.19.68
      '@types/node-fetch': 2.6.12
      abort-controller: 3.0.0
      agentkeepalive: 4.5.0
      form-data-encoder: 1.7.2
      formdata-node: 4.4.1
      node-fetch: 2.7.0
      web-streams-polyfill: 3.3.3
    transitivePeerDependencies:
      - encoding
    dev: false

  /optionator@0.9.4:
    resolution: {integrity: sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==}
    engines: {node: '>= 0.8.0'}
    dependencies:
      deep-is: 0.1.4
      fast-levenshtein: 2.0.6
      levn: 0.4.1
      prelude-ls: 1.2.1
      type-check: 0.4.0
      word-wrap: 1.2.5
    dev: true

  /p-limit@3.1.0:
    resolution: {integrity: sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==}
    engines: {node: '>=10'}
    dependencies:
      yocto-queue: 0.1.0
    dev: true

  /p-locate@5.0.0:
    resolution: {integrity: sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==}
    engines: {node: '>=10'}
    dependencies:
      p-limit: 3.1.0
    dev: true

  /package-json-from-dist@1.0.1:
    resolution: {integrity: sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==}
    dev: true

  /parent-module@1.0.1:
    resolution: {integrity: sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==}
    engines: {node: '>=6'}
    dependencies:
      callsites: 3.1.0
    dev: true

  /path-exists@4.0.0:
    resolution: {integrity: sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==}
    engines: {node: '>=8'}
    dev: true

  /path-key@3.1.1:
    resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}
    engines: {node: '>=8'}
    dev: true

  /path-parse@1.0.7:
    resolution: {integrity: sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==}
    dev: true

  /path-scurry@1.11.1:
    resolution: {integrity: sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==}
    engines: {node: '>=16 || 14 >=14.18'}
    dependencies:
      lru-cache: 10.4.3
      minipass: 7.1.2
    dev: true

  /picocolors@1.1.1:
    resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}

  /picomatch@2.3.1:
    resolution: {integrity: sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==}
    engines: {node: '>=8.6'}
    dev: true

  /pify@2.3.0:
    resolution: {integrity: sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==}
    engines: {node: '>=0.10.0'}
    dev: true

  /pirates@4.0.6:
    resolution: {integrity: sha512-saLsH7WeYYPiD25LDuLRRY/i+6HaPYr6G1OUlN39otzkSTxKnubR9RTxS3/Kk50s1g2JTgFwWQDQyplC5/SHZg==}
    engines: {node: '>= 6'}
    dev: true

  /possible-typed-array-names@1.0.0:
    resolution: {integrity: sha512-d7Uw+eZoloe0EHDIYoe+bQ5WXnGMOpmiZFTuMWCwpjzzkL2nTjcKiAk4hh8TjnGye2TwWOk3UXucZ+3rbmBa8Q==}
    engines: {node: '>= 0.4'}
    dev: true

  /postcss-import@15.1.0(postcss@8.4.49):
    resolution: {integrity: sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==}
    engines: {node: '>=14.0.0'}
    peerDependencies:
      postcss: ^8.0.0
    dependencies:
      postcss: 8.4.49
      postcss-value-parser: 4.2.0
      read-cache: 1.0.0
      resolve: 1.22.10
    dev: true

  /postcss-js@4.0.1(postcss@8.4.49):
    resolution: {integrity: sha512-dDLF8pEO191hJMtlHFPRa8xsizHaM82MLfNkUHdUtVEV3tgTp5oj+8qbEqYM57SLfc74KSbw//4SeJma2LRVIw==}
    engines: {node: ^12 || ^14 || >= 16}
    peerDependencies:
      postcss: ^8.4.21
    dependencies:
      camelcase-css: 2.0.1
      postcss: 8.4.49
    dev: true

  /postcss-load-config@4.0.2(postcss@8.4.49):
    resolution: {integrity: sha512-bSVhyJGL00wMVoPUzAVAnbEoWyqRxkjv64tUl427SKnPrENtq6hJwUojroMz2VB+Q1edmi4IfrAPpami5VVgMQ==}
    engines: {node: '>= 14'}
    peerDependencies:
      postcss: '>=8.0.9'
      ts-node: '>=9.0.0'
    peerDependenciesMeta:
      postcss:
        optional: true
      ts-node:
        optional: true
    dependencies:
      lilconfig: 3.1.3
      postcss: 8.4.49
      yaml: 2.6.1
    dev: true

  /postcss-nested@6.2.0(postcss@8.4.49):
    resolution: {integrity: sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==}
    engines: {node: '>=12.0'}
    peerDependencies:
      postcss: ^8.2.14
    dependencies:
      postcss: 8.4.49
      postcss-selector-parser: 6.1.2
    dev: true

  /postcss-selector-parser@6.1.2:
    resolution: {integrity: sha512-Q8qQfPiZ+THO/3ZrOrO0cJJKfpYCagtMUkXbnEfmgUjwXg6z/WBeOyS9APBBPCTSiDV+s4SwQGu8yFsiMRIudg==}
    engines: {node: '>=4'}
    dependencies:
      cssesc: 3.0.0
      util-deprecate: 1.0.2
    dev: true

  /postcss-value-parser@4.2.0:
    resolution: {integrity: sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==}
    dev: true

  /postcss@8.4.31:
    resolution: {integrity: sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==}
    engines: {node: ^10 || ^12 || >=14}
    dependencies:
      nanoid: 3.3.8
      picocolors: 1.1.1
      source-map-js: 1.2.1
    dev: false

  /postcss@8.4.38:
    resolution: {integrity: sha512-Wglpdk03BSfXkHoQa3b/oulrotAkwrlLDRSOb9D0bN86FdRyE9lppSp33aHNPgBa0JKCoB+drFLZkQoRRYae5A==}
    engines: {node: ^10 || ^12 || >=14}
    dependencies:
      nanoid: 3.3.8
      picocolors: 1.1.1
      source-map-js: 1.2.1
    dev: true

  /postcss@8.4.49:
    resolution: {integrity: sha512-OCVPnIObs4N29kxTjzLfUryOkvZEq+pf8jTF0lg8E7uETuWHA+v7j3c/xJmiqpX450191LlmZfUKkXxkTry7nA==}
    engines: {node: ^10 || ^12 || >=14}
    dependencies:
      nanoid: 3.3.8
      picocolors: 1.1.1
      source-map-js: 1.2.1
    dev: true

  /prelude-ls@1.2.1:
    resolution: {integrity: sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==}
    engines: {node: '>= 0.8.0'}
    dev: true

  /prettier-linter-helpers@1.0.0:
    resolution: {integrity: sha512-GbK2cP9nraSSUF9N2XwUwqfzlAFlMNYYl+ShE/V+H8a9uNl/oUqB1w2EL54Jh0OlyRSd8RfWYJ3coVS4TROP2w==}
    engines: {node: '>=6.0.0'}
    dependencies:
      fast-diff: 1.3.0
    dev: true

  /prettier@3.4.2:
    resolution: {integrity: sha512-e9MewbtFo+Fevyuxn/4rrcDAaq0IYxPGLvObpQjiZBMAzB9IGmzlnG9RZy3FFas+eBMu2vA0CszMeduow5dIuQ==}
    engines: {node: '>=14'}
    hasBin: true
    dev: true

  /prop-types@15.8.1:
    resolution: {integrity: sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==}
    dependencies:
      loose-envify: 1.4.0
      object-assign: 4.1.1
      react-is: 16.13.1
    dev: true

  /protobufjs@7.4.0:
    resolution: {integrity: sha512-mRUWCc3KUU4w1jU8sGxICXH/gNS94DvI1gxqDvBzhj1JpcsimQkYiOJfwsPUykUI5ZaspFbSgmBLER8IrQ3tqw==}
    engines: {node: '>=12.0.0'}
    requiresBuild: true
    dependencies:
      '@protobufjs/aspromise': 1.1.2
      '@protobufjs/base64': 1.1.2
      '@protobufjs/codegen': 2.0.4
      '@protobufjs/eventemitter': 1.1.0
      '@protobufjs/fetch': 1.1.0
      '@protobufjs/float': 1.0.2
      '@protobufjs/inquire': 1.1.0
      '@protobufjs/path': 1.1.2
      '@protobufjs/pool': 1.1.0
      '@protobufjs/utf8': 1.1.0
      '@types/node': 20.5.7
      long: 5.2.3
    dev: false

  /punycode@2.3.1:
    resolution: {integrity: sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==}
    engines: {node: '>=6'}
    dev: true

  /queue-microtask@1.2.3:
    resolution: {integrity: sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==}
    dev: true

  /react-dom@19.1.0(react@19.1.0):
    resolution: {integrity: sha512-Xs1hdnE+DyKgeHJeJznQmYMIBG3TKIHJJT95Q58nHLSrElKlGQqDTR2HQ9fx5CN/Gk6Vh/kupBTDLU11/nDk/g==}
    peerDependencies:
      react: ^19.1.0
    dependencies:
      react: 19.1.0
      scheduler: 0.26.0
    dev: false

  /react-fast-compare@3.2.2:
    resolution: {integrity: sha512-nsO+KSNgo1SbJqJEYRE9ERzo7YtYbou/OqjSQKxV7jcKox7+usiUVZOAC+XnDOABXggQTno0Y1CpVnuWEc1boQ==}
    dev: false

  /react-is@16.13.1:
    resolution: {integrity: sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==}
    dev: true

  /react-remove-scroll-bar@2.3.8(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-9r+yi9+mgU33AKcj6IbT9oRCO78WriSj6t/cF8DWBZJ9aOGPOTEDvdUDz1FwKim7QXWwmHqtdHnRJfhAxEG46Q==}
    engines: {node: '>=10'}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
      react-style-singleton: 2.2.3(@types/react@19.0.1)(react@19.1.0)
      tslib: 2.8.1
    dev: false

  /react-remove-scroll@2.6.3(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-pnAi91oOk8g8ABQKGF5/M9qxmmOPxaAnopyTHYfqYEwJhyFrbbBtHuSgtKEoH0jpcxx5o3hXqH1mNd9/Oi+8iQ==}
    engines: {node: '>=10'}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
      react-remove-scroll-bar: 2.3.8(@types/react@19.0.1)(react@19.1.0)
      react-style-singleton: 2.2.3(@types/react@19.0.1)(react@19.1.0)
      tslib: 2.8.1
      use-callback-ref: 1.3.3(@types/react@19.0.1)(react@19.1.0)
      use-sidecar: 1.1.3(@types/react@19.0.1)(react@19.1.0)
    dev: false

  /react-style-singleton@2.2.3(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-b6jSvxvVnyptAiLjbkWLE/lOnR4lfTtDAl+eUC7RZy+QQWc6wRzIV2CE6xBuMmDxc2qIihtDCZD5NPOFl7fRBQ==}
    engines: {node: '>=10'}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      get-nonce: 1.0.1
      react: 19.1.0
      tslib: 2.8.1
    dev: false

  /react@19.1.0:
    resolution: {integrity: sha512-FS+XFBNvn3GTAWq26joslQgWNoFu08F4kl0J4CgdNKADkdSGXQyTCnKteIAJy96Br6YbpEU1LSzV5dYtjMkMDg==}
    engines: {node: '>=0.10.0'}
    dev: false

  /read-cache@1.0.0:
    resolution: {integrity: sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==}
    dependencies:
      pify: 2.3.0
    dev: true

  /readdirp@3.6.0:
    resolution: {integrity: sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==}
    engines: {node: '>=8.10.0'}
    dependencies:
      picomatch: 2.3.1
    dev: true

  /reflect.getprototypeof@1.0.9:
    resolution: {integrity: sha512-r0Ay04Snci87djAsI4U+WNRcSw5S4pOH7qFjd/veA5gC7TbqESR3tcj28ia95L/fYUDw11JKP7uqUKUAfVvV5Q==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      dunder-proto: 1.0.1
      es-abstract: 1.23.6
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      gopd: 1.2.0
      which-builtin-type: 1.2.1
    dev: true

  /regenerator-runtime@0.14.1:
    resolution: {integrity: sha512-dYnhHh0nJoMfnkZs6GmmhFknAGRrLznOu5nc9ML+EJxGvrx6H7teuevqVqCuPcPK//3eDrrjQhehXVx9cnkGdw==}
    dev: false

  /regexp.prototype.flags@1.5.3:
    resolution: {integrity: sha512-vqlC04+RQoFalODCbCumG2xIOvapzVMHwsyIGM/SIE8fRhFFsXeH8/QQ+s0T0kDAhKc4k30s73/0ydkHQz6HlQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-errors: 1.3.0
      set-function-name: 2.0.2
    dev: true

  /regexpp@3.2.0:
    resolution: {integrity: sha512-pq2bWo9mVD43nbts2wGv17XLiNLya+GklZ8kaDLV2Z08gDCsGpnKn9BFMepvWuHCbyVvY7J5o5+BVvoQbmlJLg==}
    engines: {node: '>=8'}
    dev: true

  /resize-observer-polyfill@1.5.1:
    resolution: {integrity: sha512-LwZrotdHOo12nQuZlHEmtuXdqGoOD0OhaxopaNFxWzInpEgaLWoVuAMbTzixuosCx2nEG58ngzW3vxdWoxIgdg==}
    dev: false

  /resolve-from@4.0.0:
    resolution: {integrity: sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==}
    engines: {node: '>=4'}
    dev: true

  /resolve@1.22.10:
    resolution: {integrity: sha512-NPRy+/ncIMeDlTAsuqwKIiferiawhefFJtkNSW0qZJEqMEb+qBt/77B/jGeeek+F0uOeN05CDa6HXbbIgtVX4w==}
    engines: {node: '>= 0.4'}
    hasBin: true
    dependencies:
      is-core-module: 2.16.0
      path-parse: 1.0.7
      supports-preserve-symlinks-flag: 1.0.0
    dev: true

  /resolve@2.0.0-next.5:
    resolution: {integrity: sha512-U7WjGVG9sH8tvjW5SmGbQuui75FiyjAX72HX15DwBBwF9dNiQZRQAg9nnPhYy+TUnE0+VcrttuvNI8oSxZcocA==}
    hasBin: true
    dependencies:
      is-core-module: 2.16.0
      path-parse: 1.0.7
      supports-preserve-symlinks-flag: 1.0.0
    dev: true

  /reusify@1.0.4:
    resolution: {integrity: sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==}
    engines: {iojs: '>=1.0.0', node: '>=0.10.0'}
    dev: true

  /run-parallel@1.2.0:
    resolution: {integrity: sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==}
    dependencies:
      queue-microtask: 1.2.3
    dev: true

  /rxjs@7.8.1:
    resolution: {integrity: sha512-AA3TVj+0A2iuIoQkWEK/tqFjBq2j+6PO6Y0zJcvzLAFhEFIO3HL0vls9hWLncZbAAbK0mar7oZ4V079I/qPMxg==}
    requiresBuild: true
    dependencies:
      tslib: 2.8.1
    dev: false
    optional: true

  /safe-array-concat@1.1.3:
    resolution: {integrity: sha512-AURm5f0jYEOydBj7VQlVvDrjeFgthDdEF5H1dP+6mNpoXOMo1quQqJ4wvJDyRZ9+pO3kGWoOdmV08cSv2aJV6Q==}
    engines: {node: '>=0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      get-intrinsic: 1.3.0
      has-symbols: 1.1.0
      isarray: 2.0.5
    dev: true

  /safe-regex-test@1.1.0:
    resolution: {integrity: sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      is-regex: 1.2.1
    dev: true

  /scheduler@0.26.0:
    resolution: {integrity: sha512-NlHwttCI/l5gCPR3D1nNXtWABUmBwvZpEQiD4IXSbIDq8BzLIK/7Ir5gTFSGZDUu37K5cMNp0hFtzO38sC7gWA==}
    dev: false

  /screenfull@5.2.0:
    resolution: {integrity: sha512-9BakfsO2aUQN2K9Fdbj87RJIEZ82Q9IGim7FqM5OsebfoFC6ZHXgDq/KvniuLTPdeM8wY2o6Dj3WQ7KeQCj3cA==}
    engines: {node: '>=0.10.0'}
    dev: false

  /sdp-transform@2.15.0:
    resolution: {integrity: sha512-KrOH82c/W+GYQ0LHqtr3caRpM3ITglq3ljGUIb8LTki7ByacJZ9z+piSGiwZDsRyhQbYBOBJgr2k6X4BZXi3Kw==}
    hasBin: true
    dev: false

  /sdp@3.2.0:
    resolution: {integrity: sha512-d7wDPgDV3DDiqulJjKiV2865wKsJ34YI+NDREbm+FySq6WuKOikwyNQcm+doLAZ1O6ltdO0SeKle2xMpN3Brgw==}
    dev: false

  /semver@6.3.1:
    resolution: {integrity: sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==}
    hasBin: true
    dev: true

  /semver@7.7.1:
    resolution: {integrity: sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==}
    engines: {node: '>=10'}
    hasBin: true
    requiresBuild: true

  /set-function-length@1.2.2:
    resolution: {integrity: sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==}
    engines: {node: '>= 0.4'}
    dependencies:
      define-data-property: 1.1.4
      es-errors: 1.3.0
      function-bind: 1.1.2
      get-intrinsic: 1.3.0
      gopd: 1.2.0
      has-property-descriptors: 1.0.2
    dev: true

  /set-function-name@2.0.2:
    resolution: {integrity: sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      define-data-property: 1.1.4
      es-errors: 1.3.0
      functions-have-names: 1.2.3
      has-property-descriptors: 1.0.2
    dev: true

  /sharp@0.34.1:
    resolution: {integrity: sha512-1j0w61+eVxu7DawFJtnfYcvSv6qPFvfTaqzTQ2BLknVhHTwGS8sc63ZBF4rzkWMBVKybo4S5OBtDdZahh2A1xg==}
    engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
    requiresBuild: true
    dependencies:
      color: 4.2.3
      detect-libc: 2.0.3
      semver: 7.7.1
    optionalDependencies:
      '@img/sharp-darwin-arm64': 0.34.1
      '@img/sharp-darwin-x64': 0.34.1
      '@img/sharp-libvips-darwin-arm64': 1.1.0
      '@img/sharp-libvips-darwin-x64': 1.1.0
      '@img/sharp-libvips-linux-arm': 1.1.0
      '@img/sharp-libvips-linux-arm64': 1.1.0
      '@img/sharp-libvips-linux-ppc64': 1.1.0
      '@img/sharp-libvips-linux-s390x': 1.1.0
      '@img/sharp-libvips-linux-x64': 1.1.0
      '@img/sharp-libvips-linuxmusl-arm64': 1.1.0
      '@img/sharp-libvips-linuxmusl-x64': 1.1.0
      '@img/sharp-linux-arm': 0.34.1
      '@img/sharp-linux-arm64': 0.34.1
      '@img/sharp-linux-s390x': 0.34.1
      '@img/sharp-linux-x64': 0.34.1
      '@img/sharp-linuxmusl-arm64': 0.34.1
      '@img/sharp-linuxmusl-x64': 0.34.1
      '@img/sharp-wasm32': 0.34.1
      '@img/sharp-win32-ia32': 0.34.1
      '@img/sharp-win32-x64': 0.34.1
    dev: false
    optional: true

  /shebang-command@2.0.0:
    resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}
    engines: {node: '>=8'}
    dependencies:
      shebang-regex: 3.0.0
    dev: true

  /shebang-regex@3.0.0:
    resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}
    engines: {node: '>=8'}
    dev: true

  /side-channel-list@1.0.0:
    resolution: {integrity: sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==}
    engines: {node: '>= 0.4'}
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.3
    dev: true

  /side-channel-map@1.0.1:
    resolution: {integrity: sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.3
    dev: true

  /side-channel-weakmap@1.0.2:
    resolution: {integrity: sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.3
      side-channel-map: 1.0.1
    dev: true

  /side-channel@1.1.0:
    resolution: {integrity: sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==}
    engines: {node: '>= 0.4'}
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.3
      side-channel-list: 1.0.0
      side-channel-map: 1.0.1
      side-channel-weakmap: 1.0.2
    dev: true

  /signal-exit@4.1.0:
    resolution: {integrity: sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==}
    engines: {node: '>=14'}
    dev: true

  /simple-swizzle@0.2.2:
    resolution: {integrity: sha512-JA//kQgZtbuY83m+xT+tXJkmJncGMTFT+C+g2h2R9uxkYIrE2yy9sgmcLhCnw57/WSD+Eh3J97FPEDFnbXnDUg==}
    requiresBuild: true
    dependencies:
      is-arrayish: 0.3.2
    dev: false
    optional: true

  /source-map-js@1.2.1:
    resolution: {integrity: sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==}
    engines: {node: '>=0.10.0'}

  /streamsearch@1.1.0:
    resolution: {integrity: sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==}
    engines: {node: '>=10.0.0'}
    dev: false

  /string-width@4.2.3:
    resolution: {integrity: sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==}
    engines: {node: '>=8'}
    dependencies:
      emoji-regex: 8.0.0
      is-fullwidth-code-point: 3.0.0
      strip-ansi: 6.0.1
    dev: true

  /string-width@5.1.2:
    resolution: {integrity: sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==}
    engines: {node: '>=12'}
    dependencies:
      eastasianwidth: 0.2.0
      emoji-regex: 9.2.2
      strip-ansi: 7.1.0
    dev: true

  /string.prototype.matchall@4.0.12:
    resolution: {integrity: sha512-6CC9uyBL+/48dYizRf7H7VAYCMCNTBeM78x/VTUe9bFEaxBepPJDa1Ow99LqI/1yF7kuy7Q3cQsYMrcjGUcskA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-errors: 1.3.0
      es-object-atoms: 1.1.1
      get-intrinsic: 1.3.0
      gopd: 1.2.0
      has-symbols: 1.1.0
      internal-slot: 1.1.0
      regexp.prototype.flags: 1.5.3
      set-function-name: 2.0.2
      side-channel: 1.1.0
    dev: true

  /string.prototype.repeat@1.0.0:
    resolution: {integrity: sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==}
    dependencies:
      define-properties: 1.2.1
      es-abstract: 1.23.6
    dev: true

  /string.prototype.trim@1.2.10:
    resolution: {integrity: sha512-Rs66F0P/1kedk5lyYyH9uBzuiI/kNRmwJAR9quK6VOtIpZ2G+hMZd+HQbbv25MgCA6gEffoMZYxlTod4WcdrKA==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      define-data-property: 1.1.4
      define-properties: 1.2.1
      es-abstract: 1.23.6
      es-object-atoms: 1.1.1
      has-property-descriptors: 1.0.2
    dev: true

  /string.prototype.trimend@1.0.9:
    resolution: {integrity: sha512-G7Ok5C6E/j4SGfyLCloXTrngQIQU3PWtXGst3yM7Bea9FRURf1S42ZHlZZtsNque2FN2PoUhfZXYLNWwEr4dLQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      call-bound: 1.0.4
      define-properties: 1.2.1
      es-object-atoms: 1.1.1
    dev: true

  /string.prototype.trimstart@1.0.8:
    resolution: {integrity: sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      define-properties: 1.2.1
      es-object-atoms: 1.1.1
    dev: true

  /strip-ansi@6.0.1:
    resolution: {integrity: sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==}
    engines: {node: '>=8'}
    dependencies:
      ansi-regex: 5.0.1
    dev: true

  /strip-ansi@7.1.0:
    resolution: {integrity: sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==}
    engines: {node: '>=12'}
    dependencies:
      ansi-regex: 6.1.0
    dev: true

  /strip-bom@3.0.0:
    resolution: {integrity: sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==}
    engines: {node: '>=4'}
    dev: true

  /strip-json-comments@3.1.1:
    resolution: {integrity: sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==}
    engines: {node: '>=8'}
    dev: true

  /styled-jsx@5.1.6(react@19.1.0):
    resolution: {integrity: sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==}
    engines: {node: '>= 12.0.0'}
    peerDependencies:
      '@babel/core': '*'
      babel-plugin-macros: '*'
      react: '>= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0'
    peerDependenciesMeta:
      '@babel/core':
        optional: true
      babel-plugin-macros:
        optional: true
    dependencies:
      client-only: 0.0.1
      react: 19.1.0
    dev: false

  /sucrase@3.35.0:
    resolution: {integrity: sha512-8EbVDiu9iN/nESwxeSxDKe0dunta1GOlHufmSSXxMD2z2/tMZpDMpvXQGsc+ajGo8y2uYUmixaSRUc/QPoQ0GA==}
    engines: {node: '>=16 || 14 >=14.17'}
    hasBin: true
    dependencies:
      '@jridgewell/gen-mapping': 0.3.8
      commander: 4.1.1
      glob: 10.4.5
      lines-and-columns: 1.2.4
      mz: 2.7.0
      pirates: 4.0.6
      ts-interface-checker: 0.1.13
    dev: true

  /supports-color@7.2.0:
    resolution: {integrity: sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==}
    engines: {node: '>=8'}
    dependencies:
      has-flag: 4.0.0
    dev: true

  /supports-preserve-symlinks-flag@1.0.0:
    resolution: {integrity: sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==}
    engines: {node: '>= 0.4'}
    dev: true

  /synckit@0.11.4:
    resolution: {integrity: sha512-Q/XQKRaJiLiFIBNN+mndW7S/RHxvwzuZS6ZwmRzUBqJBv/5QIKCEwkBC8GBf8EQJKYnaFs0wOZbKTXBPj8L9oQ==}
    engines: {node: ^14.18.0 || >=16.0.0}
    dependencies:
      '@pkgr/core': 0.2.4
      tslib: 2.8.1
    dev: true

  /tailwindcss@3.4.17:
    resolution: {integrity: sha512-w33E2aCvSDP0tW9RZuNXadXlkHXqFzSkQew/aIa2i/Sj8fThxwovwlXHSPXTbAHwEIhBFXAedUhP2tueAKP8Og==}
    engines: {node: '>=14.0.0'}
    hasBin: true
    dependencies:
      '@alloc/quick-lru': 5.2.0
      arg: 5.0.2
      chokidar: 3.6.0
      didyoumean: 1.2.2
      dlv: 1.1.3
      fast-glob: 3.3.2
      glob-parent: 6.0.2
      is-glob: 4.0.3
      jiti: 1.21.7
      lilconfig: 3.1.3
      micromatch: 4.0.8
      normalize-path: 3.0.0
      object-hash: 3.0.0
      picocolors: 1.1.1
      postcss: 8.4.49
      postcss-import: 15.1.0(postcss@8.4.49)
      postcss-js: 4.0.1(postcss@8.4.49)
      postcss-load-config: 4.0.2(postcss@8.4.49)
      postcss-nested: 6.2.0(postcss@8.4.49)
      postcss-selector-parser: 6.1.2
      resolve: 1.22.10
      sucrase: 3.35.0
    transitivePeerDependencies:
      - ts-node
    dev: true

  /thenify-all@1.6.0:
    resolution: {integrity: sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==}
    engines: {node: '>=0.8'}
    dependencies:
      thenify: 3.3.1
    dev: true

  /thenify@3.3.1:
    resolution: {integrity: sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==}
    dependencies:
      any-promise: 1.3.0
    dev: true

  /to-regex-range@5.0.1:
    resolution: {integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==}
    engines: {node: '>=8.0'}
    dependencies:
      is-number: 7.0.0
    dev: true

  /tr46@0.0.3:
    resolution: {integrity: sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==}
    dev: false

  /ts-api-utils@2.1.0(typescript@5.0.4):
    resolution: {integrity: sha512-CUgTZL1irw8u29bzrOD/nH85jqyc74D6SshFgujOIA7osm2Rz7dYH77agkx7H4FBNxDq7Cjf+IjaX/8zwFW+ZQ==}
    engines: {node: '>=18.12'}
    peerDependencies:
      typescript: '>=4.8.4'
    dependencies:
      typescript: 5.0.4
    dev: true

  /ts-debounce@4.0.0:
    resolution: {integrity: sha512-+1iDGY6NmOGidq7i7xZGA4cm8DAa6fqdYcvO5Z6yBevH++Bdo9Qt/mN0TzHUgcCcKv1gmh9+W5dHqz8pMWbCbg==}
    dev: false

  /ts-interface-checker@0.1.13:
    resolution: {integrity: sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==}
    dev: true

  /tsconfig-paths@3.15.0:
    resolution: {integrity: sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==}
    dependencies:
      '@types/json5': 0.0.29
      json5: 1.0.2
      minimist: 1.2.8
      strip-bom: 3.0.0
    dev: true

  /tslib@2.7.0:
    resolution: {integrity: sha512-gLXCKdN1/j47AiHiOkJN69hJmcbGTHI0ImLmbYLHykhgeN0jVGola9yVjFgzCUklsZQMW55o+dW7IXv3RCXDzA==}
    dev: false

  /tslib@2.8.1:
    resolution: {integrity: sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==}

  /type-check@0.4.0:
    resolution: {integrity: sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==}
    engines: {node: '>= 0.8.0'}
    dependencies:
      prelude-ls: 1.2.1
    dev: true

  /typed-array-buffer@1.0.3:
    resolution: {integrity: sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      is-typed-array: 1.1.15
    dev: true

  /typed-array-byte-length@1.0.3:
    resolution: {integrity: sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      for-each: 0.3.3
      gopd: 1.2.0
      has-proto: 1.2.0
      is-typed-array: 1.1.15
    dev: true

  /typed-array-byte-offset@1.0.4:
    resolution: {integrity: sha512-bTlAFB/FBYMcuX81gbL4OcpH5PmlFHqlCCpAl8AlEzMz5k53oNDvN8p1PNOWLEmI2x4orp3raOFB51tv9X+MFQ==}
    engines: {node: '>= 0.4'}
    dependencies:
      available-typed-arrays: 1.0.7
      call-bind: 1.0.8
      for-each: 0.3.3
      gopd: 1.2.0
      has-proto: 1.2.0
      is-typed-array: 1.1.15
      reflect.getprototypeof: 1.0.9
    dev: true

  /typed-array-length@1.0.7:
    resolution: {integrity: sha512-3KS2b+kL7fsuk/eJZ7EQdnEmQoaho/r6KUef7hxvltNA5DR8NAUM+8wJMbJyZ4G9/7i3v5zPBIMN5aybAh2/Jg==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bind: 1.0.8
      for-each: 0.3.3
      gopd: 1.2.0
      is-typed-array: 1.1.15
      possible-typed-array-names: 1.0.0
      reflect.getprototypeof: 1.0.9
    dev: true

  /typed-emitter@2.1.0:
    resolution: {integrity: sha512-g/KzbYKbH5C2vPkaXGu8DJlHrGKHLsM25Zg9WuC9pMGfuvT+X25tZQWo5fK1BjBm8+UrVE9LDCvaY0CQk+fXDA==}
    optionalDependencies:
      rxjs: 7.8.1
    dev: false

  /typescript@5.0.4:
    resolution: {integrity: sha512-cW9T5W9xY37cc+jfEnaUvX91foxtHkza3Nw3wkoF4sSlKn0MONdkdEndig/qPBWXNkmplh3NzayQzCiHM4/hqw==}
    engines: {node: '>=12.20'}
    hasBin: true
    dev: true

  /unbox-primitive@1.1.0:
    resolution: {integrity: sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      has-bigints: 1.1.0
      has-symbols: 1.1.0
      which-boxed-primitive: 1.1.1
    dev: true

  /undici-types@5.26.5:
    resolution: {integrity: sha512-JlCMO+ehdEIKqlFxk6IfVoAUVmgz7cU7zD/h9XZ0qzeosSHmUJVOzSQvvYSYWXkFXC+IfLKSIffhv0sVZup6pA==}
    dev: false

  /update-browserslist-db@1.1.1(browserslist@4.24.3):
    resolution: {integrity: sha512-R8UzCaa9Az+38REPiJ1tXlImTJXlVfgHZsglwBD/k6nj76ctsH1E3q4doGrukiLQd3sGQYu56r5+lo5r94l29A==}
    hasBin: true
    peerDependencies:
      browserslist: '>= 4.21.0'
    dependencies:
      browserslist: 4.24.3
      escalade: 3.2.0
      picocolors: 1.1.1
    dev: true

  /uri-js@4.4.1:
    resolution: {integrity: sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==}
    dependencies:
      punycode: 2.3.1
    dev: true

  /use-callback-ref@1.3.3(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-jQL3lRnocaFtu3V00JToYz/4QkNWswxijDaCVNZRiRTO3HQDLsdu1ZtmIUvV4yPp+rvWm5j0y0TG/S61cuijTg==}
    engines: {node: '>=10'}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      react: 19.1.0
      tslib: 2.8.1
    dev: false

  /use-sidecar@1.1.3(@types/react@19.0.1)(react@19.1.0):
    resolution: {integrity: sha512-Fedw0aZvkhynoPYlA5WXrMCAMm+nSWdZt6lzJQ7Ok8S6Q+VsHmHpRWndVRJ8Be0ZbkfPc5LRYH+5XrzXcEeLRQ==}
    engines: {node: '>=10'}
    peerDependencies:
      '@types/react': '*'
      react: ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc
    peerDependenciesMeta:
      '@types/react':
        optional: true
    dependencies:
      '@types/react': 19.0.1
      detect-node-es: 1.1.0
      react: 19.1.0
      tslib: 2.8.1
    dev: false

  /util-deprecate@1.0.2:
    resolution: {integrity: sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==}
    dev: true

  /web-streams-polyfill@3.3.3:
    resolution: {integrity: sha512-d2JWLCivmZYTSIoge9MsgFCZrt571BikcWGYkjC1khllbTeDlGqZ2D8vD8E/lJa8WGWbb7Plm8/XJYV7IJHZZw==}
    engines: {node: '>= 8'}
    dev: false

  /web-streams-polyfill@4.0.0-beta.3:
    resolution: {integrity: sha512-QW95TCTaHmsYfHDybGMwO5IJIM93I/6vTRk+daHTWFPhwh+C8Cg7j7XyKrwrj8Ib6vYXe0ocYNrmzY4xAAN6ug==}
    engines: {node: '>= 14'}
    dev: false

  /webidl-conversions@3.0.1:
    resolution: {integrity: sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==}
    dev: false

  /webrtc-adapter@9.0.1:
    resolution: {integrity: sha512-1AQO+d4ElfVSXyzNVTOewgGT/tAomwwztX/6e3totvyyzXPvXIIuUUjAmyZGbKBKbZOXauuJooZm3g6IuFuiNQ==}
    engines: {node: '>=6.0.0', npm: '>=3.10.0'}
    dependencies:
      sdp: 3.2.0
    dev: false

  /webrtc-issue-detector@1.16.3:
    resolution: {integrity: sha512-VDBeCa1ZfZaErynTfs/YgziSLtSXF9INXP6ciCtgBJI95pzT+CaRUvi1DmDFpyGuRvuox9CQCdjShl+qiIFfkw==}
    dev: false

  /whatwg-url@5.0.0:
    resolution: {integrity: sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==}
    dependencies:
      tr46: 0.0.3
      webidl-conversions: 3.0.1
    dev: false

  /which-boxed-primitive@1.1.1:
    resolution: {integrity: sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==}
    engines: {node: '>= 0.4'}
    dependencies:
      is-bigint: 1.1.0
      is-boolean-object: 1.2.1
      is-number-object: 1.1.1
      is-string: 1.1.1
      is-symbol: 1.1.1
    dev: true

  /which-builtin-type@1.2.1:
    resolution: {integrity: sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==}
    engines: {node: '>= 0.4'}
    dependencies:
      call-bound: 1.0.4
      function.prototype.name: 1.1.7
      has-tostringtag: 1.0.2
      is-async-function: 2.0.0
      is-date-object: 1.1.0
      is-finalizationregistry: 1.1.1
      is-generator-function: 1.0.10
      is-regex: 1.2.1
      is-weakref: 1.1.0
      isarray: 2.0.5
      which-boxed-primitive: 1.1.1
      which-collection: 1.0.2
      which-typed-array: 1.1.18
    dev: true

  /which-collection@1.0.2:
    resolution: {integrity: sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==}
    engines: {node: '>= 0.4'}
    dependencies:
      is-map: 2.0.3
      is-set: 2.0.3
      is-weakmap: 2.0.2
      is-weakset: 2.0.4
    dev: true

  /which-typed-array@1.1.18:
    resolution: {integrity: sha512-qEcY+KJYlWyLH9vNbsr6/5j59AXk5ni5aakf8ldzBvGde6Iz4sxZGkJyWSAueTG7QhOvNRYb1lDdFmL5Td0QKA==}
    engines: {node: '>= 0.4'}
    dependencies:
      available-typed-arrays: 1.0.7
      call-bind: 1.0.8
      call-bound: 1.0.4
      for-each: 0.3.3
      gopd: 1.2.0
      has-tostringtag: 1.0.2
    dev: true

  /which@2.0.2:
    resolution: {integrity: sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==}
    engines: {node: '>= 8'}
    hasBin: true
    dependencies:
      isexe: 2.0.0
    dev: true

  /word-wrap@1.2.5:
    resolution: {integrity: sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==}
    engines: {node: '>=0.10.0'}
    dev: true

  /wrap-ansi@7.0.0:
    resolution: {integrity: sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==}
    engines: {node: '>=10'}
    dependencies:
      ansi-styles: 4.3.0
      string-width: 4.2.3
      strip-ansi: 6.0.1
    dev: true

  /wrap-ansi@8.1.0:
    resolution: {integrity: sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==}
    engines: {node: '>=12'}
    dependencies:
      ansi-styles: 6.2.1
      string-width: 5.1.2
      strip-ansi: 7.1.0
    dev: true

  /yaml@2.6.1:
    resolution: {integrity: sha512-7r0XPzioN/Q9kXBro/XPnA6kznR73DHq+GXh5ON7ZozRO6aMjbmiBuKste2wslTFkC5d1dw0GooOCepZXJ2SAg==}
    engines: {node: '>= 14'}
    hasBin: true
    dev: true

  /yocto-queue@0.1.0:
    resolution: {integrity: sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==}
    engines: {node: '>=10'}
    dev: true



================================================
FILE: postcss.config.js
================================================
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}



================================================
FILE: tailwind.config.js
================================================
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  darkMode: "class",
}



================================================
FILE: tsconfig.json
================================================
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}



================================================
FILE: .npmrc
================================================




================================================
FILE: app/error.tsx
================================================
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service

    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}



================================================
FILE: app/layout.tsx
================================================
import "@/styles/globals.css";
import { Metadata } from "next";
import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

import NavBar from "@/components/NavBar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "HeyGen Interactive Avatar SDK Demo",
    template: `%s - HeyGen Interactive Avatar SDK Demo`,
  },
  icons: {
    icon: "/heygen-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} font-sans`}
      lang="en"
    >
      <head />
      <body className="min-h-screen bg-black text-white">
        <main className="relative flex flex-col gap-6 h-screen w-screen">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}



================================================
FILE: app/page.tsx
================================================
"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-[900px] flex flex-col items-start justify-start gap-5 mx-auto pt-4 pb-20">
        <div className="w-full">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}



================================================
FILE: app/api/get-access-token/route.ts
================================================
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function POST() {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }
    const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    const res = await fetch(`${baseApiUrl}/v1/streaming.create_token`, {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
      },
    });

    console.log("Response:", res);

    const data = await res.json();

    return new Response(data.data.token, {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return new Response("Failed to retrieve access token", {
      status: 500,
    });
  }
}



================================================
FILE: app/lib/constants.ts
================================================
export const AVATARS = [
  {
    avatar_id: "Ann_Therapist_public",
    name: "Ann Therapist",
  },
  {
    avatar_id: "Shawn_Therapist_public",
    name: "Shawn Therapist",
  },
  {
    avatar_id: "Bryan_FitnessCoach_public",
    name: "Bryan Fitness Coach",
  },
  {
    avatar_id: "Dexter_Doctor_Standing2_public",
    name: "Dexter Doctor Standing",
  },
  {
    avatar_id: "Elenora_IT_Sitting_public",
    name: "Elenora Tech Expert",
  },
];

export const STT_LANGUAGE_LIST = [
  { label: "Bulgarian", value: "bg", key: "bg" },
  { label: "Chinese", value: "zh", key: "zh" },
  { label: "Czech", value: "cs", key: "cs" },
  { label: "Danish", value: "da", key: "da" },
  { label: "Dutch", value: "nl", key: "nl" },
  { label: "English", value: "en", key: "en" },
  { label: "Finnish", value: "fi", key: "fi" },
  { label: "French", value: "fr", key: "fr" },
  { label: "German", value: "de", key: "de" },
  { label: "Greek", value: "el", key: "el" },
  { label: "Hindi", value: "hi", key: "hi" },
  { label: "Hungarian", value: "hu", key: "hu" },
  { label: "Indonesian", value: "id", key: "id" },
  { label: "Italian", value: "it", key: "it" },
  { label: "Japanese", value: "ja", key: "ja" },
  { label: "Korean", value: "ko", key: "ko" },
  { label: "Malay", value: "ms", key: "ms" },
  { label: "Norwegian", value: "no", key: "no" },
  { label: "Polish", value: "pl", key: "pl" },
  { label: "Portuguese", value: "pt", key: "pt" },
  { label: "Romanian", value: "ro", key: "ro" },
  { label: "Russian", value: "ru", key: "ru" },
  { label: "Slovak", value: "sk", key: "sk" },
  { label: "Spanish", value: "es", key: "es" },
  { label: "Swedish", value: "sv", key: "sv" },
  { label: "Turkish", value: "tr", key: "tr" },
  { label: "Ukrainian", value: "uk", key: "uk" },
  { label: "Vietnamese", value: "vi", key: "vi" },
];



================================================
FILE: components/Button.tsx
================================================
import React from "react";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, onClick, ...props }) => {
  return (
    <button
      className={`bg-[#7559FF] text-white text-sm px-6 py-2 rounded-lg disabled:opacity-50 h-fit ${className}`}
      onClick={props.disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </button>
  );
};



================================================
FILE: components/Icons.tsx
================================================
export function HeyGenLogo() {
  return <img alt="HeyGen Logo" className="h-8" src="/heygen-logo.png" />;
}

type IconSvgProps = {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
};

export function GithubIcon({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function ChevronDownIcon({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 20 20"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.88231 7.6185C4.7173 7.78351 4.6348 7.86601 4.60389 7.96115C4.5767 8.04483 4.5767 8.13498 4.60389 8.21866C4.6348 8.3138 4.7173 8.3963 4.88231 8.56131L8.82165 12.5007C9.47253 13.1515 10.5278 13.1515 11.1787 12.5007L15.118 8.56131C15.283 8.39631 15.3655 8.3138 15.3964 8.21866C15.4236 8.13498 15.4236 8.04484 15.3964 7.96115C15.3655 7.86601 15.283 7.78351 15.118 7.6185L14.8823 7.3828C14.7173 7.21779 14.6348 7.13529 14.5397 7.10438C14.456 7.07719 14.3658 7.07719 14.2822 7.10438C14.187 7.13529 14.1045 7.21779 13.9395 7.3828L10.4716 10.8507C10.3066 11.0157 10.2241 11.0982 10.1289 11.1292C10.0452 11.1563 9.95509 11.1563 9.87141 11.1292C9.77627 11.0982 9.69377 11.0157 9.52876 10.8507L6.06082 7.3828C5.89582 7.21779 5.81331 7.13529 5.71818 7.10438C5.63449 7.07719 5.54435 7.07719 5.46066 7.10438C5.36552 7.13529 5.28302 7.21779 5.11801 7.3828L4.88231 7.6185Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SendIcon({ size = 24, width, height, ...props }: IconSvgProps) {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 16 16"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M14.686 7.41437C14.8667 7.78396 14.8667 8.21629 14.686 8.58588C14.5413 8.8817 14.2792 9.05684 14.08 9.17191C13.8742 9.29079 13.6015 9.41707 13.2919 9.56042L3.52078 14.0855C3.29008 14.1924 3.07741 14.2909 2.89693 14.3553C2.70994 14.422 2.46552 14.4879 2.19444 14.442C1.8383 14.3817 1.52185 14.1796 1.3175 13.8817C1.16195 13.655 1.11903 13.4055 1.10097 13.2078C1.08355 13.017 1.08357 12.7826 1.08359 12.5284L1.08359 10.1207C1.08359 10.1021 1.08351 10.0829 1.08343 10.0633C1.08255 9.85606 1.08146 9.59598 1.17301 9.35874C1.252 9.15409 1.38025 8.97208 1.54641 8.82886C1.73903 8.66284 1.98433 8.57639 2.17979 8.5075C2.19829 8.50098 2.21635 8.49461 2.23387 8.48835L3.3612 8.08569L2.23387 7.68302C2.21635 7.67676 2.19829 7.67039 2.17979 7.66387C1.98433 7.59498 1.73903 7.50853 1.54641 7.34251C1.38025 7.19929 1.252 7.01728 1.17301 6.81263C1.08146 6.57539 1.08255 6.3153 1.08343 6.10806C1.08351 6.08844 1.08359 6.0693 1.08359 6.05069L1.08359 3.47182C1.08357 3.21759 1.08355 2.98324 1.10097 2.79242C1.11903 2.59472 1.16195 2.34523 1.3175 2.11853C1.52185 1.82069 1.8383 1.61851 2.19444 1.55824C2.46552 1.51236 2.70994 1.57825 2.89693 1.64495C3.07741 1.70933 3.29007 1.80784 3.52076 1.9147L13.2919 6.43983C13.6015 6.58318 13.8742 6.70946 14.08 6.82834C14.2792 6.94341 14.5413 7.11855 14.686 7.41437ZM13.413 7.98287C13.266 7.89792 13.0493 7.79688 12.7045 7.63716L2.98502 3.13597C2.7214 3.01388 2.56493 2.94215 2.44896 2.90078C2.44246 2.89846 2.43638 2.89635 2.4307 2.89443C2.43005 2.90039 2.42941 2.9068 2.42878 2.91367C2.41759 3.03629 2.41693 3.20842 2.41693 3.49893L2.41693 6.05069C2.41693 6.19492 2.41728 6.27013 2.42098 6.32446C2.4211 6.32621 2.42121 6.32787 2.42133 6.32946C2.42279 6.3301 2.42431 6.33077 2.42591 6.33147C2.47584 6.35323 2.54655 6.37886 2.68238 6.42738L5.56736 7.45787C5.83268 7.55263 6.00978 7.80395 6.00978 8.08569C6.00978 8.36742 5.83268 8.61874 5.56736 8.7135L2.68238 9.74399C2.54655 9.79251 2.47584 9.81814 2.42591 9.8399C2.42431 9.8406 2.42279 9.84127 2.42133 9.84191C2.42121 9.8435 2.4211 9.84516 2.42098 9.84691C2.41728 9.90124 2.41693 9.97645 2.41693 10.1207L2.41693 12.5013C2.41693 12.7918 2.41759 12.964 2.42878 13.0866C2.42941 13.0935 2.43005 13.0999 2.4307 13.1058C2.43638 13.1039 2.44246 13.1018 2.44896 13.0995C2.56493 13.0581 2.7214 12.9864 2.98502 12.8643L12.7045 8.36309C13.0493 8.20337 13.266 8.10233 13.413 8.01737C13.4236 8.01125 13.4333 8.0055 13.4422 8.00012C13.4333 7.99474 13.4236 7.98899 13.413 7.98287Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function MicIcon({ size = 24, width, height, ...props }: IconSvgProps) {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 20 20"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_9098_19437)">
        <g filter="url(#filter0_d_9098_19437)">
          <path
            clipRule="evenodd"
            d="M5.83341 5.00065C5.83341 2.69946 7.6989 0.833984 10.0001 0.833984C12.3013 0.833984 14.1667 2.69946 14.1667 5.00065L14.1667 8.33398C14.1667 10.6352 12.3013 12.5007 10.0001 12.5007C7.6989 12.5007 5.83341 10.6352 5.83341 8.33398L5.83341 5.00065ZM12.5001 5.00065L12.5001 8.33398C12.5001 9.7147 11.3808 10.834 10.0001 10.834C8.61937 10.834 7.50008 9.7147 7.50008 8.33398V5.00065C7.50008 3.61994 8.61937 2.50065 10.0001 2.50065C11.3808 2.50065 12.5001 3.61994 12.5001 5.00065Z"
            fill="#232833"
            fillRule="evenodd"
          />
          <path
            d="M5.66675 17.5007H9.16675V15.3688C5.64744 14.9564 2.91675 11.9641 2.91675 8.33398V8.16732C2.91675 7.93396 2.91675 7.81729 2.96216 7.72816C3.00211 7.64975 3.06585 7.58601 3.14425 7.54607C3.23338 7.50065 3.35006 7.50065 3.58341 7.50065H3.91675C4.1501 7.50065 4.26678 7.50065 4.35591 7.54607C4.43431 7.58601 4.49805 7.64975 4.538 7.72816C4.58341 7.81729 4.58341 7.93396 4.58341 8.16732V8.33398C4.58341 11.3255 7.00854 13.7507 10.0001 13.7507C12.9916 13.7507 15.4167 11.3255 15.4167 8.33398V8.16732C15.4167 7.93396 15.4167 7.81729 15.4622 7.72816C15.5021 7.64975 15.5659 7.58601 15.6443 7.54607C15.7334 7.50065 15.8501 7.50065 16.0834 7.50065H16.4167C16.6501 7.50065 16.7668 7.50065 16.8559 7.54607C16.9343 7.58601 16.9981 7.64975 17.038 7.72816C17.0834 7.81729 17.0834 7.93396 17.0834 8.16732V8.33398C17.0834 11.9641 14.3527 14.9564 10.8334 15.3688V17.5007L14.3334 17.5007C14.5668 17.5007 14.6834 17.5007 14.7726 17.5461C14.851 17.586 14.9147 17.6498 14.9547 17.7282C15.0001 17.8173 15.0001 17.934 15.0001 18.1673V18.5007C15.0001 18.734 15.0001 18.8507 14.9547 18.9398C14.9147 19.0182 14.851 19.082 14.7726 19.1219C14.6834 19.1673 14.5668 19.1673 14.3334 19.1673L5.66675 19.1673C5.43339 19.1673 5.31672 19.1673 5.22759 19.1219C5.14918 19.082 5.08544 19.0182 5.0455 18.9398C5.00008 18.8507 5.00008 18.734 5.00008 18.5007V18.1673C5.00008 17.934 5.00008 17.8173 5.0455 17.7282C5.08544 17.6498 5.14918 17.586 5.22759 17.5461C5.31672 17.5007 5.43339 17.5007 5.66675 17.5007Z"
            fill="#232833"
          />
        </g>
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="22.334"
          id="filter0_d_9098_19437"
          width="18.1667"
          x="0.916748"
          y="-0.166016"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"
          />
          <feBlend
            in2="BackgroundImageFix"
            mode="normal"
            result="effect1_dropShadow_9098_19437"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_9098_19437"
            mode="normal"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_9098_19437">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function MicOffIcon({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 48 48"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24 2c2.75 0 5.24 1.11 7.047 2.905l-2.864 2.793A6 6 0 0 0 18 12v5.633l-3.898 3.803A10.09 10.09 0 0 1 14 20v-8c0-5.523 4.477-10 10-10Z"
        data-follow-fill="#232833"
        fill="#232833"
      />
      <path
        clipRule="evenodd"
        d="m18.151 28.112-2.172 2.12A12.945 12.945 0 0 0 24 33c7.18 0 13-5.82 13-13v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1c0 8.712-6.554 15.894-15 16.884V42h9a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h9v-5.116a16.925 16.925 0 0 1-8.904-3.84l-6.185 6.033a1 1 0 0 1-1.414-.017l-1.292-1.324a1 1 0 0 1 .018-1.414l33.642-32.82a1 1 0 0 1 1.415.017l1.291 1.324a1 1 0 0 1-.017 1.414L34 12.651V20c0 5.523-4.477 10-10 10-2.184 0-4.204-.7-5.849-1.888ZM30 16.552l-8.912 8.695A6 6 0 0 0 30 20v-3.447Z"
        data-follow-fill="#232833"
        fill="#232833"
        fillRule="evenodd"
      />
      <path
        d="M11 20c0 1.353.207 2.658.59 3.885l-3.119 3.043A16.94 16.94 0 0 1 7 20v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1Z"
        data-follow-fill="#232833"
        fill="#232833"
      />
    </svg>
  );
}

export function LoadingIcon({
  size = 24,
  width,
  height,
  className,
  ...props
}: IconSvgProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      height={size || height}
      viewBox="0 0 1024 1024"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M512 170.667c-188.523 0-341.333 152.81-341.333 341.333S323.477 853.333 512 853.333a339.84 339.84 0 0 0 208.704-71.232c22.4-17.322 33.621-26.005 39.403-28.842 4.202-2.07 5.781-2.944 7.466-3.499 1.664-.576 3.435-.853 8.043-1.813 6.315-1.28 22.997-1.28 56.384-1.28 13.333 0 20.01 0 22.933 2.325a10.347 10.347 0 0 1 4.011 8.256c.043 3.733-3.627 8.384-10.923 17.707C769.941 874.624 648.448 938.667 512 938.667 276.352 938.667 85.333 747.648 85.333 512S276.352 85.333 512 85.333c136.448 0 257.92 64.043 336.021 163.712 7.318 9.323 10.966 13.974 10.923 17.707a10.347 10.347 0 0 1-4.01 8.256c-2.923 2.325-9.6 2.325-22.934 2.325-33.387 0-50.07 0-56.384-1.28-4.608-.938-6.379-1.237-8.043-1.813-1.685-.555-3.264-1.43-7.466-3.499-5.782-2.837-16.982-11.52-39.403-28.842A339.84 339.84 0 0 0 512 170.667z"
        data-follow-fill="#2c2c2c"
        fill="currentColor"
      />
      <path
        d="M832 682.667a170.667 170.667 0 1 0 0-341.334 170.667 170.667 0 0 0 0 341.334z"
        data-follow-fill="#2c2c2c"
        fill="currentColor"
      />
    </svg>
  );
}

export function CloseIcon({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 20 20"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.7135 3.43055C15.8086 3.46146 15.8911 3.54396 16.0562 3.70897L16.2919 3.94467C16.4569 4.10968 16.5394 4.19218 16.5703 4.28732C16.5975 4.37101 16.5975 4.46115 16.5703 4.54484C16.5394 4.63997 16.4569 4.72248 16.2919 4.88748L11.1785 10.0008L16.2918 15.1141C16.4568 15.2791 16.5393 15.3616 16.5702 15.4568C16.5974 15.5404 16.5974 15.6306 16.5702 15.7143C16.5393 15.8094 16.4568 15.8919 16.2918 16.0569L16.0561 16.2926C15.8911 16.4576 15.8086 16.5401 15.7135 16.571C15.6298 16.5982 15.5396 16.5982 15.4559 16.571C15.3608 16.5401 15.2783 16.4576 15.1133 16.2926L10 11.1793L4.8868 16.2925C4.7218 16.4575 4.63929 16.5401 4.54415 16.571C4.46047 16.5982 4.37032 16.5982 4.28664 16.571C4.1915 16.5401 4.109 16.4575 3.94399 16.2925L3.70829 16.0568C3.54328 15.8918 3.46078 15.8093 3.42987 15.7142C3.40267 15.6305 3.40267 15.5404 3.42987 15.4567C3.46078 15.3615 3.54328 15.279 3.70829 15.114L8.8215 10.0008L3.70824 4.88756C3.54323 4.72255 3.46073 4.64005 3.42982 4.54491C3.40263 4.46123 3.40263 4.37108 3.42982 4.2874C3.46073 4.19226 3.54323 4.10976 3.70824 3.94475L3.94394 3.70905C4.10895 3.54404 4.19145 3.46154 4.28659 3.43062C4.37027 3.40343 4.46042 3.40343 4.5441 3.43062C4.63924 3.46154 4.72174 3.54404 4.88675 3.70905L10 8.82231L15.1133 3.70897C15.2784 3.54396 15.3609 3.46146 15.456 3.43055C15.5397 3.40336 15.6298 3.40336 15.7135 3.43055Z"
        fill="currentColor"
      />
    </svg>
  );
}



================================================
FILE: components/Input.tsx
================================================
import React from "react";

interface InputProps {
  value: string | undefined | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Input = (props: InputProps) => {
  return (
    <input
      className={`w-full text-white text-sm bg-zinc-700 py-2 px-6 rounded-lg outline-none ${props.className}`}
      placeholder={props.placeholder}
      type="text"
      value={props.value || ""}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};



================================================
FILE: components/InteractiveAvatar.tsx
================================================
import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount } from "ahooks";

import { Button } from "./Button";
import { AvatarConfig } from "./AvatarConfig";
import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { MessageHistory } from "./AvatarSession/MessageHistory";

import { AVATARS } from "@/app/lib/constants";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: AVATARS[0].avatar_id,
  knowledgeId: undefined,
  voice: {
    rate: 1.5,
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en",
  disableIdleTimeout: true,
  voiceChatTransport: VoiceChatTransport.LIVEKIT,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

function InteractiveAvatar() {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);

  const mediaStream = useRef<HTMLVideoElement>(null);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });

      await startAvatar(config);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col rounded-xl bg-zinc-900 overflow-hidden">
        <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center">
          {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
            <AvatarVideo ref={mediaStream} />
          ) : (
            <AvatarConfig config={config} onConfigChange={setConfig} />
          )}
        </div>
        <div className="flex flex-col gap-3 items-center justify-center p-4 border-t border-zinc-700 w-full">
          {sessionState === StreamingAvatarSessionState.CONNECTED ? (
            <AvatarControls />
          ) : sessionState === StreamingAvatarSessionState.INACTIVE ? (
            <div className="flex flex-row gap-4">
              <Button onClick={() => startSessionV2(true)}>
                Start Voice Chat
              </Button>
              <Button onClick={() => startSessionV2(false)}>
                Start Text Chat
              </Button>
            </div>
          ) : (
            <LoadingIcon />
          )}
        </div>
      </div>
      {sessionState === StreamingAvatarSessionState.CONNECTED && (
        <MessageHistory />
      )}
    </div>
  );
}

export default function InteractiveAvatarWrapper() {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar />
    </StreamingAvatarProvider>
  );
}



================================================
FILE: components/NavBar.tsx
================================================
"use client";

import Link from "next/link";

import { GithubIcon, HeyGenLogo } from "./Icons";

export default function NavBar() {
  return (
    <>
      <div className="flex flex-row justify-between items-center w-[1000px] m-auto p-6">
        <div className="flex flex-row items-center gap-4">
          <Link href="https://app.heygen.com/" target="_blank">
            <HeyGenLogo />
          </Link>
          <div className="bg-gradient-to-br from-sky-300 to-indigo-500 bg-clip-text">
            <p className="text-xl font-semibold text-transparent">
              HeyGen Interactive Avatar SDK NextJS Demo
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-6">
          <Link
            href="https://labs.heygen.com/interactive-avatar"
            target="_blank"
          >
            Avatars
          </Link>
          <Link
            href="https://docs.heygen.com/reference/list-voices-v2"
            target="_blank"
          >
            Voices
          </Link>
          <Link
            href="https://docs.heygen.com/reference/new-session-copy"
            target="_blank"
          >
            API Docs
          </Link>
          <Link
            href="https://help.heygen.com/en/articles/9182113-interactive-avatar-101-your-ultimate-guide"
            target="_blank"
          >
            Guide
          </Link>
          <Link
            aria-label="Github"
            className="flex flex-row justify-center gap-1 text-foreground"
            href="https://github.com/HeyGen-Official/StreamingAvatarSDK"
            target="_blank"
          >
            <GithubIcon className="text-default-500" />
            SDK
          </Link>
        </div>
      </div>
    </>
  );
}



================================================
FILE: components/Select.tsx
================================================
import * as SelectPrimitive from "@radix-ui/react-select";
import { useState } from "react";

import { ChevronDownIcon } from "./Icons";

interface SelectProps<T> {
  options: T[];
  renderOption: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
  isSelected: (option: T) => boolean;
  value: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
}

export function Select<T>(props: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectPrimitive.Root
      disabled={props.disabled}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectPrimitive.Trigger className="w-full text-white text-sm bg-zinc-700 py-2 px-6 rounded-lg cursor-pointer flex items-center justify-between h-fit disabled:opacity-50 min-h-[36px]">
        <div className={`${props.value ? "text-white" : "text-zinc-400"}`}>
          {props.value ? props.value : props.placeholder}
        </div>
        <ChevronDownIcon className="w-4 h-4" />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50 w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto"
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.Viewport className="rounded-lg border border-zinc-600 bg-zinc-700 shadow-lg py-1">
            {props.options.map((option) => {
              const isSelected = props.isSelected(option);

              return (
                <div
                  key={props.renderOption(option)?.toString()}
                  className={`py-2 px-4 cursor-pointer hover:bg-zinc-600 outline-none text-sm ${
                    isSelected ? "text-white bg-zinc-500" : "text-zinc-400"
                  }`}
                  onClick={() => {
                    props.onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  {props.renderOption(option)}
                </div>
              );
            })}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}



================================================
FILE: components/AvatarConfig/Field.tsx
================================================
interface FieldProps {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}

export const Field = (props: FieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-zinc-400 text-sm">{props.label}</label>
      {props.children}
    </div>
  );
};



================================================
FILE: components/AvatarConfig/index.tsx
================================================
import React, { useMemo, useState } from "react";
import {
  AvatarQuality,
  ElevenLabsModel,
  STTProvider,
  VoiceEmotion,
  StartAvatarRequest,
  VoiceChatTransport,
} from "@heygen/streaming-avatar";

import { Input } from "../Input";
import { Select } from "../Select";

import { Field } from "./Field";

import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";

interface AvatarConfigProps {
  onConfigChange: (config: StartAvatarRequest) => void;
  config: StartAvatarRequest;
}

export const AvatarConfig: React.FC<AvatarConfigProps> = ({
  onConfigChange,
  config,
}) => {
  const onChange = <T extends keyof StartAvatarRequest>(
    key: T,
    value: StartAvatarRequest[T],
  ) => {
    onConfigChange({ ...config, [key]: value });
  };
  const [showMore, setShowMore] = useState<boolean>(false);

  const selectedAvatar = useMemo(() => {
    const avatar = AVATARS.find(
      (avatar) => avatar.avatar_id === config.avatarName,
    );

    if (!avatar) {
      return {
        isCustom: true,
        name: "Custom Avatar ID",
        avatarId: null,
      };
    } else {
      return {
        isCustom: false,
        name: avatar.name,
        avatarId: avatar.avatar_id,
      };
    }
  }, [config.avatarName]);

  return (
    <div className="relative flex flex-col gap-4 w-[550px] py-8 max-h-full overflow-y-auto px-4">
      <Field label="Custom Knowledge Base ID">
        <Input
          placeholder="Enter custom knowledge base ID"
          value={config.knowledgeId}
          onChange={(value) => onChange("knowledgeId", value)}
        />
      </Field>
      <Field label="Avatar ID">
        <Select
          isSelected={(option) =>
            typeof option === "string"
              ? !!selectedAvatar?.isCustom
              : option.avatar_id === selectedAvatar?.avatarId
          }
          options={[...AVATARS, "CUSTOM"]}
          placeholder="Select Avatar"
          renderOption={(option) => {
            return typeof option === "string"
              ? "Custom Avatar ID"
              : option.name;
          }}
          value={
            selectedAvatar?.isCustom ? "Custom Avatar ID" : selectedAvatar?.name
          }
          onSelect={(option) => {
            if (typeof option === "string") {
              onChange("avatarName", "");
            } else {
              onChange("avatarName", option.avatar_id);
            }
          }}
        />
      </Field>
      {selectedAvatar?.isCustom && (
        <Field label="Custom Avatar ID">
          <Input
            placeholder="Enter custom avatar ID"
            value={config.avatarName}
            onChange={(value) => onChange("avatarName", value)}
          />
        </Field>
      )}
      <Field label="Language">
        <Select
          isSelected={(option) => option.value === config.language}
          options={STT_LANGUAGE_LIST}
          renderOption={(option) => option.label}
          value={
            STT_LANGUAGE_LIST.find((option) => option.value === config.language)
              ?.label
          }
          onSelect={(option) => onChange("language", option.value)}
        />
      </Field>
      <Field label="Avatar Quality">
        <Select
          isSelected={(option) => option === config.quality}
          options={Object.values(AvatarQuality)}
          renderOption={(option) => option}
          value={config.quality}
          onSelect={(option) => onChange("quality", option)}
        />
      </Field>
      <Field label="Voice Chat Transport">
        <Select
          isSelected={(option) => option === config.voiceChatTransport}
          options={Object.values(VoiceChatTransport)}
          renderOption={(option) => option}
          value={config.voiceChatTransport}
          onSelect={(option) => onChange("voiceChatTransport", option)}
        />
      </Field>
      {showMore && (
        <>
          <h1 className="text-zinc-100 w-full text-center mt-5">
            Voice Settings
          </h1>
          <Field label="Custom Voice ID">
            <Input
              placeholder="Enter custom voice ID"
              value={config.voice?.voiceId}
              onChange={(value) =>
                onChange("voice", { ...config.voice, voiceId: value })
              }
            />
          </Field>
          <Field label="Emotion">
            <Select
              isSelected={(option) => option === config.voice?.emotion}
              options={Object.values(VoiceEmotion)}
              renderOption={(option) => option}
              value={config.voice?.emotion}
              onSelect={(option) =>
                onChange("voice", { ...config.voice, emotion: option })
              }
            />
          </Field>
          <Field label="ElevenLabs Model">
            <Select
              isSelected={(option) => option === config.voice?.model}
              options={Object.values(ElevenLabsModel)}
              renderOption={(option) => option}
              value={config.voice?.model}
              onSelect={(option) =>
                onChange("voice", { ...config.voice, model: option })
              }
            />
          </Field>
          <h1 className="text-zinc-100 w-full text-center mt-5">
            STT Settings
          </h1>
          <Field label="Provider">
            <Select
              isSelected={(option) => option === config.sttSettings?.provider}
              options={Object.values(STTProvider)}
              renderOption={(option) => option}
              value={config.sttSettings?.provider}
              onSelect={(option) =>
                onChange("sttSettings", {
                  ...config.sttSettings,
                  provider: option,
                })
              }
            />
          </Field>
        </>
      )}
      <button
        className="text-zinc-400 text-sm cursor-pointer w-full text-center bg-transparent"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show less" : "Show more..."}
      </button>
    </div>
  );
};



================================================
FILE: components/AvatarSession/AudioInput.tsx
================================================
import React from "react";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { LoadingIcon, MicIcon, MicOffIcon } from "../Icons";
import { useConversationState } from "../logic/useConversationState";

export const AudioInput: React.FC = () => {
  const { muteInputAudio, unmuteInputAudio, isMuted, isVoiceChatLoading } =
    useVoiceChat();
  const { isUserTalking } = useConversationState();

  const handleMuteClick = () => {
    if (isMuted) {
      unmuteInputAudio();
    } else {
      muteInputAudio();
    }
  };

  return (
    <div>
      <Button
        className={`!p-2 relative`}
        disabled={isVoiceChatLoading}
        onClick={handleMuteClick}
      >
        <div
          className={`absolute left-0 top-0 rounded-lg border-2 border-[#7559FF] w-full h-full ${isUserTalking ? "animate-ping" : ""}`}
        />
        {isVoiceChatLoading ? (
          <LoadingIcon className="animate-spin" size={20} />
        ) : isMuted ? (
          <MicOffIcon size={20} />
        ) : (
          <MicIcon size={20} />
        )}
      </Button>
    </div>
  );
};



================================================
FILE: components/AvatarSession/AvatarControls.tsx
================================================
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import React from "react";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { useInterrupt } from "../logic/useInterrupt";

import { AudioInput } from "./AudioInput";
import { TextInput } from "./TextInput";

export const AvatarControls: React.FC = () => {
  const {
    isVoiceChatLoading,
    isVoiceChatActive,
    startVoiceChat,
    stopVoiceChat,
  } = useVoiceChat();
  const { interrupt } = useInterrupt();

  return (
    <div className="flex flex-col gap-3 relative w-full items-center">
      <ToggleGroup
        className={`bg-zinc-700 rounded-lg p-1 ${isVoiceChatLoading ? "opacity-50" : ""}`}
        disabled={isVoiceChatLoading}
        type="single"
        value={isVoiceChatActive || isVoiceChatLoading ? "voice" : "text"}
        onValueChange={(value) => {
          if (value === "voice" && !isVoiceChatActive && !isVoiceChatLoading) {
            startVoiceChat();
          } else if (
            value === "text" &&
            isVoiceChatActive &&
            !isVoiceChatLoading
          ) {
            stopVoiceChat();
          }
        }}
      >
        <ToggleGroupItem
          className="data-[state=on]:bg-zinc-800 rounded-lg p-2 text-sm w-[90px] text-center"
          value="voice"
        >
          Voice Chat
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-zinc-800 rounded-lg p-2 text-sm w-[90px] text-center"
          value="text"
        >
          Text Chat
        </ToggleGroupItem>
      </ToggleGroup>
      {isVoiceChatActive || isVoiceChatLoading ? <AudioInput /> : <TextInput />}
      <div className="absolute top-[-70px] right-3">
        <Button className="!bg-zinc-700 !text-white" onClick={interrupt}>
          Interrupt
        </Button>
      </div>
    </div>
  );
};



================================================
FILE: components/AvatarSession/AvatarVideo.tsx
================================================
import React, { forwardRef } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";

import { useConnectionQuality } from "../logic/useConnectionQuality";
import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";
import { CloseIcon } from "../Icons";
import { Button } from "../Button";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({}, ref) => {
  const { sessionState, stopAvatar } = useStreamingAvatarSession();
  const { connectionQuality } = useConnectionQuality();

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;

  return (
    <>
      {connectionQuality !== ConnectionQuality.UNKNOWN && (
        <div className="absolute top-3 left-3 bg-black text-white rounded-lg px-3 py-2">
          Connection Quality: {connectionQuality}
        </div>
      )}
      {isLoaded && (
        <Button
          className="absolute top-3 right-3 !p-2 bg-zinc-700 bg-opacity-50 z-10"
          onClick={stopAvatar}
        >
          <CloseIcon />
        </Button>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <track kind="captions" />
      </video>
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
          Loading...
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";



================================================
FILE: components/AvatarSession/MessageHistory.tsx
================================================
import React, { useEffect, useRef } from "react";

import { useMessageHistory, MessageSender } from "../logic";

export const MessageHistory: React.FC = () => {
  const { messages } = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || messages.length === 0) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="w-[600px] overflow-y-auto flex flex-col gap-2 px-2 py-2 text-white self-center max-h-[150px]"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col gap-1 max-w-[350px] ${
            message.sender === MessageSender.CLIENT
              ? "self-end items-end"
              : "self-start items-start"
          }`}
        >
          <p className="text-xs text-zinc-400">
            {message.sender === MessageSender.AVATAR ? "Avatar" : "You"}
          </p>
          <p className="text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
};



================================================
FILE: components/AvatarSession/TextInput.tsx
================================================
import { TaskType, TaskMode } from "@heygen/streaming-avatar";
import React, { useCallback, useEffect, useState } from "react";
import { usePrevious } from "ahooks";

import { Select } from "../Select";
import { Button } from "../Button";
import { SendIcon } from "../Icons";
import { useTextChat } from "../logic/useTextChat";
import { Input } from "../Input";
import { useConversationState } from "../logic/useConversationState";

export const TextInput: React.FC = () => {
  const { sendMessage, sendMessageSync, repeatMessage, repeatMessageSync } =
    useTextChat();
  const { startListening, stopListening } = useConversationState();
  const [taskType, setTaskType] = useState<TaskType>(TaskType.TALK);
  const [taskMode, setTaskMode] = useState<TaskMode>(TaskMode.ASYNC);
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    if (message.trim() === "") {
      return;
    }
    if (taskType === TaskType.TALK) {
      taskMode === TaskMode.SYNC
        ? sendMessageSync(message)
        : sendMessage(message);
    } else {
      taskMode === TaskMode.SYNC
        ? repeatMessageSync(message)
        : repeatMessage(message);
    }
    setMessage("");
  }, [
    taskType,
    taskMode,
    message,
    sendMessage,
    sendMessageSync,
    repeatMessage,
    repeatMessageSync,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSend();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSend]);

  const previousText = usePrevious(message);

  useEffect(() => {
    if (!previousText && message) {
      startListening();
    } else if (previousText && !message) {
      stopListening();
    }
  }, [message, previousText, startListening, stopListening]);

  return (
    <div className="flex flex-row gap-2 items-end w-full">
      <Select
        isSelected={(option) => option === taskType}
        options={Object.values(TaskType)}
        renderOption={(option) => option.toUpperCase()}
        value={taskType.toUpperCase()}
        onSelect={setTaskType}
      />
      <Select
        isSelected={(option) => option === taskMode}
        options={Object.values(TaskMode)}
        renderOption={(option) => option.toUpperCase()}
        value={taskMode.toUpperCase()}
        onSelect={setTaskMode}
      />
      <Input
        className="min-w-[500px]"
        placeholder={`Type something for the avatar to ${taskType === TaskType.REPEAT ? "repeat" : "respond"}...`}
        value={message}
        onChange={setMessage}
      />
      <Button className="!p-2" onClick={handleSend}>
        <SendIcon size={20} />
      </Button>
    </div>
  );
};



================================================
FILE: components/logic/context.tsx
================================================
import StreamingAvatar, {
  ConnectionQuality,
  StreamingTalkingMessageEvent,
  UserTalkingMessageEvent,
} from "@heygen/streaming-avatar";
import React, { useRef, useState } from "react";

export enum StreamingAvatarSessionState {
  INACTIVE = "inactive",
  CONNECTING = "connecting",
  CONNECTED = "connected",
}

export enum MessageSender {
  CLIENT = "CLIENT",
  AVATAR = "AVATAR",
}

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
}

type StreamingAvatarContextProps = {
  avatarRef: React.MutableRefObject<StreamingAvatar | null>;
  basePath?: string;

  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  isVoiceChatLoading: boolean;
  setIsVoiceChatLoading: (isVoiceChatLoading: boolean) => void;
  isVoiceChatActive: boolean;
  setIsVoiceChatActive: (isVoiceChatActive: boolean) => void;

  sessionState: StreamingAvatarSessionState;
  setSessionState: (sessionState: StreamingAvatarSessionState) => void;
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;

  messages: Message[];
  clearMessages: () => void;
  handleUserTalkingMessage: ({
    detail,
  }: {
    detail: UserTalkingMessageEvent;
  }) => void;
  handleStreamingTalkingMessage: ({
    detail,
  }: {
    detail: StreamingTalkingMessageEvent;
  }) => void;
  handleEndMessage: () => void;

  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isUserTalking: boolean;
  setIsUserTalking: (isUserTalking: boolean) => void;
  isAvatarTalking: boolean;
  setIsAvatarTalking: (isAvatarTalking: boolean) => void;

  connectionQuality: ConnectionQuality;
  setConnectionQuality: (connectionQuality: ConnectionQuality) => void;
};

const StreamingAvatarContext = React.createContext<StreamingAvatarContextProps>(
  {
    avatarRef: { current: null },
    isMuted: true,
    setIsMuted: () => {},
    isVoiceChatLoading: false,
    setIsVoiceChatLoading: () => {},
    sessionState: StreamingAvatarSessionState.INACTIVE,
    setSessionState: () => {},
    isVoiceChatActive: false,
    setIsVoiceChatActive: () => {},
    stream: null,
    setStream: () => {},
    messages: [],
    clearMessages: () => {},
    handleUserTalkingMessage: () => {},
    handleStreamingTalkingMessage: () => {},
    handleEndMessage: () => {},
    isListening: false,
    setIsListening: () => {},
    isUserTalking: false,
    setIsUserTalking: () => {},
    isAvatarTalking: false,
    setIsAvatarTalking: () => {},
    connectionQuality: ConnectionQuality.UNKNOWN,
    setConnectionQuality: () => {},
  },
);

const useStreamingAvatarSessionState = () => {
  const [sessionState, setSessionState] = useState(
    StreamingAvatarSessionState.INACTIVE,
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  return {
    sessionState,
    setSessionState,
    stream,
    setStream,
  };
};

const useStreamingAvatarVoiceChatState = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVoiceChatLoading, setIsVoiceChatLoading] = useState(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);

  return {
    isMuted,
    setIsMuted,
    isVoiceChatLoading,
    setIsVoiceChatLoading,
    isVoiceChatActive,
    setIsVoiceChatActive,
  };
};

const useStreamingAvatarMessageState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const currentSenderRef = useRef<MessageSender | null>(null);

  const handleUserTalkingMessage = ({
    detail,
  }: {
    detail: UserTalkingMessageEvent;
  }) => {
    if (currentSenderRef.current === MessageSender.CLIENT) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          ...prev[prev.length - 1],
          content: [prev[prev.length - 1].content, detail.message].join(""),
        },
      ]);
    } else {
      currentSenderRef.current = MessageSender.CLIENT;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: MessageSender.CLIENT,
          content: detail.message,
        },
      ]);
    }
  };

  const handleStreamingTalkingMessage = ({
    detail,
  }: {
    detail: StreamingTalkingMessageEvent;
  }) => {
    if (currentSenderRef.current === MessageSender.AVATAR) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          ...prev[prev.length - 1],
          content: [prev[prev.length - 1].content, detail.message].join(""),
        },
      ]);
    } else {
      currentSenderRef.current = MessageSender.AVATAR;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: MessageSender.AVATAR,
          content: detail.message,
        },
      ]);
    }
  };

  const handleEndMessage = () => {
    currentSenderRef.current = null;
  };

  return {
    messages,
    clearMessages: () => {
      setMessages([]);
      currentSenderRef.current = null;
    },
    handleUserTalkingMessage,
    handleStreamingTalkingMessage,
    handleEndMessage,
  };
};

const useStreamingAvatarListeningState = () => {
  const [isListening, setIsListening] = useState(false);

  return { isListening, setIsListening };
};

const useStreamingAvatarTalkingState = () => {
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);

  return {
    isUserTalking,
    setIsUserTalking,
    isAvatarTalking,
    setIsAvatarTalking,
  };
};

const useStreamingAvatarConnectionQualityState = () => {
  const [connectionQuality, setConnectionQuality] = useState(
    ConnectionQuality.UNKNOWN,
  );

  return { connectionQuality, setConnectionQuality };
};

export const StreamingAvatarProvider = ({
  children,
  basePath,
}: {
  children: React.ReactNode;
  basePath?: string;
}) => {
  const avatarRef = React.useRef<StreamingAvatar>(null);
  const voiceChatState = useStreamingAvatarVoiceChatState();
  const sessionState = useStreamingAvatarSessionState();
  const messageState = useStreamingAvatarMessageState();
  const listeningState = useStreamingAvatarListeningState();
  const talkingState = useStreamingAvatarTalkingState();
  const connectionQualityState = useStreamingAvatarConnectionQualityState();

  return (
    <StreamingAvatarContext.Provider
      value={{
        avatarRef,
        basePath,
        ...voiceChatState,
        ...sessionState,
        ...messageState,
        ...listeningState,
        ...talkingState,
        ...connectionQualityState,
      }}
    >
      {children}
    </StreamingAvatarContext.Provider>
  );
};

export const useStreamingAvatarContext = () => {
  return React.useContext(StreamingAvatarContext);
};



================================================
FILE: components/logic/index.ts
================================================
export { useStreamingAvatarSession } from "./useStreamingAvatarSession";
export { useVoiceChat } from "./useVoiceChat";
export { useConnectionQuality } from "./useConnectionQuality";
export { useMessageHistory } from "./useMessageHistory";
export { useInterrupt } from "./useInterrupt";
export {
  StreamingAvatarSessionState,
  StreamingAvatarProvider,
  MessageSender,
} from "./context";



================================================
FILE: components/logic/useConnectionQuality.ts
================================================
import { useStreamingAvatarContext } from "./context";

export const useConnectionQuality = () => {
  const { connectionQuality } = useStreamingAvatarContext();

  return {
    connectionQuality,
  };
};



================================================
FILE: components/logic/useConversationState.ts
================================================
import { useCallback } from "react";

import { useStreamingAvatarContext } from "./context";

export const useConversationState = () => {
  const { avatarRef, isAvatarTalking, isUserTalking, isListening } =
    useStreamingAvatarContext();

  const startListening = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current.startListening();
  }, [avatarRef]);

  const stopListening = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current.stopListening();
  }, [avatarRef]);

  return {
    isAvatarListening: isListening,
    startListening,
    stopListening,
    isUserTalking,
    isAvatarTalking,
  };
};



================================================
FILE: components/logic/useInterrupt.ts
================================================
import { useCallback } from "react";

import { useStreamingAvatarContext } from "./context";

export const useInterrupt = () => {
  const { avatarRef } = useStreamingAvatarContext();

  const interrupt = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current.interrupt();
  }, [avatarRef]);

  return { interrupt };
};



================================================
FILE: components/logic/useMessageHistory.ts
================================================
import { useStreamingAvatarContext } from "./context";

export const useMessageHistory = () => {
  const { messages } = useStreamingAvatarContext();

  return { messages };
};



================================================
FILE: components/logic/useStreamingAvatarSession.ts
================================================
import StreamingAvatar, {
  ConnectionQuality,
  StartAvatarRequest,
  StreamingEvents,
} from "@heygen/streaming-avatar";
import { useCallback } from "react";

import {
  StreamingAvatarSessionState,
  useStreamingAvatarContext,
} from "./context";
import { useVoiceChat } from "./useVoiceChat";
import { useMessageHistory } from "./useMessageHistory";

export const useStreamingAvatarSession = () => {
  const {
    avatarRef,
    basePath,
    sessionState,
    setSessionState,
    stream,
    setStream,
    setIsListening,
    setIsUserTalking,
    setIsAvatarTalking,
    setConnectionQuality,
    handleUserTalkingMessage,
    handleStreamingTalkingMessage,
    handleEndMessage,
    clearMessages,
  } = useStreamingAvatarContext();
  const { stopVoiceChat } = useVoiceChat();

  useMessageHistory();

  const init = useCallback(
    (token: string) => {
      avatarRef.current = new StreamingAvatar({
        token,
        basePath: basePath,
      });

      return avatarRef.current;
    },
    [basePath, avatarRef],
  );

  const handleStream = useCallback(
    ({ detail }: { detail: MediaStream }) => {
      setStream(detail);
      setSessionState(StreamingAvatarSessionState.CONNECTED);
    },
    [setSessionState, setStream],
  );

  const stop = useCallback(async () => {
    avatarRef.current?.off(StreamingEvents.STREAM_READY, handleStream);
    avatarRef.current?.off(StreamingEvents.STREAM_DISCONNECTED, stop);
    clearMessages();
    stopVoiceChat();
    setIsListening(false);
    setIsUserTalking(false);
    setIsAvatarTalking(false);
    setStream(null);
    await avatarRef.current?.stopAvatar();
    setSessionState(StreamingAvatarSessionState.INACTIVE);
  }, [
    handleStream,
    setSessionState,
    setStream,
    avatarRef,
    setIsListening,
    stopVoiceChat,
    clearMessages,
    setIsUserTalking,
    setIsAvatarTalking,
  ]);

  const start = useCallback(
    async (config: StartAvatarRequest, token?: string) => {
      if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
        throw new Error("There is already an active session");
      }

      if (!avatarRef.current) {
        if (!token) {
          throw new Error("Token is required");
        }
        init(token);
      }

      if (!avatarRef.current) {
        throw new Error("Avatar is not initialized");
      }

      setSessionState(StreamingAvatarSessionState.CONNECTING);
      avatarRef.current.on(StreamingEvents.STREAM_READY, handleStream);
      avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, stop);
      avatarRef.current.on(
        StreamingEvents.CONNECTION_QUALITY_CHANGED,
        ({ detail }: { detail: ConnectionQuality }) =>
          setConnectionQuality(detail),
      );
      avatarRef.current.on(StreamingEvents.USER_START, () => {
        setIsUserTalking(true);
      });
      avatarRef.current.on(StreamingEvents.USER_STOP, () => {
        setIsUserTalking(false);
      });
      avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setIsAvatarTalking(true);
      });
      avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setIsAvatarTalking(false);
      });
      avatarRef.current.on(
        StreamingEvents.USER_TALKING_MESSAGE,
        handleUserTalkingMessage,
      );
      avatarRef.current.on(
        StreamingEvents.AVATAR_TALKING_MESSAGE,
        handleStreamingTalkingMessage,
      );
      avatarRef.current.on(StreamingEvents.USER_END_MESSAGE, handleEndMessage);
      avatarRef.current.on(
        StreamingEvents.AVATAR_END_MESSAGE,
        handleEndMessage,
      );

      await avatarRef.current.createStartAvatar(config);

      return avatarRef.current;
    },
    [
      init,
      handleStream,
      stop,
      setSessionState,
      avatarRef,
      sessionState,
      setConnectionQuality,
      setIsUserTalking,
      handleUserTalkingMessage,
      handleStreamingTalkingMessage,
      handleEndMessage,
      setIsAvatarTalking,
    ],
  );

  return {
    avatarRef,
    sessionState,
    stream,
    initAvatar: init,
    startAvatar: start,
    stopAvatar: stop,
  };
};



================================================
FILE: components/logic/useTextChat.ts
================================================
import { TaskMode, TaskType } from "@heygen/streaming-avatar";
import { useCallback } from "react";

import { useStreamingAvatarContext } from "./context";

export const useTextChat = () => {
  const { avatarRef } = useStreamingAvatarContext();

  const sendMessage = useCallback(
    (message: string) => {
      if (!avatarRef.current) return;
      avatarRef.current.speak({
        text: message,
        taskType: TaskType.TALK,
        taskMode: TaskMode.ASYNC,
      });
    },
    [avatarRef],
  );

  const sendMessageSync = useCallback(
    async (message: string) => {
      if (!avatarRef.current) return;

      return await avatarRef.current?.speak({
        text: message,
        taskType: TaskType.TALK,
        taskMode: TaskMode.SYNC,
      });
    },
    [avatarRef],
  );

  const repeatMessage = useCallback(
    (message: string) => {
      if (!avatarRef.current) return;

      return avatarRef.current?.speak({
        text: message,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.ASYNC,
      });
    },
    [avatarRef],
  );

  const repeatMessageSync = useCallback(
    async (message: string) => {
      if (!avatarRef.current) return;

      return await avatarRef.current?.speak({
        text: message,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
      });
    },
    [avatarRef],
  );

  return {
    sendMessage,
    sendMessageSync,
    repeatMessage,
    repeatMessageSync,
  };
};



================================================
FILE: components/logic/useVoiceChat.ts
================================================
import { useCallback } from "react";

import { useStreamingAvatarContext } from "./context";

export const useVoiceChat = () => {
  const {
    avatarRef,
    isMuted,
    setIsMuted,
    isVoiceChatActive,
    setIsVoiceChatActive,
    isVoiceChatLoading,
    setIsVoiceChatLoading,
  } = useStreamingAvatarContext();

  const startVoiceChat = useCallback(
    async (isInputAudioMuted?: boolean) => {
      if (!avatarRef.current) return;
      setIsVoiceChatLoading(true);
      await avatarRef.current?.startVoiceChat({
        isInputAudioMuted,
      });
      setIsVoiceChatLoading(false);
      setIsVoiceChatActive(true);
      setIsMuted(!!isInputAudioMuted);
    },
    [avatarRef, setIsMuted, setIsVoiceChatActive, setIsVoiceChatLoading],
  );

  const stopVoiceChat = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current?.closeVoiceChat();
    setIsVoiceChatActive(false);
    setIsMuted(true);
  }, [avatarRef, setIsMuted, setIsVoiceChatActive]);

  const muteInputAudio = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current?.muteInputAudio();
    setIsMuted(true);
  }, [avatarRef, setIsMuted]);

  const unmuteInputAudio = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current?.unmuteInputAudio();
    setIsMuted(false);
  }, [avatarRef, setIsMuted]);

  return {
    startVoiceChat,
    stopVoiceChat,
    muteInputAudio,
    unmuteInputAudio,
    isMuted,
    isVoiceChatActive,
    isVoiceChatLoading,
  };
};




================================================
FILE: styles/globals.css
================================================
@tailwind base;
@tailwind components;
@tailwind utilities;

li {
  list-style-type: square;
  margin-left: 30px;
  padding: 2px;
}


