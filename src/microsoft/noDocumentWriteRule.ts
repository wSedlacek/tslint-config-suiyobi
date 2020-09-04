import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'no-document-write',
    type: 'maintainability',
    description: 'Do not use document.write',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'SDL',
    issueType: 'Error',
    severity: 'Critical',
    level: 'Mandatory',
    group: 'Security',
    commonWeaknessEnumeration: '79, 85',
  };

  public static WRITE_FAILURE: string = 'Forbidden call to document.write';
  public static WRITELN_FAILURE: string = 'Forbidden call to document.writeln';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  function cb(node: ts.Node): void {
    if (tsutils.isCallExpression(node)) {
      const functionTarget = AstUtils.getFunctionTarget(node);
      if (functionTarget === 'document' || functionTarget === 'window.document') {
        if (node.arguments.length === 1) {
          const functionName: string = AstUtils.getFunctionName(node);
          if (functionName === 'write') {
            ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.WRITE_FAILURE);
          } else if (functionName === 'writeln') {
            ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.WRITELN_FAILURE);
          }
        }
      }
    }

    return ts.forEachChild(node, cb);
  }

  return ts.forEachChild(ctx.sourceFile, cb);
}
