# TSLint Config Suiyobi

## Installation

```sh
yarn add -D tslint-config-suiyobi
```

## Usage

In `tslint.json`

```json
{
  "extends": "tslint-config-suiyobi"
}
```

## Dynamic Rule Sets

This configuration checks what modules are installed then applies only valid rules and rule dictionaries ensuring that you will not encounter warnings about what is not installed.

Supported modules are

- `@angular/core` and `codelyzer`
- `@ngrx/store`
- `@nrwl/nx`
- `prettier`
- `react` (WIP)
- `rxjs`
- `tslint-override`

### LTS

Microsoft and other projects have chosen to move way from TSLint towards ESLint however in the Angular land that doesn't work very well at this time.
I have chosen for Angular to continue using TSLint and attempt to keep this library up to date even if other libraries do not.
I will go as far as making PRs into other libraries or forking their code into this repo in order to keep these rules working until Angular fully switches over to ESLint
