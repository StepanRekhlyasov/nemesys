
export enum INQUIRY_STATUS {
  answered = 'answered',
  unanswered = 'unanswered'
 }

export enum INQUIRY_MESSAGE_TYPE {
  issue = 'issue',
  response = 'response'
}

export type InquiryMessage = {
  date: Date
  messageDate?: string,
  content: string
  type: INQUIRY_MESSAGE_TYPE.issue | INQUIRY_MESSAGE_TYPE.response
}
