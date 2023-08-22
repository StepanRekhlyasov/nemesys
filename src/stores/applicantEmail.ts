import { doc, getFirestore, collection, getDocs, query, runTransaction, serverTimestamp } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ConstraintsType } from 'src/shared/utils/utils';
import { Applicant, ApplicantEmail } from 'src/shared/model';

export const useApplicantEmail = defineStore('applicantEmail', () => {
	const db = getFirestore();

	async function createApplicant(data: Applicant){

		const aid=data.id;
		const eid=data.email;
		const mailRef = doc(db,'applicantEmails/'+eid);
		const docRef = doc(db,'applicants/'+aid);

		const data2={
			email:eid,
			applicant_id:aid,
			created_at:serverTimestamp(),
			updated_at:serverTimestamp()
		}
		data.created_at=serverTimestamp();
		data.updated_at=serverTimestamp();

		await runTransaction(db,async (trx)=>{
			const mailSnap=await trx.get(mailRef);
			if(mailSnap.exists())return Promise.reject(eid+' already exists');

			trx.set(mailRef,data2);
			trx.set(docRef,data);
			return {applicant:data,applicantEmail:data2}
		});
	}

	async function getApplicantEmailsByConstraints(constraints: ConstraintsType) {
		const q = query(collection(db, 'applicantEmails'), ...constraints);
		const snapshot = await getDocs(q);
		return snapshot?.docs.map((doc) => {
			return doc.data() as ApplicantEmail
		})
	}

	return {
		createApplicant,
		getApplicantEmailsByConstraints,
	}
})
