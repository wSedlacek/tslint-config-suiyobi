import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { AstUtils } from './utils/AstUtils';
import { Utils } from './utils/Utils';

const FAILURE_STRING: string = 'Non-literal (insecure) parameter passed to require(): ';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'non-literal-require',
    type: 'functionality',
    description: 'Detect require includes that are not for string literals',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'SDL',
    issueType: 'Error',
    severity: 'Critical',
    level: 'Mandatory',
    group: 'Security',
    commonWeaknessEnumeration: '95,676',
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  function cb(node: ts.Node): void {
    if (tsutils.isCallExpression(node)) {
      if (AstUtils.getFunctionName(node) === 'require' && AstUtils.getFunctionTarget(node) === undefined && node.arguments.length > 0) {
        if (tsutils.isArrayLiteralExpression(node.arguments[0])) {
          const arrayExp: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>node.arguments[0];
          arrayExp.elements.forEach((initExpression: ts.Expression): void => {
            if (!tsutils.isStringLiteral(initExpression)) {
              fail(initExpression);
            }
          });
        } else if (!tsutils.isStringLiteral(node.arguments[0])) {
          fail(node.arguments[0]);
        }
      }
    }

    return ts.forEachChild(node, cb);
  }

  return ts.forEachChild(ctx.sourceFile, cb);

  function fail(expression: ts.Expression): void {
    const start: number = expression.getStart();
    const width: number = expression.getWidth();
    const message: string = FAILURE_STRING + Utils.trimTo(expression.getText(), 25);
    ctx.addFailureAt(start, width, message);
  }
}
