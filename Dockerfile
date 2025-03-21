# Utilizando a versão leve do Node.js
FROM node:20-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando apenas os arquivos necessários para instalação inicial
COPY package*.json ./

# Instalação das dependências (incluindo dependências de desenvolvimento)
RUN npm install

# Copiar todo o código para dentro do contêiner
COPY . .

# Instalação do nodemon para desenvolvimento
RUN npm install --save-dev nodemon

# Expor a porta padrão do NestJS
EXPOSE 8000

# Comando para iniciar o servidor no modo dev
CMD ["npm", "run", "start:dev"]