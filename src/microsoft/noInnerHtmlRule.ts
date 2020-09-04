import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

interface Options {
  htmlLibExpressionRegex: RegExp;
}

const FAILURE_INNER: string = 'Writing a string to the innerHTML property is insecure: ';
const FAILURE_OUTER: string = 'Writing a string to the outerHTML property is insecure: ';
const FAILURE_HTML_LIB: string = 'Using the html() function to write a string to innerHTML is insecure: ';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'no-inner-html',
    type: 'maintainability',
    description: 'Do not write values to innerHTML, outerHTML, or set HTML using the JQuery html() function.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'SDL',
    issueType: 'Error',
    severity: 'Critical',
    level: 'Mandatory',
    group: 'Security',
    commonWeaknessEnumeration: '79, 85, 710',
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk, parseOptions(this.getOptions()));
  }
}

function parseOptions(options: Lint.IOptions): Options {
  let value: RegExp = /^(jquery|[$])/i;

  const args: any[] = options.ruleArguments;
  if (args && typeof args[1] === 'object' && args[1]['html-lib-matcher']) {
    value = new RegExp(args[1]['html-lib-matcher']);
  } else if (options instanceof Array && typeof options[1] === 'object' && options[1]['html-lib-matcher']) {
    value = new RegExp(options[1]['html-lib-matcher']);
  }

  return {
    htmlLibExpressionRegex: value,
  };
}

function walk(ctx: Lint.WalkContext<Options>) {
  const { htmlLibExpressionRegex } = ctx.options;

  function cb(node: ts.Node): void {
    if (tsutils.isBinaryExpression(node)) {
      // look for assignments to property expressions where the
      // left hand side is either innerHTML or outerHTML
      if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
        if (tsutils.isPropertyAccessExpression(node.left)) {
          const propAccess: ts.PropertyAccessExpression = node.left;
          const propName: string = propAccess.name.text;
          if (propName === 'innerHTML') {
            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_INNER + node.getText());
          } else if (propName === 'outerHTML') {
            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_OUTER + node.getText());
          }
        }
      }
    }

    if (tsutils.isCallExpression(node)) {
      const functionName = AstUtils.getFunctionName(node);
      if (functionName === 'html') {
        if (node.arguments.length > 0) {
          const functionTarget = AstUtils.getFunctionTarget(node);
          if (functionTarget !== undefined && htmlLibExpressionRegex.test(functionTarget)) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_HTML_LIB + node.getText());
          }
        }
      }
    }

    return ts.forEachChild(node, cb);
  }

  return ts.forEachChild(ctx.sourceFile, cb);
}
