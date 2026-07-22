# React + Vite

## End-to-end tests

The Playwright suite covers sign-in, every page route, tenant dashboard data,
notification updates, guest inquiries, request approval, tenant creation, and
risk refresh. API responses are mocked at the browser network boundary so the
tests are repeatable and never alter development or Supabase data. The test
command starts the Vite application automatically.

Install Chromium once after installing dependencies:

```sh
npx playwright install chromium
```

Run the end-to-end suite:

```sh
npm run test:e2e
```

For local development, use `npm run test:e2e:ui` to open Playwright's UI or
`npm run test:e2e:debug` to step through a test. Failure screenshots, videos,
and traces are written to ignored Playwright artifact directories.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
