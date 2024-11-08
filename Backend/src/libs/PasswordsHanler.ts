import bcrypt from "bcrypt";
//quita el hash del password
export const unhashPassword = (
  password: string,
  passwordToCopmare: string
): Promise<boolean> => {
  return bcrypt.compare(password, passwordToCopmare);
};
//hashea password
export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};
