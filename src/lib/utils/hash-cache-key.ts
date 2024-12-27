function hasObjectPrototype(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Object]";
}

// Copied from: https://github.com/jonschlinkert/is-plain-object
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function isPlainObject(o: any): o is Object {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has no constructor
  const ctor = o.constructor;
  if (ctor === undefined) {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }

  // Handles Objects created by Object.create(<arbitrary prototype>)
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

// Copied from function HasKey from: https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts
export function hashCacheKey(key: any): string {
  return JSON.stringify(key, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {} as any)
      : val
  );
}
