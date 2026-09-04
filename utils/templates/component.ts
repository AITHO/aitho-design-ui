export const componentTemplate = (
  pascalName: string,
  camelName: string,
): string => `
import * as React from 'react';
import { ${camelName}, type ${pascalName}VariantProps } from '@styled/recipes';

export type ${pascalName}Props = ${pascalName}VariantProps & 
  React.ComponentProps<'div'> & {
     /** Optional description of children prop */
    children?: React.ReactNode;
  };

export const ${pascalName}: React.FC<${pascalName}Props> = ({ 
  children,
  ...props 
}) => {
  const classes = ${camelName}(props);
  return (
    <div className={classes.root} {...props}>
      {children}
    </div>
  );
};

${pascalName}.displayName = '${pascalName}';
`;
