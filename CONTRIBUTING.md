# Contributing Guide

Thank you for considering a contribution to Atmos.

## How to contribute

You can help in several ways:

- reporting bugs
- suggesting UX/UI improvements
- proposing architecture refactors
- improving documentation
- adding reliability and test improvements

## Prerequisites

- Node.js (optional, only for `npx serve` local hosting)
- Python 3 (optional alternative local server)
- Git

## Local setup

```bash
git clone git@github.com:NullCipherr/Atmos-Weather-Visualizer.git
cd Atmos-Weather-Visualizer
python3 -m http.server 5500
```

## Recommended workflow

1. Fork the repository.
2. Create a descriptive branch:

```bash
git checkout -b feat/your-improvement-name
```

3. Keep changes small and focused.
4. Validate behavior on desktop and mobile.
5. Open a Pull Request with clear technical context.

## Commit convention

We prefer Conventional Commits:

- `feat: ...`
- `fix: ...`
- `style: ...`
- `refactor: ...`
- `docs: ...`
- `chore: ...`

## Approval criteria

- no visual/functional regressions
- clear and maintainable code
- basic accessibility standards respected
- updated documentation when needed

## Pull Request checklist

- [ ] Change scope is clear.
- [ ] Core impacted flows were manually tested.
- [ ] No secrets were introduced.
- [ ] README/docs were updated when needed.
- [ ] Visual consistency with the project was preserved.

## Questions

Open an issue using the templates in `.github/ISSUE_TEMPLATE`.
