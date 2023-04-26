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
      const organizationsQuery = query(collection(db, path), ...constraintsArray, limit(rowsPerPage))
      return await mapResult(organizationsQuery)
    }

    async function nextPage() {
      const nextQuery = query(collection(db, path), ...constraintsArray, startAfter(lastSnapshot.docs[lastSnapshot.docs.length - 1]), limit(rowsPerPage))
      return await mapResult(nextQuery)
    }

    async function prevPage() {
      const prevQuery = query(collection(db, path), ...constraintsArray, endBefore(lastSnapshot.docs[0]), limitToLast(rowsPerPage))
      return await mapResult(prevQuery)
    }

    async function getLast() {
      const nextQuery = query(collection(db, path), ...constraintsArray, limitToLast(1))
      return await mapResult(nextQuery)
    }

    async function refreshPage() {
      return await mapResult(lastQuery)
    }

    async function mapResult(query: Query<DocumentData>) {
      const snapshot = await getDocs(query);
      lastSnapshot = snapshot
      lastQuery = query
      return snapshot?.docs.map((organization) => {
        return organization.data() as unknown
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
      getLast,
      refreshPage,
      setConstraints,
    }
  }


  return { queryData }
})
