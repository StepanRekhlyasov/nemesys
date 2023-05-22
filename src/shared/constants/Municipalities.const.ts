import { doc, getDoc, getFirestore } from 'firebase/firestore';

export const getMunicipalities = async (prefecture: string) => {
  const db = getFirestore();
  
  const docRef = doc(db, 'metadata', 'regionData');
  const docData = await getDoc(docRef);

  let municipalitiesValue = []

  if (docData.exists()) {
    const regions = docData.data()

    Object.keys(regions).forEach((regionKey) => {
      const foundPrefecture = regions[regionKey].find((pref) => {
        return pref.hasOwnProperty(prefecture)
      })

      if(foundPrefecture) {
        municipalitiesValue = foundPrefecture[prefecture]
      }
    })
  }

  return municipalitiesValue
}