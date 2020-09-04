/**
 * Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getImplicitRole } from './utils/getImplicitRole';
import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';
import { IRole, IRoleSchema } from './utils/attributes/IRole';
import { IAria } from './utils/attributes/IAria';
import * as rolesSchema from './utils/attributes/roleSchema.json';
import * as ariaSchema from './utils/attributes/ariaSchema.json';

const ROLE_SCHEMA: IRoleSchema = rolesSchema;
const ARIA_ATTRIBUTES: { [attributeName: string]: Partial<IAria> } = ariaSchema;

const ROLES: { [key: string]: Partial<IRole> } = ROLE_SCHEMA.roles;
const ROLE_STRING: string = 'role';

export function getFailureStringForNotImplicitRole(roleNamesInElement: string[], invalidPropNames: string[]): string {
  return `Attribute(s) ${invalidPropNames.join(', ')} are not supported by role(s) ${roleNamesInElement.join(', ')}. \
You are using incorrect role or incorrect aria-* attribute`;
}

export function getFailureStringForImplicitRole(tagName: string, roleName: string, invalidPropNames: string[]): string {
  return `Attribute(s) ${invalidPropNames.join(', ')} not supported \
by role ${roleName} which is implicitly set by the HTML tag ${tagName}.`;
}

export function getFailureStringForNoRole(tagName: string, invalidPropNames: string[]): string {
  return `Attribute(s) ${invalidPropNames} are not supported by no corresponding role. \
There is no corresponding role for the HTML tag ${tagName}. \
A reference about no corresponding role: https://www.w3.org/TR/html-aria/#dfn-no-corresponding-role.`;
}

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'react-a11y-role-supports-aria-props',
    type: 'maintainability',
    description:
      'Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role`. ' +
      'Many aria attributes (states and properties) can only be used on elements with particular roles. ' +
      "Some elements have implicit roles, such as `<a href='hrefValue' />`, which will be resolved to `role='link'`. " +
      'A reference for the implicit roles can be found at [Default Implicit ARIA Semantics](https://www.w3.org/TR/html-aria/#sec-strong-native-semantics).',
    rationale: `References:
        <ul>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/87">ARIA attributes can only be used with certain roles</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/84">Check aria properties and states for valid roles and properties</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/93">Check that 'ARIA-' attributes are valid properties and states</a></li>
        </ul>`,
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'Non-SDL',
    issueType: 'Warning',
    severity: 'Important',
    level: 'Opportunity for Excellence',
    group: 'Accessibility',
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return sourceFile.languageVariant === ts.LanguageVariant.JSX ? this.applyWithFunction(sourceFile, walk) : [];
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  function checkJsxElement(node: ts.JsxOpeningLikeElement): void {
    const attributesInElement: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
    const roleProp: ts.JsxAttribute = attributesInElement[ROLE_STRING];
    let roleValue: string | undefined;

    // Match react custom element whose tag name starts with uppercase character.
    if (node.tagName.getText().match(/^[A-Z].*/)) {
      return;
    }
    if (roleProp !== undefined) {
      roleValue = getStringLiteral(roleProp);
      if (!isEmpty(roleProp) && roleValue === undefined) {
        // Do NOT check if can't retrieve the right role.
        return;
      }
    } else {
      roleValue = getImplicitRole(node); // Get implicit role if not specified.
    }

    const isImplicitRole: boolean = !roleProp && !!roleValue;
    const normalizedRoles = (roleValue || '')
      .toLowerCase()
      .split(' ')
      .filter((role: string) => role in ROLES);

    let supportedAttributeNames: string[] = ROLE_SCHEMA.globalSupportedProps;

    normalizedRoles.forEach((role) => {
      supportedAttributeNames = supportedAttributeNames.concat(ROLES[role].additionalSupportedProps || []);
    });

    const attributeNamesInElement: string[] = Object.keys(attributesInElement).filter(
      (attributeName: string) => !!ARIA_ATTRIBUTES[attributeName.toLowerCase()]
    );

    // Get the list of not-supported aria-* attributes in current element.
    const invalidAttributeNamesInElement: string[] = attributeNamesInElement.filter(
      (attributeName: string) => supportedAttributeNames.indexOf(attributeName) === -1
    );
    let failureString: string;

    if (normalizedRoles.length === 0) {
      failureString = getFailureStringForNoRole(node.tagName.getText(), invalidAttributeNamesInElement);
    } else if (isImplicitRole) {
      failureString = getFailureStringForImplicitRole(node.tagName.getText(), normalizedRoles[0], invalidAttributeNamesInElement);
    } else {
      failureString = getFailureStringForNotImplicitRole(normalizedRoles, invalidAttributeNamesInElement);
    }

    if (invalidAttributeNamesInElement.length > 0) {
      ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
    }
  }

  function cb(node: ts.Node): void {
    if (tsutils.isJsxElement(node)) {
      checkJsxElement(node.openingElement);
    } else if (tsutils.isJsxSelfClosingElement(node)) {
      checkJsxElement(node);
    }

    return ts.forEachChild(node, cb);
  }

  return ts.forEachChild(ctx.sourceFile, cb);
}
