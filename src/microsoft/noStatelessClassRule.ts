import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { Utils } from './utils/Utils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'A stateless class was found. This indicates a failure in the object model: ';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'no-stateless-class',
    type: 'maintainability',
    description: 'A stateless class represents a failure in the object oriented design of the system.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'Non-SDL',
    issueType: 'Warning',
    severity: 'Important',
    level: 'Opportunity for Excellence',
    recommendation: 'false',
    group: 'Deprecated',
    commonWeaknessEnumeration: '398, 710',
  };

  private static isWarningShown: boolean = false;

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (Rule.isWarningShown === false) {
      console.warn('Warning: no-stateless-class rule is deprecated. Replace your usage with the TSLint no-unnecessary-class rule.');
      Rule.isWarningShown = true;
    }
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  function isClassStateful(node: ts.ClassDeclaration): boolean {
    if (classExtendsSomething(node) || classDeclaresConstructorProperties(node)) {
      return true;
    }
    if (node.members.length === 0) {
      return false;
    }

    return classDeclaresInstanceData(node);
  }

  function classDeclaresInstanceData(node: ts.ClassDeclaration): boolean {
    return Utils.exists(node.members, (classElement: ts.ClassElement): boolean => {
      if (classElement.kind === ts.SyntaxKind.Constructor) {
        return false;
      }
      if (AstUtils.isStatic(classElement)) {
        return false;
      }
      return true;
    });
  }

  function classDeclaresConstructorProperties(node: ts.ClassDeclaration): boolean {
    return Utils.exists(node.members, (element: ts.ClassElement): boolean => {
      if (element.kind === ts.SyntaxKind.Constructor) {
        return constructorDeclaresProperty(<ts.ConstructorDeclaration>element);
      }
      return false;
    });
  }

  function constructorDeclaresProperty(ctor: ts.ConstructorDeclaration): boolean {
    return Utils.exists(ctor.parameters, (param: ts.ParameterDeclaration): boolean => {
      if (param.modifiers === undefined) {
        return false;
      }

      return (
        AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.PublicKeyword) ||
        AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.PrivateKeyword) ||
        AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.ProtectedKeyword) ||
        AstUtils.hasModifier(param.modifiers, ts.SyntaxKind.ReadonlyKeyword)
      );
    });
  }

  function classExtendsSomething(node: ts.ClassDeclaration): boolean {
    return Utils.exists(node.heritageClauses, (clause: ts.HeritageClause): boolean => {
      return clause.token === ts.SyntaxKind.ExtendsKeyword;
    });
  }

  function cb(node: ts.Node): void {
    if (tsutils.isClassDeclaration(node)) {
      if (!isClassStateful(node)) {
        const className: string = node.name === undefined ? '<unknown>' : node.name.text;
        ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + className);
      }
    }

    return ts.forEachChild(node, cb);
  }

  return ts.forEachChild(ctx.sourceFile, cb);
}
