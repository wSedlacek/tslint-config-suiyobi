import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

const METHOD_REGEX = 'method-regex';
const PRIVATE_METHOD_REGEX = 'private-method-regex';
const PROTECTED_METHOD_REGEX = 'protected-method-regex';
const STATIC_METHOD_REGEX = 'static-method-regex';
const FUNCTION_REGEX = 'function-regex';

const VALIDATE_PRIVATE_STATICS_AS_PRIVATE = 'validate-private-statics-as-private';
const VALIDATE_PRIVATE_STATICS_AS_STATIC = 'validate-private-statics-as-static';
const VALIDATE_PRIVATE_STATICS_AS_EITHER = 'validate-private-statics-as-either';

const VALID_ARGS = [VALIDATE_PRIVATE_STATICS_AS_PRIVATE, VALIDATE_PRIVATE_STATICS_AS_STATIC, VALIDATE_PRIVATE_STATICS_AS_EITHER];

interface Options {
  readonly validateStatics: string;
  readonly methodRegex: RegExp;
  readonly privateMethodRegex: RegExp;
  readonly protectedMethodRegex: RegExp;
  readonly staticMethodRegex: RegExp;
  readonly functionRegex: RegExp;
}

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'function-name',
    type: 'maintainability',
    description: 'Applies a naming convention to function names and method names',
    optionsDescription: Lint.Utils.dedent`
            Function styles should be consistent throughout the code.
            Users may want functions with multiple descriptors to be validated a certain way.
            An optional argument specifies validation for private static methods:
            * \`${VALIDATE_PRIVATE_STATICS_AS_PRIVATE}\` enforces validation as private.
            * \`${VALIDATE_PRIVATE_STATICS_AS_STATIC}\` enforces validation as static.
            * \`${VALIDATE_PRIVATE_STATICS_AS_EITHER}\` enforces validation as either.
            `,
    options: {
      type: 'array',
      items: [
        {
          type: 'string',
          enum: [VALIDATE_PRIVATE_STATICS_AS_PRIVATE, VALIDATE_PRIVATE_STATICS_AS_STATIC, VALIDATE_PRIVATE_STATICS_AS_EITHER],
        },
      ],
      minLength: 0,
      maxLength: 2,
    },
    optionExamples: [
      [true, VALIDATE_PRIVATE_STATICS_AS_EITHER],
      [true, VALIDATE_PRIVATE_STATICS_AS_PRIVATE],
      [true, VALIDATE_PRIVATE_STATICS_AS_STATIC],
      [true],
    ],
    typescriptOnly: true,
    issueClass: 'Non-SDL',
    issueType: 'Warning',
    severity: 'Important',
    level: 'Opportunity for Excellence',
    group: 'Clarity',
    commonWeaknessEnumeration: '398, 710',
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
  }

  private parseOptions(options: Lint.IOptions): Options {
    let methodRegex: RegExp = /^[a-z][\w\d]+$/;
    let privateMethodRegex: RegExp = methodRegex;
    let protectedMethodRegex: RegExp = privateMethodRegex;
    let staticMethodRegex: RegExp = /^[A-Z_\d]+$/;
    let functionRegex: RegExp = /^[a-z][\w\d]+$/;
    let validateStatics: string = VALIDATE_PRIVATE_STATICS_AS_PRIVATE;

    const ruleArguments: unknown[] = options.ruleArguments;

    if (ruleArguments.length > 1) {
      const staticsValidateOption: string = <string>ruleArguments[1];
      if (VALID_ARGS.indexOf(staticsValidateOption) > -1) {
        validateStatics = staticsValidateOption;
      }
    }

    ruleArguments.forEach((opt: unknown) => {
      if (isObject(opt)) {
        methodRegex = this.getOptionOrDefault(opt, METHOD_REGEX, methodRegex);
        privateMethodRegex = this.getOptionOrDefault(opt, PRIVATE_METHOD_REGEX, privateMethodRegex);
        protectedMethodRegex = this.getOptionOrDefault(opt, PROTECTED_METHOD_REGEX, protectedMethodRegex);
        staticMethodRegex = this.getOptionOrDefault(opt, STATIC_METHOD_REGEX, staticMethodRegex);
        functionRegex = this.getOptionOrDefault(opt, FUNCTION_REGEX, functionRegex);
      }
    });

    return {
      validateStatics,
      methodRegex,
      privateMethodRegex,
      protectedMethodRegex,
      staticMethodRegex,
      functionRegex,
    };
  }

  private getOptionOrDefault(option: { [key: string]: unknown }, key: string, defaultValue: RegExp): RegExp {
    try {
      const value = option[key];
      if (value !== undefined && (typeof value === 'string' || value instanceof RegExp)) {
        return new RegExp(value);
      }
    } catch (e) {
      /* tslint:disable:no-console */
      console.error('Could not read ' + key + ' within function-name configuration');
      /* tslint:enable:no-console */
    }
    return defaultValue;
  }
}

function walk(ctx: Lint.WalkContext<Options>) {
  const { validateStatics, methodRegex, privateMethodRegex, protectedMethodRegex, staticMethodRegex, functionRegex } = ctx.options;

  function validateAnyPattern(name: ts.PropertyName | ts.Identifier, patterns: RegExp[], messagePrefix: string): void {
    const nameText: string = name.getText();
    if (!patterns.some((pattern) => pattern.test(nameText))) {
      ctx.addFailureAt(name.getStart(), name.getWidth(), `${messagePrefix}: ${nameText}`);
    }
  }

  function handleStaticMethod(method: ts.MethodDeclaration) {
    validateAnyPattern(method.name, [staticMethodRegex], `Static method name does not match ${staticMethodRegex}`);
  }

  function handlePrivateMethod(method: ts.MethodDeclaration) {
    validateAnyPattern(method.name, [privateMethodRegex], `Private method name does not match ${privateMethodRegex}`);
  }

  function handlePrivateOrStaticMethod(method: ts.MethodDeclaration) {
    validateAnyPattern(
      method.name,
      [privateMethodRegex, staticMethodRegex],
      `Private static method name does not match ${privateMethodRegex} or ${staticMethodRegex}`
    );
  }

  function handleProtectedMethod(method: ts.MethodDeclaration) {
    validateAnyPattern(method.name, [protectedMethodRegex], `Protected method name does not match ${protectedMethodRegex}`);
  }

  function handleProtectedOrStaticMethod(method: ts.MethodDeclaration) {
    validateAnyPattern(
      method.name,
      [protectedMethodRegex, staticMethodRegex],
      `Protected static method name does not match ${protectedMethodRegex} or ${staticMethodRegex}`
    );
  }

  function handleOtherMethod(method: ts.MethodDeclaration) {
    validateAnyPattern(method.name, [methodRegex], `Method name does not match ${methodRegex}`);
  }

  // routes to different handler logic depending on validate statics configuration
  const methodRouter: { [key: string]: (method: ts.MethodDeclaration) => void } = {
    [VALIDATE_PRIVATE_STATICS_AS_PRIVATE]: (method: ts.MethodDeclaration) => {
      // private/protected first priority
      if (AstUtils.isPrivate(method)) {
        handlePrivateMethod(method);
      } else if (AstUtils.isProtected(method)) {
        handleProtectedMethod(method);
      } else if (AstUtils.isStatic(method)) {
        handleStaticMethod(method);
      } else {
        handleOtherMethod(method);
      }
    },
    [VALIDATE_PRIVATE_STATICS_AS_STATIC]: (method: ts.MethodDeclaration) => {
      // static first priority
      if (AstUtils.isStatic(method)) {
        handleStaticMethod(method);
      } else if (AstUtils.isPrivate(method)) {
        handlePrivateMethod(method);
      } else if (AstUtils.isProtected(method)) {
        handleProtectedMethod(method);
      } else {
        handleOtherMethod(method);
      }
    },
    [VALIDATE_PRIVATE_STATICS_AS_EITHER]: (method: ts.MethodDeclaration) => {
      // either private/protected or static
      if (AstUtils.isStatic(method)) {
        if (AstUtils.isPrivate(method)) {
          // private AND static methods pass if it matches either private regex OR static regex
          handlePrivateOrStaticMethod(method);
        } else if (AstUtils.isProtected(method)) {
          // protected AND static methods pass if it matches either protected regex OR static regex
          handleProtectedOrStaticMethod(method);
        } else {
          handleStaticMethod(method);
        }
      } else if (AstUtils.isPrivate(method)) {
        handlePrivateMethod(method);
      } else if (AstUtils.isProtected(method)) {
        handleProtectedMethod(method);
      } else {
        handleOtherMethod(method);
      }
    },
  };

  function cb(node: ts.Node): void {
    if (tsutils.isMethodDeclaration(node)) {
      if (AstUtils.hasComputedName(node)) {
        // allow computed names
      } else {
        // find handler based on validate statics configuration
        // fallback on private statics as private
        const handler = methodRouter[validateStatics] || methodRouter[VALIDATE_PRIVATE_STATICS_AS_PRIVATE];
        handler(node);
      }
    }

    if (tsutils.isFunctionDeclaration(node)) {
      if (node.name !== undefined) {
        validateAnyPattern(node.name, [functionRegex], `Function name does not match ${functionRegex}`);
      }
    }

    return ts.forEachChild(node, cb);
  }

  return ts.forEachChild(ctx.sourceFile, cb);
}
