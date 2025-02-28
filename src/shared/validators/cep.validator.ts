export function isValidCEP(cep) {
  // Remover espaços em branco e hífens do CEP
  cep = cep.replace(/\s+|-/g, "");
  // Verificar se o CEP possui 8 caracteres
  if (cep.length !== 8) {
    return false;
  }
  // Verificar se o CEP é composto apenas por números
  return cep.split("").every((char) => !isNaN(char));
}