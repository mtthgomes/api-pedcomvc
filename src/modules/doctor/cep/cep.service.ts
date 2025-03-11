import { array_cities, array_estados } from '@app/shared/data/states-and-cities';
import { PrismaService } from '@app/shared/database/prisma.service';
import { MyLogger } from '@app/shared/services/logger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorCepService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger
  ) {}

  async generate(): Promise<{ error: boolean; data: string | object }> {
    try {
      for (const [stateCode, stateName] of array_estados) {
        // 🔹 Verifica se o estado já existe
        const existingState = await this.prisma.state.findUnique({
          where: { abbreviation: stateCode }
        });
  
        if (!existingState) {
          // 🔹 Cria o Estado
          const state = await this.prisma.state.create({
            data: {
              name: stateName,
              abbreviation: stateCode,
              countryId: "5f4f6552-e23f-4ee0-ae9e-2c86dd440fe5"
            }
          });
  
          // 🔹 Cria as cidades associadas ao Estado
          const cities = array_cities.find(([code]) => code === stateCode);
  
          if (cities && Array.isArray(cities[1])) {
            const cityData = cities[1].map((city) => ({
              name: city[0],
              stateId: state.id,
            }));
  
            if (cityData.length > 0) {
              await this.prisma.city.createMany({ data: cityData });
            }
          }
        }
      }
  
      return { error: false, data: '✅ Estados e cidades cadastrados com sucesso!' };
    } catch (error) {
      this.logger.error('GENERATE_STATES_AND_CITIES_ERROR', error);
      return { error: true, data: `Erro ao gerar estados e cidades: ${error.message}` };
    }
  }  

  async listStates(): Promise<{ error: boolean; data: string|object }> {
    try {
      return { error: false, data: await this.prisma.state.findMany() };
    } catch (error) {
      this.logger.error('LIST_STATES_ERROR_DOCTOR', error);
      return { error: true, data: `Erro ao listar estados` };
    }
  }
  
  async listCitys(stateId: string): Promise<{ error: boolean; data: string|object }> {
    try {
      return { error: false, data: await this.prisma.city.findMany({
        where: {stateId},
        orderBy: {name: "asc" }
      }) };
    } catch (error) {
      this.logger.error('LIST_CITY_BY_STATE_ERROR_DOCTOR', error);
      return { error: true, data: `Erro ao listar cidades` };
    }
  }
}