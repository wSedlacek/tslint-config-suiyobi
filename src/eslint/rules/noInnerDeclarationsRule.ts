import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const walker = new NoInnerDeclarationsWalker(sourceFile, this.getOptions());
    return this.applyWithWalker(walker);
  }
}

class NoInnerDeclarationsWalker extends Lint.RuleWalker {
  private VALID_PARENT_TYPES = [
    ts.SyntaxKind.SourceFile,
    ts.SyntaxKind.FunctionDeclaration,
    ts.SyntaxKind.FunctionExpression,
    ts.SyntaxKind.ArrowFunction,
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.ModuleDeclaration,
    ts.SyntaxKind.Constructor,
  ];

  protected visitFunctionDeclaration(node: ts.FunctionDeclaration) {
    this.validateInnerDeclaration(node);
    super.visitFunctionDeclaration(node);
  }

  protected visitVariableStatement(node: ts.VariableStatement) {
    // TODO: Find out how to get rid of `!`, this has been working on all the test, shutting down
    // so that we can release with tsc >= 3.0
    if (this.hasOption('both') && node.declarationList.getFirstToken()!.kind === ts.SyntaxKind.VarKeyword) {
      this.validateInnerDeclaration(node);
    }
    super.visitVariableStatement(node);
  }

  private validateInnerDeclaration(node: ts.Node) {
    const body = this.nearestBody(node);
    const isValid = (body.isSourceFile && body.distance === 1) || body.distance === 2;

    if (!isValid) {
      const decl = node.kind === ts.SyntaxKind.FunctionDeclaration ? 'function' : 'variable';
      const root = body.isSourceFile ? 'program' : 'function body';

      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), `move ${decl} declaration to ${root} root`));
    }
  }

  private nearestBody(node: ts.Node) {
    let ancestor = node.parent;
    let generation = 1;

    while (ancestor && this.VALID_PARENT_TYPES.indexOf(ancestor.kind) === -1) {
      generation++;
      ancestor = ancestor.parent;
    }

    return {
      isSourceFile: (ancestor && ancestor.kind === ts.SyntaxKind.SourceFile) || !ancestor,
      distance: generation,
    };
  }
}
