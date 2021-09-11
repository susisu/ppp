import * as config from "./config.js";
import { union, difference } from "./utils.js";

export function getFields(conf, opts, defaultFields) {
  let fields = config.getFields(conf) || defaultFields;
  fields = difference(union(fields, opts.includeField), opts.excludeField);
  return fields;
}

export function getWrapSize(conf, opts, defaultWrapSize) {
  let wrapSize = parseWrapSize(opts.wrap);
  if (wrapSize !== undefined) {
    return wrapSize;
  }
  wrapSize = config.getWrapSize(conf);
  if (wrapSize !== undefined) {
    return wrapSize;
  }
  return defaultWrapSize;
}

function parseWrapSize(val) {
  if (val === undefined) {
    return undefined;
  }
  let wrapSize = Number.parseFloat(val);
  if (Number.isNaN(wrapSize)) {
    throw new Error("Failed to read option: --wrap must be a number");
  }
  wrapSize = Math.floor(wrapSize);
  return wrapSize > 0 ? wrapSize : null;
}
