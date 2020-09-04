import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'no-function-constructor-with-string-args',
    type: 'maintainability',
    description: 'Do not use the version of the Function constructor that accepts a string argument to define the body of the function',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'SDL',
    issueType: 'Error',
    severity: 'Critical',
    level: 'Mandatory',
    recommendation: 'false',
    group: 'Security',
    commonWeaknessEnumeration: '95, 676, 242, 116',
  };

  public static FAILURE_STRING: string = 'forbidden: Function constructor with string arguments ';

  private static isWarningShown: boolean = false;

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (Rule.isWarningShown === false) {
      console.warn(
        'Warning: no-function-constructor-with-string-args rule is deprecated. Replace your usage with the TSLint function-constructor rule.'
      );
      Rule.isWarningShown = true;
    }

    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  function cb(node: ts.Node): void {
    if (tsutils.isNewExpression(node)) {
      const functionName = AstUtils.getFunctionName(node);
      if (functionName === 'Function' && node.arguments && node.arguments.length > 0) {
        ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
      }
    }

    return ts.forEachChild(node, cb);
  }

  return ts.forEachChild(ctx.sourceFile, cb);
}
