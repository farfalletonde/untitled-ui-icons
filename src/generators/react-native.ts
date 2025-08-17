import path from "path";
import fs from "fs/promises";
import { readFileSync } from "fs";
import camelcase from "camelcase";
import { PATHS } from "../constants";
import { convertSvgToReactElement } from "../utils/svg-transform";
import type { Category } from "../types";

const generateReactNativeIcons = async (
  variants: string[],
  categories: Category[]
): Promise<void> => {
  console.log("----- Generating icons -> react-native");

  const builtSourceDir = path.join(
    PATHS.PACKAGES,
    "untitled-ui-icons-react-native",
    "src"
  );

  // Initialize files
  await fs.writeFile(path.join(builtSourceDir, "index.js"), "", "utf-8");

  for (const category of categories) {
    for (const icon of category.icons) {
      const iconsAllVariant = variants.map((variant) => ({
        variant,
        svgFile: readFileSync(
          path.join(PATHS.ICONS, variant, category.name, icon),
          "utf-8"
        ),
      }));

      let componentName = camelcase(icon.replace(".svg", ""), {
        pascalCase: true,
      });
      if (/^\d/.test(componentName)) {
        componentName = "I" + componentName;
      }

      const componentContent = `
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ${componentName} = (props: SvgProps) => (
  <Svg 
    width={props.width ?? 24} 
    height={props.height ?? 24} 
    viewBox="0 0 24 24" 
    fill="none"
    {...props} 
  >
    ${convertSvgToReactElement(iconsAllVariant[0].svgFile, true).replace(
      `stroke="black"`,
      "stroke={props.color ?? 'black'}"
    )}
  </Svg>
);

export default ${componentName};`;

      // Write component file
      await fs.writeFile(
        path.join(builtSourceDir, `${componentName}.tsx`),
        componentContent,
        "utf-8"
      );

      // Update index files
      await fs.appendFile(
        path.join(builtSourceDir, "index.js"),
        `export { default as ${componentName} } from './${componentName}.js';\n`,
        "utf-8"
      );

      await fs.appendFile(
        path.join(builtSourceDir, "index.d.ts"),
        `export const ${componentName}: Icon;\n`,
        "utf-8"
      );
    }
  }
};
export default generateReactNativeIcons;
