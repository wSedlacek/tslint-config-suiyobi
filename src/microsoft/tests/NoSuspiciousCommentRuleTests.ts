/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noSuspiciousCommentRule', (): void => {
  const ruleName: string = 'no-suspicious-comment';
  const option: string[] = ['https://example.com/*'];

  it('should pass on normal comments', (): void => {
    const script: string = `
            // this comment is not suspicious
        `;

    TestHelper.assertViolations(ruleName, script, []);
    TestHelper.assertViolationsWithOptions(ruleName, option, script, []);
  });

  it('should pass on multi-line comments', (): void => {
    const script: string = `
             /**
             * This comment
             * is not suspicious.
             */
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  it('should pass on TODOlike comments', (): void => {
    const script: string = `
             /**
             * This comment
             * is not suspicious, even if it contains the word TODOlike.
             */
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  it('should fail on multiline TODO comments', (): void => {
    const script: string = `
            /**
            * TODO: add failing example and update assertions
            */
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: 'Suspicious comment found: TODO',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-suspicious-comment',
        startPosition: { character: 13, line: 2 },
      },
    ]);
  });

  it('should pass on multiline TODO comments with regex option', (): void => {
    const script: string = `
            /**
            * TODO: add failing example and update assertions
            * See https://example.com/article/123
            */
        `;

    TestHelper.assertViolationsWithOptions(ruleName, option, script, []);
  });

  it('should pass on lower case todo comments without colons', (): void => {
    const script: string = `
            // todo add failing example and update assertions
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  /* tslint:disable:mocha-no-side-effect-code */
  ['BUG', 'HACK', 'FIXME', 'LATER', 'LATER2', 'TODO'].forEach((suspiciousWord: string) => {
    /* tslint:enable:mocha-no-side-effect-code */

    it(`should fail on upper case ${suspiciousWord} comments without colons`, (): void => {
      const script: string = `
                // ${suspiciousWord} you should fix this
            `;

      TestHelper.assertViolations(ruleName, script, [
        {
          failure: `Suspicious comment found: ${suspiciousWord}`,
          name: Utils.absolutePath('file.ts'),
          ruleName: 'no-suspicious-comment',
          startPosition: { character: 17, line: 2 },
        },
      ]);
      TestHelper.assertViolationsWithOptions(ruleName, option, script, [
        {
          failure: `Suspicious comment found: ${suspiciousWord}.
To disable this warning, the comment should include one of the following regex: /https:\\/\\/example.com\\/*/`,
          name: Utils.absolutePath('file.ts'),
          ruleName: 'no-suspicious-comment',
          startPosition: { character: 17, line: 2 },
        },
      ]);
    });

    it(`should pass on upper case ${suspiciousWord} comments without colons and with regex option`, (): void => {
      const script: string = `
                // ${suspiciousWord} you should fix this https://example.com/article/123
            `;

      TestHelper.assertViolationsWithOptions(ruleName, option, script, []);
    });

    it(`should fail on upper case ${suspiciousWord} comments with colons`, (): void => {
      const script: string = `
                // ${suspiciousWord}: you should fix this
            `;

      TestHelper.assertViolations(ruleName, script, [
        {
          failure: `Suspicious comment found: ${suspiciousWord}`,
          name: Utils.absolutePath('file.ts'),
          ruleName: 'no-suspicious-comment',
          startPosition: { character: 17, line: 2 },
        },
      ]);
    });

    it(`should pass on upper case ${suspiciousWord} comments with colons and with regex option`, (): void => {
      const script: string = `
                // ${suspiciousWord}: you should fix this (see https://example.com/article/123)
            `;

      TestHelper.assertViolationsWithOptions(ruleName, option, script, []);
    });

    it(`should fail on lower case ${suspiciousWord} comments with colons`, (): void => {
      const script: string = `
                // ${suspiciousWord}: you should fix this
            `;

      TestHelper.assertViolations(ruleName, script, [
        {
          failure: `Suspicious comment found: ${suspiciousWord}`,
          name: Utils.absolutePath('file.ts'),
          ruleName: 'no-suspicious-comment',
          startPosition: { character: 17, line: 2 },
        },
      ]);
    });

    it(`should pass on lower case ${suspiciousWord} comments with colons and with regex option`, (): void => {
      const script: string = `
                // ${suspiciousWord}: you should fix this  (see https://example.com/article/123)
            `;

      TestHelper.assertViolationsWithOptions(ruleName, option, script, []);
    });
  });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
