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