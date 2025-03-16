import axios from "axios";

const apievo = axios.create({
  baseURL: "https://evolutionapi.catalaonoticias.com.br/message/sendText/token", 
  headers: {
    'Content-Type': 'application/json',
    'apikey': '8063d2ec6e2013e6e58f2f9b025c0c42', 
  }
});

const sendVerificationCode = async (number, code) => {

    const message = `
        🔐 PedComVc - Código de verificação: ${code}

        Use esse código para confirmar seu acesso. Ele expira em 10 minutos.

        Se você não solicitou este código, ignore esta mensagem.
    `.trim();

    const data = {
        number: `55${number}`, 
        textMessage: {  
            text: message  
        },
        delay: 1,
    };

    try {
        const response = await apievo.post('', data); 
        console.log(`✅ Código enviado com sucesso para ${number}: ${code}`);
    } catch (err) {
        console.error('❌ Erro ao enviar o código:', err.response?.data || err);
        return null;
    }
};

const sendRecoveryCode = async (number, code) => {

    const message = `
        🔐 PedComVc - Código para Redefinição de Senha: ${code}

        Use esse código para confirmar seu acesso. Ele expira em 30 minutos.

        Se você não solicitou este código, ignore esta mensagem.
    `.trim();

    const data = {
        number: `55${number}`, 
        textMessage: {  
            text: message  
        },
        delay: 1,      
    };

    try {
        const response = await apievo.post('', data); 
        console.log(`✅ Código enviado com sucesso para ${number}: ${code}`);
    } catch (err) {
        console.error('❌ Erro ao enviar o código:', err.response?.data || err);
        return null;
    }
};

export { sendVerificationCode, sendRecoveryCode };