export function getWrapSize(val) {
  if (val === undefined) {
    return undefined;
  }
  let wrapSize = Number.parseFloat(val);
  if (Number.isNaN(wrapSize)) {
    throw new TypeError("'wrap' must be a number");
  }
  wrapSize = Math.floor(wrapSize);
  return wrapSize > 0 ? wrapSize : null;
}
