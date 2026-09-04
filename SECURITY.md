# Security Policy

## Supported versions

Security fixes are released for the latest published minor of `@aitho/ui`. Older
minors are not patched; upgrade to the latest release before reporting an issue.

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Report it privately through GitHub's [private vulnerability
reporting](https://github.com/AITHO/aitho-design-ui/security/advisories/new), or
by email to **security@aitho.it**.

Include, where possible:

- the affected version of `@aitho/ui`;
- a description of the impact and how it can be triggered;
- a minimal reproduction (component, props, browser).

We aim to acknowledge a report within 5 working days and to agree a disclosure
timeline with the reporter. Please give us a reasonable window to ship a fix
before disclosing publicly.

## Scope

This is a browser-side component library: it renders UI and holds no
credentials, no server code and no persistent storage. The most relevant classes
of issue are therefore XSS through unescaped props or `dangerouslySetInnerHTML`,
prototype pollution in prop merging, and vulnerable transitive dependencies.
