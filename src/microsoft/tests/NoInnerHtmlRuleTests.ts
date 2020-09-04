import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noInnerHtmlRule', (): void => {
  const ruleName: string = 'no-inner-html';

  it('should pass on reading innerHTML strings', (): void => {
    const script: string = `
            var foo = element.innerHTML;
            var bar = element.outerHTML;
            var baz = $(element).html();
            var quxFunction = $(element).html;
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  it('should fail on writing to innerHTML', (): void => {
    const script: string = `
            element.innerHTML = '<div></div>';
            parent.child.innerHTML = '<div></div>';
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: "Writing a string to the innerHTML property is insecure: element.innerHTML = '<div></div>'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-inner-html',
        startPosition: { character: 13, line: 2 },
      },
      {
        failure: "Writing a string to the innerHTML property is insecure: parent.child.innerHTML = '<div></div>'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-inner-html',
        startPosition: { character: 13, line: 3 },
      },
    ]);
  });

  it('should fail on writing to outerHTML', (): void => {
    const script: string = `
            element.outerHTML = '<div></div>';
            parent.child.outerHTML = someVariable;
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: "Writing a string to the outerHTML property is insecure: element.outerHTML = '<div></div>'",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-inner-html',
        startPosition: { character: 13, line: 2 },
      },
      {
        failure: 'Writing a string to the outerHTML property is insecure: parent.child.outerHTML = someVariable',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-inner-html',
        startPosition: { character: 13, line: 3 },
      },
    ]);
  });

  it('should fail on invoking html(x)', (): void => {
    const script: string = `
            $(element).html('whatever');
        `;

    TestHelper.assertViolations(ruleName, script, [
      {
        failure: "Using the html() function to write a string to innerHTML is insecure: $(element).html('whatever')",
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-inner-html',
        startPosition: { character: 13, line: 2 },
      },
    ]);
  });

  it('should pass on non-jQuery HTML method calls', (): void => {
    const script: string = `
            var myCustomObject = {
              html: function (text) {
                console.log('Called html with ' + text);
              },
            };
            myCustomObject.html('here I am');
        `;

    TestHelper.assertViolations(ruleName, script, []);
  });

  describe('with options', (): void => {
    let options: [boolean, object];

    beforeEach((): void => {
      options = [
        true,
        {
          'html-lib-matcher': 'cheerio|[j|J][q|Q]uery',
        },
      ];
    });

    it('should fail on invoking html(x) with different jQuery matcher', (): void => {
      const script: string = `
                cheerio(element).html('whatever');
            `;

      TestHelper.assertViolationsWithOptions(ruleName, options, script, [
        {
          failure: "Using the html() function to write a string to innerHTML is insecure: cheerio(element).html('whatever')",
          name: Utils.absolutePath('file.ts'),
          ruleName: 'no-inner-html',
          startPosition: { character: 17, line: 2 },
        },
      ]);
    });

    it('should pass on non-jQuery HTML method calls with options', (): void => {
      const script: string = `
              var myCustomObject = {
                html: function (text) {
                  console.log('Called html with ' + text);
                },
              };
              myCustomObject.html('here I am');
          `;

      TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
    });
  });
});
