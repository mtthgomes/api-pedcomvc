import { Injectable } from "@nestjs/common";
import { LoginDto } from "../dtos/auth/login.Dto";

@Injectable()
export class ValidatorLoginUseCase {
  constructor(){}

  async execute(loginDto: LoginDto): Promise<{ error: boolean; data: string }> {
    if(loginDto.email === '' || loginDto.password === '' || 
      loginDto.email === null || loginDto.password === null){
        return { error: true, data: "O campo email e senha precisam estar preenchidos."}
      }
      return { error: false, data: "Todos os campos estão preenchidos"}
  }
}