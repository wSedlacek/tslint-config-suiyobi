import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noExecScriptRule', (): void => {
  const RULE_NAME: string = 'no-exec-script';

  it('should produce violations ', (): void => {
    const inputFile: string = `
execScript('alert("hello world")');
this.execScript('alert("hello world")');
window.execScript('alert("hello world")');
(<any>window).execScript('alert("hello world")');

var a = execScript('alert("hello world")');
var b = this.execScript('alert("hello world")');
var c = window.execScript('alert("hello world")');
var d = (<any>window).execScript('alert("hello world")');

`;
    TestHelper.assertViolations(RULE_NAME, inputFile, [
      {
        failure: 'forbidden execScript: execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 2,
          character: 1,
        },
      },
      {
        failure: 'forbidden execScript: this.execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 3,
          character: 1,
        },
      },
      {
        failure: 'forbidden execScript: window.execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 4,
          character: 1,
        },
      },
      {
        failure: 'forbidden execScript: (<any>window).execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 5,
          character: 1,
        },
      },
      {
        failure: 'forbidden execScript: execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 7,
          character: 9,
        },
      },
      {
        failure: 'forbidden execScript: this.execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 8,
          character: 9,
        },
      },
      {
        failure: 'forbidden execScript: window.execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 9,
          character: 9,
        },
      },
      {
        failure: 'forbidden execScript: (<any>window).execScript',
        name: Utils.absolutePath('file.ts'),
        ruleName: 'no-exec-script',
        startPosition: {
          line: 10,
          character: 9,
        },
      },
    ]);
  });
});
