export const DoctorWelcomeTemplate = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title>Bem-vindo ao PedComVc!</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
        #MessageViewBody a { color: inherit; text-decoration: none; }
        p { line-height: inherit; }
        .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
        .image_block img+div { display: none; }

        @media (max-width:620px) {
            .desktop_hide table.icons-inner, .social_block.desktop_hide .social-table {
                display: inline-block !important;
            }
            .icons-inner { text-align: center; }
            .icons-inner td { margin: 0 auto; }
            .mobile_hide { display: none; }
            .row-content { width: 100% !important; }
            .stack .column { width: 100%; display: block; }
            .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; }
            .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
        }
    </style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF;">
    <tbody>
    <tr>
        <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF;">
                <tbody>
                <tr>
                    <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color: #000000; width: 600px; margin: 0 auto;" width="600">
                            <tbody>
                            <tr>
                                <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; padding-top: 20px; vertical-align: top;">
                                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                            <td class="pad" style="width:100%;">
                                                <div class="alignment" align="center" style="line-height:10px">
                                                    <img src="https://pedcomvc.club/logo.png" alt="PedComVc" style="display: block; width: 200px; margin-bottom: 15px;">
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#FE7642;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:38px;line-height:120%;text-align:left;">
                                                    <p style="margin: 0; word-break: break-word;"><strong>Bem-vindo ao PedComVc, {{name}}!</strong></p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#131B25;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;line-height:120%;text-align:left;">
                                                    <p style="margin: 0; word-break: break-word;">
                                                        Estamos muito felizes por tê-lo(a) conosco! No PedComVc, você terá a oportunidade de ampliar sua base de pacientes e potencializar seus ganhos oferecendo atendimento remoto de forma prática e segura.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#131B25;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;line-height:120%;text-align:left;">
                                                    <p style="margin: 0; word-break: break-word;">
                                                        📋 <strong>Próximo Passo:</strong> Para começar a atender, basta preencher algumas informações necessárias para que possamos autorizar seu cadastro.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#131B25;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;line-height:120%;text-align:left;">
                                                    <p style="margin: 0; word-break: break-word;">
                                                        Se precisar de ajuda, estamos aqui! Entre em contato conosco pelo
                                                        <a href="mailto:contato@pedcomvc.club" style="color: #FE7642; text-decoration: none;">
                                                            contato@pedcomvc.club
                                                        </a>
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#131B25;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px;line-height:120%;text-align:center;">
                                                    <p style="margin: 0; word-break: break-word;">
                                                        Copyright© 2025 - PedComVc.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>
</body>
</html>
`