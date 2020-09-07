import { tsquery } from '@phenomnomnominal/tsquery';
import * as fs from 'fs';
import * as path from 'path';
import * as Lint from 'tslint';
import ts = require('typescript');

const rulesConfig = readRules('./src/rules');

const schema = fs.readFileSync(path.join(__dirname, '../schematics/ng-add/schema.json'), 'utf-8');
const generatedSchema = JSON.parse(schema);
generatedSchema.properties.rules['x-prompt'].items = [
  ...generatedSchema.properties.rules['x-prompt'].items,
  ...Object.entries(rulesConfig).map(([key, value]: [string, any]) => ({
    label: `${key} (${value.description})`,
    value: key,
  })),
];

fs.writeFileSync(path.join(__dirname, '../../dist/schematics/ng-add/rules-config.json'), JSON.stringify(rulesConfig, null, 2), 'utf-8');

fs.writeFileSync(path.join(__dirname, '../../dist/schematics/ng-add/schema.json'), JSON.stringify(generatedSchema, null, 2), 'utf-8');

export function readRules(directory: string): { [ruleName: string]: Lint.IRuleMetadata } {
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
      }, {} as Partial<Lint.IRuleMetadata>) as Lint.IRuleMetadata;

      if (ruleConfig.ruleName) {
        const key = ruleConfig.ruleName as keyof Lint.IRuleMetadata;
        rulesConfigs[key] = ruleConfig;
      }

      return rulesConfigs;
    }

    return rulesConfig;
  }, {} as { [ruleName: string]: Lint.IRuleMetadata });

  return rules;
}
