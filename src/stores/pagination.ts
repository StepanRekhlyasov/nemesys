import { collection, DocumentData, endBefore, getCountFromServer, getDocs, getFirestore, limit, limitToLast, Query, query, QueryOrderByConstraint, QuerySnapshot, startAfter } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ElementOf } from 'src/shared/types/ElementOf';
import { ConstraintsType } from 'src/shared/utils/utils';

export const usePagination = defineStore('pagination', () => {
  const db = getFirestore()

  function queryData(rowsPerPage: number, path: string, order: QueryOrderByConstraint, constraints?: ConstraintsType) {

    let lastSnapshot: QuerySnapshot<DocumentData>
    let lastQuery: Query<DocumentData>

    let constraintsArray: (QueryOrderByConstraint | ElementOf<ConstraintsType>)[] = [order]

    if (constraints) {
      constraintsArray.push(...constraints)
    }

    async function firstPage() {
      const firstPageQuery = query(collection(db, path), ...constraintsArray, limit(rowsPerPage))
      return await mapResult(firstPageQuery)
    }

    async function nextPage() {
      const nextPageQuery = query(collection(db, path), ...constraintsArray, startAfter(lastSnapshot.docs[lastSnapshot.docs.length - 1]), limit(rowsPerPage))
      return await mapResult(nextPageQuery)
    }

    async function prevPage() {
      const prevPageQuery = query(collection(db, path), ...constraintsArray, endBefore(lastSnapshot.docs[0]), limitToLast(rowsPerPage))
      return await mapResult(prevPageQuery)
    }

    async function lastPage() {
      const lastPageQuery = query(collection(db, path), ...constraintsArray, limitToLast(1))
      return await mapResult(lastPageQuery)
    }

    async function refreshPage() {
      return await mapResult(lastQuery)
    }

    async function mapResult(query: Query<DocumentData>) {
      const snapshot = await getDocs(query);
      lastSnapshot = snapshot
      lastQuery = query
      return snapshot?.docs.map((doc) => {
        return doc.data() as unknown
      })
    }

    async function count() {
      let coll: Query<DocumentData> = collection(db, path)
      if (constraints) {
        coll = query(collection(db, path), ...constraints)
      }
      const snapshot = await getCountFromServer(coll)
      return snapshot.data().count
    }

    function setConstraints(newConstraints: ConstraintsType){
      constraintsArray = [order, ...newConstraints]
    }


    return {
      nextPage,
      prevPage,
      firstPage,
      count,
      lastPage,
      refreshPage,
      setConstraints,
    }
  }


  return { queryData }
})
