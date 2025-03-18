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
    } catch (err) {
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
    } catch (err) {
        return null;
    }
};

const sendWhatsAppButtonMessage = async (number, title, description, footer) => {
    const data = {
        number: number, // Número do destinatário com DDD e DDI (ex: 551199999999)
        title: title,   // Título do botão
        description: description, // Descrição do botão
        footer: footer, // Rodapé do botão
        buttons: [
            {
                "type": "copy",
                "displayText": "Copia Código",
                "copyCode": "ZXN0ZSDDqSB1bSBjw7NkaWdvIGRlIHRleHRvIGNvcGnDoXZlbC4="
            },
        ],
        delay: 1 // Delay opcional para evitar bloqueios
    };

    try {
        const response = await apievo.post('', data);
    } catch (err) {
    }
};

export { sendVerificationCode, sendRecoveryCode };