import * as ts from 'typescript';
import * as utils from 'tsutils';

export function isUndefined(expression: ts.Expression): boolean {
  return (utils.isIdentifier(expression) && expression.text === 'undefined') || expression.kind === ts.SyntaxKind.VoidExpression;
}

export function isElseIf(node: ts.IfStatement): node is ts.IfStatement & { parent: ts.IfStatement & { elseStatement: ts.IfStatement } } {
  const parent = node.parent!;
  return utils.isIfStatement(parent) && parent.elseStatement === node;
}
