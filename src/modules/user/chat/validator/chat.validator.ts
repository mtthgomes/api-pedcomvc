import { ChatDto } from "../dto/create.dto";

export class ChatValidator {
  static validate(dependentDto: ChatDto): { error: boolean; data: string } {
    if (!dependentDto.dependentId || !dependentDto.doctorId) {
      return { error: true, data: 'Dependente e médico são obrigatorios' };
    }

    return { error: false, data: 'Validação bem-sucedida.' };
  }
}