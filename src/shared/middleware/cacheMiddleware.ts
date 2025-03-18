import { Prisma } from '@prisma/client';
import * as NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 🔹 5 minutos de cache

export function cacheMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    // 🔎 Cache apenas para consultas `find` (select, findUnique, etc.)
    if (params.action === 'findUnique' || params.action === 'findMany') {
      const bypassCache = params.args?.bypassCache === true; // 🔹 Flag para ignorar cache

      if (!bypassCache) {
        const cacheKey = `${params.model}_${JSON.stringify(params.args)}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
          return cachedData; // 🚀 Retorna do cache se existir
        }

        const result = await next(params);
        cache.set(cacheKey, result); // 🔄 Armazena resultado no cache

        return result;
      }
    }

    // 🔄 Após uma inserção ou atualização, limpe o cache para garantir dados atualizados
    if (['create', 'update', 'delete'].includes(params.action)) {
      cache.flushAll(); // 🚨 Limpa todo o cache após mudanças críticas
    }

    return next(params); // ⏩ Continua normalmente para outras ações
  };
}
