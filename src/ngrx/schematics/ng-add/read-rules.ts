import { tsquery } from '@phenomnomnominal/tsquery';
import * as fs from 'fs';
import * as path from 'path';
import * as Lint from 'tslint';
import ts = require('typescript');

export function readRules(directory: string) {
  const rules = fs.readdirSync(directory).reduce((rulesConfigs, file) => {
    const filePath = path.join(directory, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const [ruleConfigNode] = tsquery(
      content,
      'ClassDeclaration > PropertyDeclaration:has(StaticKeyword):has(PublicKeyword):first-child > ObjectLiteralExpression'
    ) as ts.ObjectLiteralExpression[];
    if (ruleConfigNode) {
      const ruleConfig = ruleConfigNode.properties.reduce((config, prop) => {
        if (prop?.name?.getText() && 'initializer' in prop) {
          const key = prop.name.getText()! as keyof Lint.IRuleMetadata;
          config[key] = ts.isStringLiteral(prop.initializer) ? prop.initializer.text : prop.initializer.getText();
        }
        return config;
      }, {} as Partial<Lint.IRuleMetadata>);

      if (ruleConfig.ruleName) {
        rulesConfigs[ruleConfig.ruleName] = {
          description: ruleConfig.description,
          severity: ruleConfig.type === 'functionality' ? 'error' : 'warning',
        };
      }

      return rulesConfigs;
    }

    return rulesConfigs;
  }, {} as any);

  return rules;
}
