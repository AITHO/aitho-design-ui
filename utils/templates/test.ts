export const testTemplate = (pascalName: string): string => `
  import { describe, it, expect } from 'vitest';
  import { render } from '@testing-library/react';
  import { ${pascalName} } from './${pascalName}';
  
  describe('${pascalName}', () => {
    it('renders without crashing', () => {
      const { container } = render(<${pascalName}>Test</${pascalName}>);
      expect(container.firstChild).toBeTruthy();
    });
  
    it('renders children correctly', () => {
      const testText = 'Test Content';
      const { container } = render(<${pascalName}>{testText}</${pascalName}>);
      expect(container.textContent).toBe(testText);
    });
  });
  `;
