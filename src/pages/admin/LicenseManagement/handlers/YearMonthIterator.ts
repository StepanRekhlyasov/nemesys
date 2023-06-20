export class YearMonthIterator {
  /**
    * @param year in 2023 format
    * @param month in 1-12 format
  */
  constructor(year: number, month: number) {
    this.year = year
    this.month = month
  }
  private month: number
  private year: number

  public minusOneMonth() {
    if (this.month == 1) {
      this.year -= 1
      this.month = 12
      return
    }

    this.month -= 1
  }

  public getData() {
    return { month: this.month, year: this.year }
  }
}
