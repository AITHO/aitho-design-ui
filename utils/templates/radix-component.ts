export const radixComponentTemplate = (
  name: string,
  pascalName: string,
  camelName: string,
): string => `
import * as React from 'react';
import * as ${pascalName}Primitive from '@radix-ui/react-${name}';
import { ${camelName}, type ${pascalName}VariantProps } from '@styled/recipes';

export type ${pascalName}Props = ${pascalName}VariantProps &
  React.ComponentProps<typeof ${pascalName}Primitive.Root> & {
    children?: React.ReactNode;
  };

export const ${pascalName}: React.FC<${pascalName}Props> = ({
  children,
  ...props
}) => {
  const classes = ${camelName}(props);
  return (
    <${pascalName}Primitive.Root className={classes.root} {...props}>
      {children}
    </${pascalName}Primitive.Root>
  );
};

${pascalName}.displayName = '${pascalName}';
`;
