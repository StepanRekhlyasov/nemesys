/* eslint-disable @typescript-eslint/no-explicit-any */

export const recursivelyRemoveField = (obj: any, fieldToRemove: string) => {
    for (const prop in obj) {
        if (typeof obj[prop] === 'object' && obj[prop] !== null) {
            recursivelyRemoveField(obj[prop], fieldToRemove);
        }
        if (prop === fieldToRemove) {
            delete obj[prop];
        }
    }
}

export const safeGet = (obj: any, path: string): any => {
     if (!obj) {
    return
  }

  return path.split('.').reduce((acc: any, part: string) => acc && acc[part], obj);
}

export function arraysAreEqual(a: Array<any>, b: Array<any>) {

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }


  if (a.length !== b.length) {
    return false;
  }

  const sortedA = JSON.stringify([...a].sort());
  const sortedB = JSON.stringify([...b].sort());

  return sortedA === sortedB;
}

export function deepMerge(target: any, source: any) {
    const isObject = (obj: any) => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    Object.keys(source).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = sourceValue;
        } else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
}

export function deepCopy(obj: any) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (Array.isArray(obj)) {
        return obj.map(deepCopy);
    }

    const copiedObject = Object.assign({}, obj);
    Object.keys(copiedObject).forEach(key => {
        copiedObject[key] = deepCopy(copiedObject[key]);
    });

    return copiedObject;
}