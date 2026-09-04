import { promises as fs } from "fs";
import path from "path";
import prettier from "prettier";
import { createInterface } from "node:readline/promises";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
import {
  componentTemplate,
  mainTemplate,
  presetTemplate,
  radixComponentTemplate,
  recipeTemplate,
  storyTemplate,
  testTemplate,
} from "./templates";
import { Interface } from "readline/promises";
import { camelCase, pascalCase } from "case-anything";

const exec = promisify(execCallback);

interface Component {
  name: string;
  dir: string;
}

interface ComponentDetails {
  componentName: string;
  useRadix: boolean;
  componentDir?: string;
}

const RADIX_COMPONENTS = [
  "accordion",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "checkbox",
  "collapsible",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "hover-card",
  "label",
  "menubar",
  "navigation-menu",
  "popover",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "slider",
  "switch",
  "tabs",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
] as const;

type RadixComponent = (typeof RADIX_COMPONENTS)[number];

class PandaComponentGenerator {
  private components: Component[] = [];
  private readonly componentsDir: string;
  private readonly libDir: string;
  private rl: Interface;

  constructor() {
    this.componentsDir = path.join(process.cwd(), "lib/components");
    this.libDir = path.join(process.cwd(), "lib");
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public async generate(): Promise<void> {
    try {
      const componentDetails = await this.initializeGenerator();
      await this.validateAndPrepare(componentDetails);
      await this.generateComponentFiles(componentDetails);
      await this.updateConfigurationFiles();
      await this.runPostGenerationTasks(componentDetails);
      console.log("✅ Component generated successfully");
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
    } finally {
      this.rl.close();
    }
  }

  private async initializeGenerator(): Promise<ComponentDetails> {
    console.log("Component Generator");
    console.log("------------------");

    const useRadix =
      (
        await this.rl.question("Create Radix UI component? (y/N): ")
      ).toLowerCase() === "y";

    let componentName: string;
    if (useRadix) {
      componentName =
        (await this.selectRadixComponent()) ||
        (await this.rl.question("Enter component name (kebab-case): "));
    } else {
      componentName = await this.rl.question(
        "Enter component name (kebab-case): ",
      );
    }

    if (await this.componentExists(componentName)) {
      console.log(
        `\n⚠️  Warning: Component "${pascalCase(
          componentName,
        )}" already exists!`,
      );
      const shouldOverwrite = await this.confirmOverwrite(componentName);

      if (!shouldOverwrite) {
        console.log("❌ Component generation cancelled");
        process.exit(0);
      }

      const componentDir = path.join(
        this.componentsDir,
        pascalCase(componentName),
      );
      try {
        await fs.rm(componentDir, { recursive: true });
        console.log(`\nℹ️  Removed existing component files`);
      } catch (error) {
        console.error("Error removing existing component:", error);
        process.exit(1);
      }
    }

    return { componentName, useRadix };
  }

  private async selectRadixComponent(): Promise<RadixComponent | null> {
    console.log("\nAvailable Radix UI components:");
    RADIX_COMPONENTS.forEach((comp, i) => {
      console.log(`${(i + 1).toString().padStart(2)}. ${comp}`);
    });

    const answer = await this.promptForRadixSelection();
    const num = parseInt(answer);

    if (num === 0) return null;
    if (num > 0 && num <= RADIX_COMPONENTS.length) {
      const component = RADIX_COMPONENTS[num - 1];
      const exists = await this.checkRadixPackage(component);

      if (!exists) {
        console.warn(`Warning: @radix-ui/react-${component} not found`);
        const proceed = await this.promptToProceed(component);
        if (!proceed) return await this.selectRadixComponent();
      }
      return component;
    }

    console.log("Invalid selection. Try again.");
    return await this.selectRadixComponent();
  }

  private async promptForRadixSelection(): Promise<string> {
    return await this.rl.question("\nSelect component number (0 to close): ");
  }

  private async promptToProceed(component: string): Promise<boolean> {
    const answer = await this.rl.question(
      `Warning: @radix-ui/react-${component} unavailable. Proceed? (y/N): `,
    );
    return answer.toLowerCase() === "y";
  }

  private async confirmOverwrite(componentName: string): Promise<boolean> {
    const answer = await this.rl.question(
      `Component "${componentName}" already exists. Do you want to overwrite it? (y/N): `,
    );
    return answer.toLowerCase() === "y";
  }

  private async validateAndPrepare(details: ComponentDetails): Promise<void> {
    if (!this.validateComponentName(details.componentName)) {
      throw new Error("Invalid component name. Use kebab-case format.");
    }

    details.componentDir = path.join(
      this.componentsDir,
      pascalCase(details.componentName),
    );

    await fs.mkdir(details.componentDir, { recursive: true });
  }

  private validateComponentName(name: string): boolean {
    return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
  }

  private async checkRadixPackage(componentName: string): Promise<boolean> {
    try {
      await exec(`npm view @radix-ui/react-${componentName} version`);
      return true;
    } catch {
      return false;
    }
  }

  private async componentExists(componentName: string): Promise<boolean> {
    const pascalName = pascalCase(componentName);
    const componentDir = path.join(this.componentsDir, pascalName);

    try {
      await fs.access(componentDir);
      const files = await fs.readdir(componentDir);

      const hasComponentFile = files.some(
        (file) => file === `${pascalName}.tsx`,
      );
      const hasRecipeFile = files.some(
        (file) => file === `${pascalName}.recipe.ts`,
      );
      const hasStoryFile = files.some(
        (file) => file === `${pascalName}.stories.tsx`,
      );

      return hasComponentFile || hasRecipeFile || hasStoryFile;
    } catch {
      return false;
    }
  }

  private async generateComponentFiles(
    details: ComponentDetails,
  ): Promise<void> {
    if (!details.componentDir) throw new Error("Component directory not set");

    await this.scanExistingComponents();
    await this.createComponentFiles(details);
  }

  private async scanExistingComponents(): Promise<void> {
    const entries = await fs.readdir(this.componentsDir, {
      withFileTypes: true,
    });
    this.components = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        name: entry.name,
        dir: path.join(this.componentsDir, entry.name),
      }));
  }

  private async createComponentFiles(details: ComponentDetails): Promise<void> {
    if (!details.componentDir) throw new Error("Component directory not set");

    const files = await fs.readdir(details.componentDir);

    await Promise.all([
      this.writeComponentFile(details, files),
      this.writeStoryFile(details, files),
      this.writeRecipeFile(details, files),
      this.writeTestFile(details, files),
    ]);
  }

  private async writeComponentFile(
    details: ComponentDetails,
    existingFiles: string[],
  ): Promise<void> {
    const pascalName = pascalCase(details.componentName);
    const filename = `${pascalName}.tsx`;

    if (!existingFiles.includes(filename)) {
      const content = details.useRadix
        ? this.generateRadixComponent(details.componentName)
        : this.generateComponent(details.componentName);

      await this.writeFormattedFile(
        path.join(details.componentDir!, filename),
        content,
      );
    }
  }

  private async writeStoryFile(
    details: ComponentDetails,
    existingFiles: string[],
  ): Promise<void> {
    const pascalName = pascalCase(details.componentName);
    const filename = `${pascalName}.stories.tsx`;

    if (!existingFiles.includes(filename)) {
      await this.writeFormattedFile(
        path.join(details.componentDir!, filename),
        this.generateStory(details.componentName),
      );
    }
  }

  private async writeRecipeFile(
    details: ComponentDetails,
    existingFiles: string[],
  ): Promise<void> {
    const pascalName = pascalCase(details.componentName);
    const filename = `${pascalName}.recipe.ts`;

    if (!existingFiles.includes(filename)) {
      await this.writeFormattedFile(
        path.join(details.componentDir!, filename),
        this.generateRecipe(details.componentName),
      );
    }
  }
  private async writeTestFile(
    details: ComponentDetails,
    existingFiles: string[],
  ): Promise<void> {
    const pascalName = pascalCase(details.componentName);
    const filename = `${pascalName}.test.tsx`;

    if (!existingFiles.includes(filename)) {
      await this.writeFormattedFile(
        path.join(details.componentDir!, filename),
        this.generateTest(details.componentName),
      );
    }
  }

  private generateTest(name: string): string {
    const pascalName = pascalCase(name);
    return testTemplate(pascalName);
  }

  private generateComponent(name: string): string {
    const pascalName = pascalCase(name);
    const camelName = camelCase(name);
    return componentTemplate(pascalName, camelName);
  }

  private generateRadixComponent(name: string): string {
    const pascalName = pascalCase(name);
    const camelName = camelCase(name);
    return radixComponentTemplate(name, pascalName, camelName);
  }

  private generateStory(name: string): string {
    const pascalName = pascalCase(name);
    return storyTemplate(name, pascalName);
  }

  private generateRecipe(name: string): string {
    const camelName = camelCase(name);
    return recipeTemplate(name, camelName);
  }

  private async updateConfigurationFiles(): Promise<void> {
    await Promise.all([this.generatePresetFile(), this.generateMainFile()]);
  }

  private async generatePresetFile(): Promise<void> {
    const content = presetTemplate(this.components);
    await this.writeFormattedFile(path.join(this.libDir, "preset.ts"), content);
  }

  private async generateMainFile(): Promise<void> {
    const content = mainTemplate(this.components);
    await this.writeFormattedFile(path.join(this.libDir, "main.ts"), content);
  }

  private async runPostGenerationTasks(
    details: ComponentDetails,
  ): Promise<void> {
    if (details.useRadix) {
      await this.installRadixDependency(details.componentName);
    }
    await this.runPandaCodegen();
  }

  private async installRadixDependency(name: string): Promise<void> {
    console.log("Installing Radix UI component...", name);
    const packageName = `@radix-ui/react-${name}`;
    console.log(`Installing ${packageName}...`);
    await exec(`npm install ${packageName} `);
  }

  private async runPandaCodegen(): Promise<void> {
    console.log("Running Panda codegen...");
    await exec("npm run codegen");
  }

  private async writeFormattedFile(
    filePath: string,
    content: string,
  ): Promise<void> {
    const formattedContent = await prettier.format(content, {
      parser: "typescript",
      ...(await prettier.resolveConfig(process.cwd())),
    });
    await fs.writeFile(filePath, formattedContent);
  }
}

const generator = new PandaComponentGenerator();
generator.generate();
