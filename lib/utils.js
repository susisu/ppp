export function isString(val) {
  return typeof val === "string";
}

export function isNumber(val) {
  return typeof val === "number";
}

export function isObject(val) {
  return typeof val === "object" && val !== null;
}

export function isArray(val) {
  return Array.isArray(val);
}
