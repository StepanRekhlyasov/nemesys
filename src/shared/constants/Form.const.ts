export const validateEmail = (email: string): boolean =>{
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
}

export const validateDate = (val: string): boolean =>{
  return /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/.test(val);
}
export const validateTime = (val: string): boolean =>{
  return /[0-9]{2}:[0-9]{2}/.test(val);
}

