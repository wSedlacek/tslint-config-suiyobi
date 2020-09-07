import { moduleSpecificArray, resolveRules, moduleSpecificObject } from './utils';

module.exports = {
  linterOptions: {
    exclude: ['node_modules/**', 'dist/**'],
  },
  rulesDirectory: moduleSpecificArray({
    common: [
      resolveRules('tslint-clean-code/dist/src'),
      resolveRules('tslint-config-suiyobi/microsoft'),
      resolveRules('tslint-config-suiyobi/eslint/rules'),
      resolveRules('tslint-config-suiyobi/sonarlint/rules'),
      resolveRules('tslint-config-suiyobi/consistent-codestyle/rules'),
    ],
    angular: [resolveRules('codelyzer')],
    ngrx: [resolveRules('tslint-config-suiyobi/ngrx/rules')],
    nx: [resolveRules('@nrwl/workspace/src/tslint')],
    override: [resolveRules('tslint-override/rules')],
    prettier: [resolveRules('tslint-plugin-prettier')],
    rxjs: [resolveRules('rxjs-tslint-rules/dist/rules')],
  }),
  rules: moduleSpecificObject({
    common: {
      // Without Prettier
      align: true,
      'array-bracket-spacing': true,
      'arrow-parens': true,
      'block-spacing': true,
      'brace-style': true,
      'conditional-expression-parens': true,
      eofline: true,
      'import-destructuring-spacing': true,
      'import-spacing': true,
      indent: true,
      'linebreak-style': true,
      'literal-spacing': true,
      'max-line-length': true,
      'multiline-arrow': true,
      'new-parens': true,
      'newline-per-chained-call': true,
      'no-empty-line-after-opening-brace': true,
      'no-extra-semi': true,
      'no-irregular-whitespace': true,
      'no-multi-spaces': true,
      'no-semicolon-interface': true,
      'no-trailing-whitespace': true,
      'no-unnecessary-parens-for-arrow-function-arguments': true,
      'no-unnecessary-semicolons': true,
      'number-literal-format': true,
      'object-curly-spacing': true,
      'object-literal-key-quotes': true,
      'one-line': true,
      quotemark: true,
      semicolon: true,
      'space-before-function-paren': true,
      'space-in-parens': true,
      'space-within-parens': true,
      'ter-arrow-parens': true,
      'ter-arrow-spacing': true,
      'ter-computed-property-spacing': true,
      'ter-func-call-spacing': true,
      'ter-indent': true,
      'ter-max-len': true,
      'ter-no-irregular-whitespace': true,
      'ter-no-tabs': true,
      'ter-padded-blocks': true,
      'trailing-comma': true,
      'type-literal-delimiter': true,
      'typedef-whitespace': true,
      whitespace: true,

      // AirBnB
      'object-shorthand-properties-first': true,
      'ter-prefer-arrow-callback': [true],
      'one-variable-per-declaration': [true, 'ignore-for-loop'],
      'no-else-after-return': true,

      // Netflix
      'no-conditional-assignment': true,

      // Custom
      'callable-types': true,
      'class-name': true,
      curly: false,
      forin: true,
      'import-blacklist': [true, 'rxjs/Rx'],
      'no-arg': true,
      'no-bitwise': true,
      'no-construct': true,
      'no-debugger': true,
      'no-duplicate-super': true,
      'no-empty-interface': true,
      'no-eval': true,
      'no-import-side-effect': false,
      'no-misused-new': true,
      'no-non-null-assertion': true,
      'no-string-throw': true,
      'no-switch-case-fall-through': true,
      'no-void-expression': [true, 'ignore-arrow-function-shorthand'],
      'no-unnecessary-initializer': true,
      'no-var-keyword': true,
      'prefer-const': true,
      'prefer-inline-decorator': false,
      radix: true,
      'unified-signatures': true,
      'no-unnecessary-class': [true, 'allow-constructor-only', 'allow-static-only', 'allow-empty-class'],
      'prefer-readonly': true,
      'adjacent-overload-signatures': [
        true,
        {
          'ignore-accessors': true,
        },
      ],
      'prefer-function-over-method': [true, 'allow-public', 'allow-protected'],
      'no-unbound-method': [true, 'ignore-static'],
      'no-invalid-this': [true, 'check-function-in-method'],
      'static-this': true,
      'prefer-method-signature': true,
      'invalid-void': [
        true,
        {
          'allow-generics': ['EventEmitter', 'Promise', 'Observable'],
        },
      ],
      'return-undefined': true,
      'arrow-return-shorthand': [true, 'multiline'],
      'no-unnecessary-callback-wrapper': true,
      'unnecessary-bind': true,
      'promise-function-async': true,
      'await-promise': false,
      'no-async-without-await': true,
      'no-promise-as-boolean': true,
      'no-shadowed-variable': [
        true,
        {
          temporalDeadZone: false,
        },
      ],
      'no-duplicate-variable': [true, 'check-parameters'],
      'no-require-imports': true,
      'no-default-import': true,
      'no-default-export': true,
      'no-reference': true,
      typedef: [true, 'call-signature', 'property-declaration'],
      'use-default-type-parameter': true,
      'no-angle-bracket-type-assertion': true,
      'no-unnecessary-type-assertion': true,
      'no-null-undefined-union': true,
      'no-string-literal': true,
      'no-invalid-template-strings': true,
      'strict-string-expressions': true,
      'strict-comparisons': [
        true,
        {
          'allow-object-equal-comparison': true,
          'allow-string-order-comparison': false,
        },
      ],
      'increment-decrement': [true, 'allow-post'],
      'restrict-plus-operands': true,
      'binary-expression-operand-order': true,
      'no-dynamic-delete': true,
      'use-isnan': true,
      'prefer-conditional-expression': [true, 'check-else-if'],
      'no-tautology-expression': true,
      'label-position': true,
      'unnecessary-else': [
        true,
        {
          'allow-else-if': true,
        },
      ],
      'strict-boolean-expressions': [true, 'allow-undefined-union', 'allow-string', 'allow-enum', 'allow-number', 'allow-mix', 'allow-rhs'],
      'no-for-in-array': true,
      'switch-default': true,
      'no-unsafe-finally': true,
      'cyclomatic-complexity': [true, 20],
      'max-file-line-count': [true, 400],
      'newline-before-return': true,
      'no-consecutive-blank-lines': [true, 1],
      'file-name-casing': [true, 'kebab-case'],
      'variable-name': false,
      'comment-type': [true, 'singleline', 'doc'],
      'jsdoc-format': [true, 'check-multiline-start'],
      'ban-ts-ignore': true,
      'no-console': [true, 'log', 'debug', 'info', 'time', 'timeEnd', 'trace'],
      'no-namespace': true,
      'no-unused-expression': [true, 'allow-fast-null-checks'],
      'no-sparse-arrays': true,

      // Core rules with custom configurations
      'array-type': [true, 'array'],
      'comment-format': [true, 'check-space'],
      deprecation: {
        severity: 'warn',
      },
      'function-name': [
        true,
        {
          'function-regex': /^[a-z$][\w\d]+$/,
          'method-regex': /^[a-z$][\w\d]+$/,
          'private-method-regex': /^[a-z$][\w\d]+$/,
          'protected-method-regex': /^[a-z$][\w\d]+$/,
          'static-method-regex': /^[a-z$][\w\d]+$/,
        },
      ],
      'interface-name': [true, 'always-prefix'],
      'member-ordering': [
        true,
        {
          alphabetize: true,
          order: [
            'public-constructor',
            'protected-constructor',
            'private-constructor',
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'public-static-method',
            'protected-static-method',
            'public-static-accessor',
            'protected-static-accessor',
            'private-static-method',
            'private-static-accessor',
            'public-instance-method',
            'protected-instance-method',
            'public-instance-accessor',
            'protected-instance-accessor',
            'private-instance-method',
            'private-instance-accessor',
          ],
        },
      ],
      'no-inferrable-types': [true, 'ignore-params'],
      'only-arrow-functions': [true, 'allow-declarations', 'allow-named-functions'],
      'ordered-imports': [
        true,
        {
          'grouped-imports': true,
          'import-sources-order': 'case-insensitive',
          'named-imports-order': 'case-insensitive',
        },
      ],
      'triple-equals': [true, 'allow-null-check'],

      // Core rules international disabled
      'completed-docs': false,
      'export-name': false,
      'max-classes-per-file': false,
      'no-empty': false,
      'no-floating-promises': false,
      'no-implicit-dependencies': false,
      'no-magic-numbers': false,
      'no-null-keyword': false,
      'no-submodule-imports': false,
      'no-unnecessary-qualifier': false,
      'no-unused-variable': false,
      'no-use-before-declare': false,
      'object-literal-sort-keys': false,
      'prefer-type-cast': false,
      'unnecessary-constructor': false,

      // tslint-microsoft-contrib rules enabled
      'ban-comma-operator': true,
      'chai-prefer-contains-to-index-of': true,
      'chai-vague-errors': true,
      'function-constructor': true,
      encoding: true,
      'import-name': true,
      'informative-docs': true,
      'insecure-random': true,
      'interface-over-type-literal': true,
      'jquery-deferred-must-complete': true,
      'max-func-body-length': true,
      'member-access': true,
      'missing-optional-annotation': true,
      'mocha-avoid-only': true,
      'mocha-unneeded-done': true,
      'no-any': true,
      'no-banned-terms': true,
      'no-boolean-literal-compare': true,
      'no-constant-condition': true,
      'no-control-regex': true,
      'no-cookies': true,
      'no-delete-expression': true,
      'no-disable-auto-sanitization': true,
      'no-document-domain': true,
      'no-document-write': true,
      'no-duplicate-imports': true,
      'no-duplicate-parameter-names': true,
      'no-duplicate-switch-case': true,
      'no-exec-script': true,
      'no-for-in': true,
      'no-function-expression': true,
      'no-http-string': true,
      'no-internal-module': true,
      'no-inner-html': true,
      'no-invalid-regexp': true,
      'no-jquery-raw-elements': true,
      'no-missing-visibility-modifiers': true,
      'no-multiple-var-decl': true,
      'no-object-literal-type-assertion': true,
      'no-octal-literal': true,
      'no-parameter-reassignment': true,
      'no-redundant-jsdoc': true,
      'no-regex-spaces': true,
      'no-return-await': true,
      'no-single-line-block-comment': true,
      'no-string-based-set-immediate': true,
      'no-string-based-set-interval': true,
      'no-suspicious-comment': true,
      'no-this-assignment': [true, 'allow-destructuring'],
      'no-typeof-undefined': true,
      'no-unsupported-browser-code': true,
      'no-unnecessary-override': true,
      'no-unnecessary-local-variable': true,
      'no-unnecessary-field-initialization': true,
      'no-useless-files': true,
      'no-with-statement': true,
      'non-literal-fs-path': true,
      'non-literal-require': true,
      'object-literal-shorthand': true,
      'possible-timing-attack': true,
      'prefer-array-literal': true,
      'prefer-for-of': true,
      'prefer-object-spread': true,
      'prefer-switch': false,
      'prefer-template': true,
      'promise-must-complete': true,
      'strict-type-predicates': true,
      'switch-final-break': true,
      'underscore-consistent-invocation': true,
      'void-zero': true,
      'use-named-parameter': true,
      'use-simple-attributes': true,

      // tslint-microsoft-contrib rules disabled
      'missing-jsdoc': false,
      'no-duplicate-case': false,
      'no-multiline-string': false,
      'no-relative-imports': false,
      'no-reserved-keywords': false,
      'no-stateless-class': false,
      'no-unexternalized-strings': false,
      'no-var-self': false,
      'valid-typeof': false,
      'mocha-no-side-effect-code': false,
      'no-string-based-set-timeout': false,

      // tslint-sonarlint disabled rules
      'no-useless-cast': false,

      // tslint-sonarlint enabled rules
      'arguments-order': true,
      'bool-param-default': true,
      'cognitive-complexity': true,
      'consecutive-overloads': true,
      'max-switch-cases': true,
      'max-union-size': true,
      'mccabe-complexity': false,
      'no-accessor-field-mismatch': true,
      'no-all-duplicated-branches': true,
      'no-alphabetical-sort': true,
      'no-array-delete': true,
      'no-big-function': true,
      'no-case-with-or': true,
      'no-collapsible-if': true,
      'no-collection-size-mischeck': true,
      'no-commented-code': true,
      'no-dead-store': true,
      'no-duplicate-in-composite': true,
      'no-duplicate-string': true,
      'no-duplicated-branches': true,
      'no-element-overwrite': true,
      'no-empty-array': true,
      'no-empty-destructuring': true,
      'no-empty-nested-blocks': false,
      'no-extra-semicolon': true,
      'no-gratuitous-expressions': true,
      'no-hardcoded-credentials': true,
      'no-identical-conditions': true,
      'no-identical-expressions': true,
      'no-identical-functions': true,
      'no-ignored-initial-value': true,
      'no-ignored-return': true,
      'no-in-misuse': true,
      'no-inconsistent-return': false,
      'no-invalid-await': true,
      'no-invariant-return': true,
      'no-inverted-boolean-check': true,
      'no-misleading-array-reverse': true,
      'no-misspelled-operator': true,
      'no-multiline-string-literals': true,
      'no-nested-incdec': false,
      'no-nested-switch': true,
      'no-nested-template-literals': true,
      'no-redundant-boolean': true,
      'no-redundant-jump': true,
      'no-redundant-parentheses': true,
      'no-return-type-any': true,
      'no-same-line-conditional': true,
      'no-self-assignment': true,
      'no-small-switch': true,
      'no-statements-same-line': true,
      'no-try-promise': true,
      'no-unconditional-jump': true,
      'no-undefined-argument': true,
      'no-unenclosed-multiline-block': true,
      'no-unthrown-error': true,
      'no-unused-array': true,
      'no-use-of-empty-return-value': true,
      'no-useless-catch': true,
      'no-useless-increment': true,
      'no-useless-intersection': true,
      'no-variable-usage-before-declaration': true,
      'parameters-max-number': true,
      'prefer-default-last': true,
      'prefer-immediate-return': true,
      'prefer-optional': true,
      'prefer-promise-shorthand': true,
      'prefer-type-guard': true,
      'use-primitive-type': true,
      'use-type-alias': true,

      // Consistent Codestyle international disabled
      'no-as-type-assertion': false,

      // Consistent Codestyle with custom configurations
      'no-unused': [true, 'unused-class-expression-name', 'unused-function-expression-name', 'unused-catch-binding'],
      'ext-curly': [true, 'else', 'nested-if-else', 'braced-child'],
      'naming-convention': [
        true,
        {
          type: 'default',
          format: 'camelCase',
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          type: 'variable',
          modifiers: ['global', 'const'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          type: 'parameter',
          modifiers: 'unused',
          leadingUnderscore: 'allow',
        },
        {
          type: 'variable',
          modifiers: 'unused',
          leadingUnderscore: 'allow',
        },
        {
          type: 'member',
          modifiers: 'private',
          leadingUnderscore: 'forbid',
        },
        {
          type: 'member',
          modifiers: 'protected',
          leadingUnderscore: 'forbid',
        },
        {
          type: 'property',
          modifiers: ['public', 'static', 'const'],
          format: 'UPPER_CASE',
        },
        { type: 'type', format: 'PascalCase' },
        { type: 'class', modifiers: 'abstract', prefix: 'Abstract' },
        { type: 'interface', prefix: 'I' },
        { type: 'genericTypeParameter', regex: '^[A-Z]$' },
        { type: 'enumMember', format: 'PascalCase' },
      ],
      'no-return-undefined': [true, 'allow-void-expression'],
      'parameter-properties': [true, 'leading', 'member-access'],

      // Consistent Codestyle enabled
      'no-accessor-recursion': true,
      'no-unnecessary-type-annotation': true,
      'no-var-before-return': true,
      'prefer-const-enum': true,
      'prefer-while': true,

      // Clean Code international disabled
      'min-class-cohesion': false,
      'newspaper-order': false,
      'no-feature-envy': false,
      'id-length': false,

      // Clean Code enabled
      'max-func-args': true,
      'no-complex-conditionals': true,
      'no-flag-args': true,
      'no-for-each-push': true,
      'prefer-dry-conditionals': true,
      'try-catch-first': true,
    },
    angular: {
      'directive-selector': [true, 'attribute', 'app', 'camelCase'],
      'component-selector': [true, 'element', 'app', 'kebab-case'],
      'no-host-metadata-property': true,
      'no-input-rename': true,
      'no-inputs-metadata-property': true,
      'no-output-native': true,
      'no-output-on-prefix': true,
      'no-output-rename': true,
      'no-outputs-metadata-property': true,
      'template-banana-in-box': true,
      'use-lifecycle-interface': true,
      'use-pipe-transform-interface': true,
      'contextual-lifecycle': true,
      'contextual-decorator': true,
      'no-pipe-impure': true,
      'template-no-negated-async': true,
      'template-i18n': [true, 'check-id', 'check-text'],
      'component-max-inline-declarations': true,
      'no-attribute-decorator': true,
      'no-conflicting-lifecycle': true,
      'no-forward-ref': true,
      'no-lifecycle-call': true,
      'template-no-call-expression': true,
      'no-unused-css': true,
      'prefer-output-readonly': true,
      'template-conditional-complexity': true,
      'template-cyclomatic-complexity': true,
      'template-use-track-by-function': true,
      'use-pipe-decorator': true,
      'use-component-view-encapsulation': true,
      'component-class-suffix': true,
      'directive-class-suffix': true,
      'no-queries-metadata-property': true,
      'template-accessibility-alt-text': true,
      'template-accessibility-elements-content': true,
      'template-accessibility-label-for': true,
      'template-accessibility-tabindex-no-positive': true,
      'template-accessibility-table-scope': true,
      'template-accessibility-valid-aria': true,
      'template-click-events-have-key-events': true,
      'template-mouse-events-have-key-events': true,
      'template-no-any': true,
      'template-no-autofocus': true,
      'template-no-distracting-elements': true,
    },
    ngrx: {
      'ngrx-action-hygiene': {
        severity: 'warning',
      },
      'ngrx-avoid-dispatching-multiple-actions-sequentially': {
        severity: 'warning',
      },
      'ngrx-effect-creator-and-decorator': {
        severity: 'error',
      },
      'ngrx-no-dispatch-in-effects': {
        severity: 'warning',
      },
      'ngrx-no-duplicate-action-types': {
        severity: 'error',
      },
      'ngrx-no-effect-decorator': {
        severity: 'warning',
      },
      'ngrx-no-effects-in-providers': {
        severity: 'error',
      },
      'ngrx-no-multiple-actions-in-effects': {
        severity: 'warning',
      },
      'ngrx-no-multiple-stores': {
        severity: 'warning',
      },
      'ngrx-no-reducer-in-key-names': {
        severity: 'warning',
      },
      'ngrx-no-typed-store': {
        severity: 'warning',
      },
      'ngrx-selector-for-select': {
        severity: 'error',
      },
    },
    nx: {
      'nx-enforce-module-boundaries': [
        true,
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
          enforceBuildableLibDependency: true,
        },
      ],
    },
    override: {
      'explicit-override': [true, 'decorator', 'pascal-case-fixer', 'new-line-after-decorators-and-tags', 'angular-syntax-fixer'],
    },
    react: {
      'react-a11y-accessible-headings': true,
      'react-a11y-anchors': true,
      'react-a11y-aria-unsupported-elements': true,
      'react-a11y-event-has-role': true,
      'react-a11y-iframes': true,
      'react-a11y-image-button-has-alt': true,
      'react-a11y-img-has-alt': true,
      'react-a11y-input-elements': true,
      'react-a11y-lang': true,
      'react-a11y-meta': true,
      'react-a11y-mouse-event-has-key-event': true,
      'react-a11y-no-onchange': true,
      'react-a11y-props': true,
      'react-a11y-proptypes': true,
      'react-a11y-required': true,
      'react-a11y-role-has-required-aria-props': true,
      'react-a11y-role-supports-aria-props': true,
      'react-a11y-role': true,
      'react-a11y-tabindex-no-positive': true,
      'react-a11y-titles': true,
      'react-anchor-blank-noopener': true,
      'react-iframe-missing-sandbox': true,
      'react-no-dangerous-html': true,
      'react-this-binding-issue': true,
      'react-tsx-curly-spacing': true,
      'react-unused-props-and-state': true,
    },
    rxjs: {
      'jsx-alignment': true,
      'jsx-attribute-spacing': true,
      'jsx-curly-spacing': true,
      'jsx-equals-spacing': true,
      'jsx-expression-spacing': true,
      'jsx-no-closing-bracket-newline': true,
      'jsx-no-multiline-js': true,
      'jsx-space-before-trailing-slash': true,
      'jsx-wrap-multiline': true,
      'rxjs-prefer-angular-async-pipe': true,
      'rxjs-prefer-angular-composition': true,
      'rxjs-no-ignored-subscription': true,
      'rxjs-no-implicit-any-catch': true,
      'rxjs-no-redundant-notify': true,
      'rxjs-no-index': true,
      'rxjs-no-internal': true,
      'rxjs-no-nested-subscribe': true,
      'rxjs-no-unsafe-catch': { severity: 'error' },
      'rxjs-no-unsafe-first': { severity: 'error' },
      'rxjs-no-unsafe-switchmap': { severity: 'error' },
    },
    prettier: {
      prettier: true,
      align: false,
      'array-bracket-spacing': false,
      'arrow-parens': false,
      'block-spacing': false,
      'brace-style': false,
      'conditional-expression-parens': false,
      eofline: false,
      'import-destructuring-spacing': false,
      'import-spacing': false,
      indent: false,
      'jsx-alignment': false,
      'jsx-attribute-spacing': false,
      'jsx-curly-spacing': false,
      'jsx-equals-spacing': false,
      'jsx-expression-spacing': false,
      'jsx-no-closing-bracket-newline': false,
      'jsx-no-multiline-js': false,
      'jsx-space-before-trailing-slash': false,
      'jsx-wrap-multiline': false,
      'linebreak-style': false,
      'literal-spacing': false,
      'max-line-length': false,
      'multiline-arrow': false,
      'new-parens': false,
      'newline-per-chained-call': false,
      'no-empty-line-after-opening-brace': false,
      'no-extra-semi': false,
      'no-irregular-whitespace': false,
      'no-multi-spaces': false,
      'no-semicolon-interface': false,
      'no-trailing-whitespace': false,
      'no-unnecessary-parens-for-arrow-function-arguments': false,
      'no-unnecessary-semicolons': false,
      'number-literal-format': false,
      'object-curly-spacing': false,
      'object-literal-key-quotes': false,
      'one-line': false,
      quotemark: false,
      'react-tsx-curly-spacing': false,
      semicolon: false,
      'space-before-function-paren': false,
      'space-in-parens': false,
      'space-within-parens': false,
      'ter-arrow-parens': false,
      'ter-arrow-spacing': false,
      'ter-computed-property-spacing': false,
      'ter-func-call-spacing': false,
      'ter-indent': false,
      'ter-max-len': false,
      'ter-no-irregular-whitespace': false,
      'ter-no-tabs': false,
      'ter-padded-blocks': false,
      'trailing-comma': false,
      'type-literal-delimiter': false,
      'typedef-whitespace': false,
      whitespace: false,
    },
  }),
  jsRules: moduleSpecificObject({
    prettier: {
      align: false,
      'array-bracket-spacing': false,
      'arrow-parens': false,
      'block-spacing': false,
      'brace-style': false,
      'conditional-expression-parens': false,
      eofline: false,
      'import-destructuring-spacing': false,
      'import-spacing': false,
      indent: false,
      'jsx-alignment': false,
      'jsx-attribute-spacing': false,
      'jsx-curly-spacing': false,
      'jsx-equals-spacing': false,
      'jsx-expression-spacing': false,
      'jsx-no-closing-bracket-newline': false,
      'jsx-no-multiline-js': false,
      'jsx-space-before-trailing-slash': false,
      'jsx-wrap-multiline': false,
      'linebreak-style': false,
      'literal-spacing': false,
      'multiline-arrow': false,
      'no-consecutive-blank-lines': false,
      'no-empty-line-after-opening-brace': false,
      'no-extra-semi': false,
      'no-irregular-whitespace': false,
      'no-multi-spaces': false,
      'no-semicolon-interface': false,
      'no-trailing-whitespace': false,
      'no-unnecessary-parens-for-arrow-function-arguments': false,
      'no-unnecessary-semicolons': false,
      'object-curly-spacing': false,
      'object-literal-key-quotes': false,
      quotemark: false,
      'react-tsx-curly-spacing': false,
      semicolon: false,
      'space-before-function-paren': false,
      'space-in-parens': false,
      'space-within-parens': false,
      'ter-arrow-parens': false,
      'ter-arrow-spacing': false,
      'ter-computed-property-spacing': false,
      'ter-func-call-spacing': false,
      'ter-indent': false,
      'ter-max-len': false,
      'ter-no-irregular-whitespace': false,
      'ter-no-tabs': false,
      'ter-padded-blocks': false,
      'trailing-comma': false,
      'type-literal-delimiter': false,
      'typedef-whitespace': false,
      whitespace: false,
    },
  }),
};
