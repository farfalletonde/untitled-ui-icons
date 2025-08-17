import { load } from "cheerio";
import { convertAttrsToReactAttrs, capitalizeElementName } from "./attributes";

export const transformChildren = (children: any[], isNative: boolean) => {
  if (!children.length) return [];

  return children.map((child) => {
    if (isNative && child.name) {
      child.name = capitalizeElementName(child.name);
    }

    if (!child.attribs) return child;

    const attribs = convertAttrsToReactAttrs(child.attribs);
    return { ...child, attribs };
  });
};

export const convertSvgToReactElement = (
  svgFile: string,
  isNative: boolean
): string => {
  const $ = load(svgFile);
  const elements = $("svg > *");

  elements.each((_, element) => {
    if (isNative) {
      element.name = capitalizeElementName(element.name);
    }

    element.attribs = convertAttrsToReactAttrs(element.attribs);
    const newChildren = transformChildren(element.children, isNative);

    if (newChildren.length) {
      element.children = newChildren;
    }
  });

  return elements.toString().replace(/"?{(.*?)}"?/g, "{$1}");
};
