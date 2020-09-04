import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('importNameRule', (): void => {
  const ruleName: string = 'import-name';

  it('should pass on matching names of external module', (): void => {
    const script: string = `
            import App = require('App');
            import App = require('x/y/z/App');
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  it('should pass on matching names of simple import', (): void => {
    const script: string = `
            import DependencyManager = DM.DependencyManager;
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  it('should fail on misnamed external module', (): void => {
    const script: string = `
            import MyCoolApp = require('App');
            import MyCoolApp2 = require('x/y/z/App');
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: "Misnamed import. Import should be named 'App' but found 'MyCoolApp'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'import-name',
        startPosition: { character: 13, line: 2 },
        fix: {
          innerStart: 20,
          innerLength: 9,
          innerText: 'App',
        },
      },
      {
        failure: "Misnamed import. Import should be named 'App' but found 'MyCoolApp2'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'import-name',
        startPosition: { character: 13, line: 3 },
        fix: {
          innerStart: 67,
          innerLength: 10,
          innerText: 'App',
        },
      },
    ]);
  });

  it('should fail on misnamed import', (): void => {
    const script: string = `
            import MyCoolApp from 'App';
            import MyCoolApp2 from 'x/y/z/App';
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: "Misnamed import. Import should be named 'App' but found 'MyCoolApp'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'import-name',
        startPosition: { character: 13, line: 2 },
        fix: {
          innerStart: 20,
          innerLength: 9,
          innerText: 'App',
        },
      },
      {
        failure: "Misnamed import. Import should be named 'App' but found 'MyCoolApp2'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'import-name',
        startPosition: { character: 13, line: 3 },
        fix: {
          innerStart: 61,
          innerLength: 10,
          innerText: 'App',
        },
      },
    ]);
  });

  it('should fail on misnamed rename', (): void => {
    const script: string = `
            import Service = DM.DependencyManager;
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: "Misnamed import. Import should be named 'DependencyManager' but found 'Service'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'import-name',
        startPosition: { character: 13, line: 2 },
        fix: {
          innerStart: 20,
          innerLength: 7,
          innerText: 'DependencyManager',
        },
      },
    ]);
  });

  it('should pass on differing names when rule is configured with replacements', (): void => {
    const script: string = `
            import Backbone = require('backbone');
            import React = require('react');
            import isPlainObject from 'is-plain-object';
            import baseChartOptions = require('common/component/chart/options/BaseChartOptions');
        `;

    const options = [
      true,
      {
        backbone: 'Backbone',
        react: 'React',
        'is-plain-object': 'isPlainObject',
        BaseChartOptions: 'baseChartOptions',
      },
    ];
    TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
  });

  it('should pass on differing names when rule is configured with replacements for ES6', (): void => {
    const script: string = `
        import pkg from 'fs/package-name',
        import abc from 'abc-tag',
        import pqr from 'my-module'
        `;
    const options = [
      true,
      {
        'fs/package-name': 'pkg',
        'abc-tag': 'abc',
        myModule: 'pqr',
      },
    ];
    TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
  });

  it('should pass on ignoring modules from ignoredList(string[] from third argument)', (): void => {
    const script: string = `
        import pkg from 'fs/package-name',
        import abc from 'abc-tag',
        import pqr from 'my-module'
        import what from 'what-module'
        import Up from 'up-module'
        `;
    const options = [
      true,
      {
        'fs/package-name': 'pkg',
        'abc-tag': 'abc',
        myModule: 'pqr',
      },
      ['what-module', 'up-module'],
    ];
    TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
  });

  it('should pass on ignoring third argument value other than string[]', (): void => {
    const script: string = `
        import pkg from 'fs/package-name',
        import abc from 'abc-tag',
        import pqr from 'my-module'
        import what from 'what-module'
        import Up from 'up-module'
        `;
    const options = [
      true,
      {
        'fs/package-name': 'pkg',
        'abc-tag': 'abc',
        myModule: 'pqr',
      },
      [123, { whatever: 'object' }],
    ];
    TestHelper.assertViolationsWithOptions(ruleName, options, script, [
      {
        failure: "Misnamed import. Import should be named 'whatModule' but found 'what'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'import-name',
        startPosition: { character: 9, line: 5 },
        fix: {
          innerStart: 130,
          innerLength: 4,
          innerText: 'whatModule',
        },
      },
      {
        failure: "Misnamed import. Import should be named 'upModule' but found 'Up'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'import-name',
        startPosition: { character: 9, line: 6 },
        fix: {
          innerStart: 169,
          innerLength: 2,
          innerText: 'upModule',
        },
      },
    ]);
  });

  it('should pass on index path modules', () => {
    const script = `
            import AnyName = require('.');
            import AnyName = require('..');
            import AnyName = require('./');
            import AnyName = require('../');
            import AnyName = require('../path/./..');
            import AnyName = require('../../..');
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  it('should pass on index path ES6 modules', () => {
    const script = `
            import AnyName from '.';
            import AnyName from '..';
            import AnyName from './';
            import AnyName from '../';
            import AnyName from '../path/./..';
            import AnyName from '../../..';
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  it('should pass on importing modules without a name', () => {
    const script = `
            import 'mocha';
            import '../../path';
            import './polyfills';
            import 'rxjs/add/operator/switchMap';
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });
  describe('caseSensetive', (): void => {
    describe('camelCase', (): void => {
      it('should pass on matching names of ES6 import', (): void => {
        const script: string = `
                    import App from 'App';
                    import App from 'x/y/z/App';
                    import graphqlTag from 'graphql-tag'
                `;

        const options = [
          true,
          {},
          {},
          {
            case: 'camelCase',
          },
        ];

        TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
      });

      it('should fail import with punctuation and underscore', (): void => {
        const script: string = `
                    import UserSettings from "./user-settings.detail_view";
                `;

        const options = [
          true,
          {},
          {},
          {
            case: 'camelCase',
          },
        ];

        TestHelper.assertViolationsWithOptions(ruleName, options, script, [
          {
            failure: "Misnamed import. Import should be named 'userSettingsDetailView' but found 'UserSettings'",
            name: Utils.absolutePath('file.ts'),
            ruleName: 'import-name',
            startPosition: { character: 21, line: 2 },
            fix: {
              innerStart: 28,
              innerLength: 12,
              innerText: 'userSettingsDetailView',
            },
          },
        ]);
      });
    });

    describe('pascalCase', (): void => {
      it('should pass on matching names of ES6 import', (): void => {
        const script: string = `
                    import App from 'App';
                    import App from 'x/y/z/App';
                    import GraphqlTag from 'graphql-tag'
                `;

        const options = [
          true,
          {},
          {},
          {
            case: 'PascalCase',
          },
        ];

        TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
      });

      it('should fail import with punctuation and underscore', (): void => {
        const script: string = `
                    import UserSettings from "./user-settings.detail_view";
                `;

        const options = [
          true,
          {},
          {},
          {
            case: 'PascalCase',
          },
        ];

        TestHelper.assertViolationsWithOptions(ruleName, options, script, [
          {
            failure: "Misnamed import. Import should be named 'UserSettingsDetailView' but found 'UserSettings'",
            name: Utils.absolutePath('file.ts'),
            ruleName: 'import-name',
            startPosition: { character: 21, line: 2 },
            fix: {
              innerStart: 28,
              innerLength: 12,
              innerText: 'UserSettingsDetailView',
            },
          },
        ]);
      });
    });

    describe('any-case', () => {
      it('should pass on PascalCase and camelCase', () => {
        const script: string = `
                    import App from 'app';
                    import app from 'app';
                    import App from 'x/y/z/App';
                    import GraphqlTag from 'x/y/z/graphql-tag';
                    import graphqlTag from 'x/y/z/graphql-tag';
                `;
        const options = [true, {}, {}, { case: 'any-case' }];
        TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
      });

      it('should fail', () => {
        const script: string = `
                    import gTag from 'x/y/z/graphql-tag';
                `;
        const options = [true, {}, {}, { case: 'any-case' }];
        TestHelper.assertViolationsWithOptions(ruleName, options, script, [
          {
            failure: "Misnamed import. Import should be named 'graphqlTag' or 'GraphqlTag' but found 'gTag'",
            fix: {
              innerStart: 28,
              innerLength: 4,
              innerText: 'graphqlTag',
            },
            name: Utils.absolutePath('file.ts'),
            ruleName: 'import-name',
            ruleSeverity: 'ERROR',
            startPosition: {
              character: 21,
              line: 2,
            },
          },
        ]);
      });
    });
  });
});
