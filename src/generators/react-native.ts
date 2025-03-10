import path from "path";
import fs from "fs/promises";
import { readFileSync } from "fs";
import camelcase from "camelcase";
import { PATHS, DEFAULT_PROPS } from "../constants";
import { generateVariantComponents, generateVariantSwitch } from "../utils/svg-transform";
import type { Category } from "../types";

const TYPE_DEFINITIONS = `/// <reference types="react" />
import type { ComponentType, ReactElement } from 'react';
import type { SvgProps } from 'react-native-svg';

export interface IconProps extends SvgProps {
  variant?: 'Line';
  ref?: React.RefObject<ComponentType<SvgProps>>;
  color?: string;
  size?: string | number;
}

export type Icon = (props: IconProps) => ReactElement;`;

const generateReactNativeIcons = async (
  variants: string[],
  categories: Category[]
): Promise<void> => {
  console.log("----- Generating icons -> react-native");

  const builtSourceDir = path.join(PATHS.PACKAGES, "untitled-ui-icons-react-native", "src");

  // Initialize files
  await fs.writeFile(path.join(builtSourceDir, "index.js"), "", "utf-8");
  await fs.writeFile(path.join(builtSourceDir, "index.d.ts"), TYPE_DEFINITIONS, "utf-8");

  for (const category of categories) {
    for (const icon of category.icons) {
      const iconsAllVariant = variants.map((variant) => ({
        variant,
        svgFile: readFileSync(path.join(PATHS.ICONS, variant, category.name, icon), "utf-8"),
      }));

      let componentName = camelcase(icon.replace(".svg", ""), { pascalCase: true });
      if (/^\d/.test(componentName)) {
        componentName = "I" + componentName;
      }

      const componentContent = `
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

${generateVariantComponents(iconsAllVariant, true)}

${generateVariantSwitch(iconsAllVariant)}

const ${componentName} = forwardRef(({ variant, color, size, ...rest }, ref) => {
  return (
    <Svg 
      {...rest} 
      xmlns="http://www.w3.org/2000/svg" 
      ref={ref} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      {chooseVariant(variant, color)}
    </Svg>
  );
});

${componentName}.propTypes = {
  variant: PropTypes.oneOf(['Line']),
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

${componentName}.defaultProps = ${JSON.stringify(DEFAULT_PROPS, null, 2)};

${componentName}.displayName = '${componentName}';

export default ${componentName};`;

      // Write component file
      await fs.writeFile(
        path.join(builtSourceDir, `${componentName}.js`),
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
