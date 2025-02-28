import { isCNPJ } from 'validation-br'
export function isValidCNPJ(cnpj: string): boolean {
  const isValid = isCNPJ(cnpj);

  return isValid;
}