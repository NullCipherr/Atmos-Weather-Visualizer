# Security Policy

## Supported versions

Currently, only the latest `main` branch is supported for security fixes.

| Version | Supported |
| --- | --- |
| `main` | ✅ |
| older versions | ❌ |

## Reporting vulnerabilities

If you identify a vulnerability, avoid opening a fully public issue with exploit details.

Please send a responsible report with:

- issue description
- potential impact
- reproduction steps
- fix suggestion (optional)

Recommended channel: open a minimal public issue and request private contact with maintainers.

## Security best practices in this project

- do not commit secrets
- validate user input
- avoid unsafe HTML interpolation
- review dependencies and deployment infrastructure

## Important note

This is a static front-end project. In production, consider moving sensitive API integration to backend/edge when secrecy is required.
