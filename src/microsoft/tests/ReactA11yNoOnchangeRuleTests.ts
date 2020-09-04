import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

/**
 * Unit tests.
 */
describe('reactA11yNoOnchangeRule', (): void => {
  const ruleName: string = 'react-a11y-no-onchange';
  const errorMessage = (tagName: string): string =>
    `onChange event handler should not be used with the <${tagName}>. Please use onBlur instead.`;

  it('should pass if select element attributes without onChange event', (): void => {
    const script: string = `
            import React = require('react');
            const selectElement = <select />
            const selectElementWithOnBlur = <select  onBlur={} />`;

    TestHelper.assertNoViolation(ruleName, script);
  });

  it('should fail if select element attributes contains onChange event', (): void => {
    const script: string = `
            import React = require('react');
            const selectElementWithOnChange = <select  onChange={} />\`;
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: errorMessage('select'),
        name: Utils.absolutePath('file.tsx'),
        ruleName,
        ruleSeverity: 'ERROR',
        startPosition: { character: 47, line: 3 },
      },
    ]);
  });

  it('should not fail if select element attributes contains onBlur event even if it also contains onChange event', (): void => {
    const script: string = `
            import React = require('react');
            const selectElementWithOnChange = <select  onChange={} onBlur={} />\`;
        `;

    TestHelper.assertNoViolation(ruleName, script);
  });

  it('should fail if additional tag name specified in options contains onChange event', () => {
    const script: string = `
            import React = require('react');
            const selectElementWithOnChange = <Select  onChange={} />
            const selectElementWithOnChange = <select  onChange={} />
        `;

    TestHelper.assertViolationsWithOptions(ruleName, ['Select'], script, [
      {
        failure: errorMessage('Select'),
        name: Utils.absolutePath('file.tsx'),
        ruleName,
        ruleSeverity: 'ERROR',
        startPosition: { character: 47, line: 3 },
      },
      {
        failure: errorMessage('select'),
        name: Utils.absolutePath('file.tsx'),
        ruleName,
        ruleSeverity: 'ERROR',
        startPosition: {
          character: 47,
          line: 4,
        },
      },
    ]);
  });
});
