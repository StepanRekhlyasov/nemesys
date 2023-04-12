export class RankCount {
	static getRank (rank: number) {
		if (rank >= 90) {
			return 'S'
		}
		if (rank >= 80) {
			return 'A'
		}
		if (rank >= 60) {
			return 'B'
		}
		if (rank >= 40) {
			return 'C'
		}
		if (rank >= 20) {
			return 'D'
		}
		return 'E'
	}
	
	static countRank(applicant): number {
		let count = 0
		// workable days per week
		count+= this.countDaysPerWeek(applicant)
		// workable day of the week
		count+= this.countWorkableDay(applicant)
		// available shift
		count+= this.countAvaiableShift(applicant)
		// commuting Time
		count+= this.countCommutingTime(applicant)
		// attracting qualification
		count+= this.countQualification(applicant)

		// total year
		if (applicant['totalYear'] < 1) {
			count+= -10
		}
		// Tattoos
		if (applicant['tattoos'] == 'yes'){
			count+= -10
		}
		// Medical History
		if (applicant['medicalHistory'] == 'yes'){
			count+= -10
		}
		if (applicant['dob']) {
			count+=this.countAge(applicant)
		}
		return count
	}

	// Calculation of rank from commuting time 
	static countCommutingTime(applicant):number {
		if (applicant['commutingTime'] < 15){
			return 0;
		}
		if (applicant['commutingTime'] < 30){
			return 2;
		}
		if (applicant['commutingTime'] < 45){
			return 4;
		}
		if (applicant['commutingTime'] < 90){
			return 8;
		}
		return 10  
	}

	// Calculation of rank from avaiable shift 
	static countAvaiableShift(applicant):number {  
		let count = 0;
		const arrayAvailableShift = [
			applicant['workingHoursEarly'] || null,
			applicant['workingHoursDay'] || null,
			applicant['workingHoursLate'] || null,
			applicant['workingHoursNight'] || null,
		]
		arrayAvailableShift.map(shift => {
			switch(shift){
				case (true):
					count+=5;
					break
				case (null):
					count+=2.5;
			}
		})
		return count;
	}

	// Calculation of rank from days available for work
	static countWorkableDay(applicant):number {
		let count = 0;
		if (applicant['daysPerWeek']) {
			applicant['daysPerWeek'].map(day => {
				switch(day) {
					case 'monday':
					case 'tuesday':
					case 'wednesday':
					case 'friday':
						count+=3;
					break;
					case 'saturday':
					case 'sunday':
						count+=7;
					break;
					case 'holiday':
						count+=6;
					break;
				}
			})
		}
		return count;
	}

	// Calculation of rank from days available for work per week
	static countDaysPerWeek(applicant):number {
		if (applicant['daysToWork']) {
			switch(applicant['daysToWork']){
				case 3:
					return 15;
				case 4:
					return 20;
				case 5:
					return 35;
			}
		}
		return 0;
	}

	// Calculation of rank from applicant age
	static countAge(applicant):number {
		if (applicant['dob']) {
			const age = this.ageCount(applicant['dob']);
			if (age > 70) {
				return -50
			}
			if (age > 60) {
				return -40
			}
			if (age > 50) {
				return -5
			}
		}
		return 0
	}

	// Calculation of rank from qualification
	static countQualification(applicant):number {
		if (applicant['qualification']) {
			if (applicant['qualification'] == 'newcomer' || applicant['qualification'] == 'careWorker') {
				return -50;
			}
		}
		return 0;
	}

	// Applicant age calculation
	static ageCount(data: string) {
		const now = new Date()
		let diff =(now.getTime() - new Date(data).getTime()) / 1000;
		diff /= (60 * 60 * 24);
		return Math.abs(Math.round(diff/365.25));
	}
}