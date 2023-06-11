import { deepCopy, arraysAreEqual, deepMerge } from 'src/shared/utils';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';

export const finishEditing = (
  changedData: Array<{ label: string; value: string | number | boolean | string[]; editType: string; key: string }>,
  draft: Partial<ClientFactory>,
  clientFactory: ClientFactory,
) => {
  changedData.forEach(({key, value}) => {
    const keys = key.split('.'); 
    let nestedObj = draft;
    let nestedOriginalObj = deepCopy(clientFactory);
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      if (!nestedOriginalObj || typeof nestedOriginalObj !== 'object') {
        throw new Error(`clientFactory does not contain the key: ${currentKey}`);
      }
      if (i === keys.length - 1) {
        // Check if both values are arrays
        if (Array.isArray(nestedOriginalObj[currentKey]) && Array.isArray(value)) {
          // Use arraysAreEqual function to compare
          if (arraysAreEqual(nestedOriginalObj[currentKey], value)) {
            if (nestedObj.hasOwnProperty(currentKey)) {
              delete nestedObj[currentKey];
            }
          } else {
            nestedObj[currentKey] = value;
          }
        } else {
          if (nestedOriginalObj[currentKey] === value) {
            if (nestedObj.hasOwnProperty(currentKey)) {
              delete nestedObj[currentKey];
            }
          } else {
            nestedObj[currentKey] = value;
          }
        }
      } else {
        nestedOriginalObj = nestedOriginalObj[currentKey];
        nestedObj[currentKey] = nestedObj[currentKey] || {};
        nestedObj = nestedObj[currentKey];
      }
    }
  });
}

export const mergeWithDraft = (dataToMerge: ClientFactory | ModifiedCF, draft: Partial<ClientFactory>) => {
  const copyData = deepCopy(dataToMerge)

  return deepMerge(copyData, draft)
}