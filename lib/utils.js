export function isNumber(val) {
  return typeof val === "number";
}

export function isString(val) {
  return typeof val === "string";
}

export function isObject(val) {
  return typeof val === "object" && val !== null;
}

export function isArray(val) {
  return Array.isArray(val);
}

function unique(xs) {
  const included = new Set();
  const res = [];
  for (const x of xs) {
    if (!included.has(x)) {
      res.push(x);
      included.add(x);
    }
  }
  return res;
}

export function union(xs, ys) {
  return unique([...xs, ...ys]);
}

export function difference(xs, ys) {
  const excluded = new Set(ys);
  return unique(xs.filter(x => !excluded.has(x)));
}
