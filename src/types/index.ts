import type { ComponentType, ReactElement } from "react";
import type { SvgProps } from "react-native-svg";

export interface IconProps extends SvgProps {
  variant?: "Line";
  ref?: React.RefObject<ComponentType<SvgProps>>;
  color?: string;
  size?: string | number;
}

export type Icon = (props: IconProps) => ReactElement;

export interface IconVariant {
  variant: string;
  svgFile: string;
}

export interface Category {
  name: string;
  icons: string[];
}

export interface AttributeMap {
  [key: string]: string;
}
