import camelcase from "camelcase";
import { COLOR_PATTERNS } from "../constants";
import type { AttributeMap } from "../types";

export const convertAttrsToReactAttrs = (attributes: AttributeMap): AttributeMap => {
  const keyValues = Object.entries(attributes).map(([key, value]) => {
    const newKey = camelcase(key);
    let newValue = value;

    if (COLOR_PATTERNS.REPLACEABLE.test(value)) {
      newValue = "{color}";
    }

    if (COLOR_PATTERNS.SIZE.test(newKey) && value === "24") {
      newValue = "{size}";
    }

    return { [newKey]: newValue };
  });

  return Object.assign({}, ...keyValues);
};

export const capitalizeElementName = (name: string): string => {
  return name[0].toUpperCase() + name.slice(1);
};
