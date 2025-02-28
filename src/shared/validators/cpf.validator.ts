import { isCPF } from 'validation-br'
export function isValidCPF(cpf: string): boolean {
  const isValid = isCPF(cpf);

  return isValid;
}