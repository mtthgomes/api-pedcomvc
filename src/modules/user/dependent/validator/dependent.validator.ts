import { DependentDto } from "../dto/create.dto";

export class DependentValidator {
  static validate(dependentDto: DependentDto): { error: boolean; data: string } {
    if (!dependentDto.name || dependentDto.name.trim().length < 3) {
      return { error: true, data: 'O nome do dependente deve ter pelo menos 3 caracteres.' };
    }

    if (!dependentDto.birthDate) {
      return { error: true, data: 'A data de nascimento é obrigatória.' };
    }

    return { error: false, data: 'Validação bem-sucedida.' };
  }
}