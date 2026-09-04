# Aitho Design UI

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@aitho/ui.svg)](https://www.npmjs.com/package/@aitho/ui)

A React component library built with TypeScript, [Radix UI](https://www.radix-ui.com/)
primitives and [Panda CSS](https://panda-css.com/). It ships around forty
accessible components — form controls, overlays, date pickers, tables,
navigation — with a light and dark theme out of the box.

- **Documentation:** the Storybook, published from `main`, is the reference for
  every component and its props.
- **License:** Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

## Requirements

- Node.js 22.x (for local development)
- React 18 or 19, and the matching `react-dom` (declared as peer dependencies)

## Installation

```bash
npm install @aitho/ui
```

## Usage

Wrap your application in `ThemeProvider`, then import the components you need.
The styles are bundled with the components, so there is no CSS file to import.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@aitho/ui";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
```

```tsx
import { Button, Input, Label } from "@aitho/ui";

export function SignInForm() {
  return (
    <form>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

`ToastProvider` and `useToast` are available for notifications, and `useTheme`
reads or switches the active theme. Every component is exported from the package
root; see the Storybook for the full list.

## Development

```bash
npm ci             # install dependencies
npm run storybook  # component workbench on http://localhost:6006
npm run build      # panda codegen + tsc + vite build
npm run lint       # eslint
npm run format     # prettier --check
npm run test:coverage:ci
```

New components are best scaffolded with the generator, which wires up the
recipe, the story and the test file for you:

```bash
npm run component:new
```

[CONTRIBUTING.md](CONTRIBUTING.md) documents the component anatomy, the naming
conventions and the review flow in detail.

## Contributing

Issues and pull requests are welcome. Please read
[CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md) first, and report security problems
privately as described in [SECURITY.md](SECURITY.md).

Contributions are accepted under the Apache License 2.0: by opening a pull
request you agree that your contribution is licensed under those terms.

## Trademarks

The Apache License covers the code, not the brand. "Aitho", the Aitho name and
the logo files under `assets/` are trademarks of Aitho and are not licensed for
use in forks or derivative works — replace them with your own branding.
