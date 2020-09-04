/**
 * Elements with aria roles must have all required attributes according to the role
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getImplicitRole } from './utils/getImplicitRole';
import { getJsxAttributesFromJsxElement, getStringLiteral } from './utils/JsxAttribute';
import { IRole, IRoleSchema } from './utils/attributes/IRole';
import { IAria } from './utils/attributes/IAria';
import * as rolesSchema from './utils/attributes/roleSchema.json';
import * as ariaSchema from './utils/attributes/ariaSchema.json';

const ROLES_SCHEMA: IRoleSchema = rolesSchema;
const ROLES: { [key: string]: Partial<IRole> } = ROLES_SCHEMA.roles;

const ARIA_ATTRIBUTES: { [attributeName: string]: Partial<IAria> } = ariaSchema;
const ROLE_STRING: string = 'role';

// h1-h6 tags have implicit role heading with aria-level attribute.
const TAGS_WITH_ARIA_LEVEL: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export function getFailureStringForNotImplicitRole(roleNamesInElement: string[], missingProps: string[]): string {
  return `Element with ARIA role(s) '${roleNamesInElement.join(', ')}' \
are missing required attribute(s): ${missingProps.join(', ')}. \
A reference to role definitions can be found at https://www.w3.org/TR/wai-aria-1.1/#role_definitions.`;
}

export function getFailureStringForImplicitRole(tagName: string, roleNamesInElement: string, missingProps: string[]): string {
  return `Tag '${tagName}' has implicit role '${roleNamesInElement}'. \
It requires aria-* attributes: ${missingProps.join(', ')} that are missing in the element. \
A reference to role definitions can be found at https://www.w3.org/TR/wai-aria-1.1/#role_definitions.`;
}

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'react-a11y-role-has-required-aria-props',
    type: 'maintainability',
    description: 'Elements with aria roles must have all required attributes according to the role.',
    rationale: `References:
        <ul>
          <li><a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions">ARIA Definition of Roles</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/90">WCAG Rule 90: Required properties and states should be defined</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/91">WCAG Rule 91: Required properties and states must not be empty</a></li>
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
    const tagName: string = node.tagName.getText();
    const attributesInElement: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
    const roleProp: ts.JsxAttribute = attributesInElement[ROLE_STRING];

    // If role attribute is specified, get the role value. Otherwise get the implicit role from tag name.
    const roleValue = roleProp ? getStringLiteral(roleProp) : getImplicitRole(node);
    const isImplicitRole: boolean = !roleProp && !!roleValue;
    const normalizedRoles: string[] = (roleValue || '')
      .toLowerCase()
      .split(' ')
      .filter((role: string) => !!ROLES[role]);

    if (normalizedRoles.length === 0) {
      return;
    }

    let requiredAttributeNames: string[] = [];

    normalizedRoles.forEach((role: string) => {
      requiredAttributeNames = requiredAttributeNames.concat(ROLES[role].requiredProps || []);
    });

    const attributeNamesInElement: string[] = Object.keys(attributesInElement)
      .filter((attributeName: string) => !!ARIA_ATTRIBUTES[attributeName.toLowerCase()])
      // h1-h6 tags have aria-level
      .concat(TAGS_WITH_ARIA_LEVEL.indexOf(tagName) === -1 ? [] : ['aria-level']);

    // Get the list of missing required aria-* attributes in current element.
    const missingAttributes: string[] = requiredAttributeNames.filter(
      (attributeName: string) => attributeNamesInElement.indexOf(attributeName) === -1
    );

    if (missingAttributes.length > 0) {
      ctx.addFailureAt(
        node.getStart(),
        node.getWidth(),
        isImplicitRole
          ? getFailureStringForImplicitRole(node.tagName.getText(), normalizedRoles[0], missingAttributes)
          : getFailureStringForNotImplicitRole(normalizedRoles, missingAttributes)
      );
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
