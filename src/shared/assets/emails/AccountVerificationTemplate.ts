export const AccountVerificationTemplate = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title>Verificação de Conta</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        p {
            line-height: inherit;
        }

        @media (max-width:620px) {
            .row-content {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0;">
<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
    <tbody>
    <tr>
        <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                    <td>
                        <table class="row-content" align="center" width="600" border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                            <tr>
                                <td class="column column-1" width="100%" style="padding-top: 20px; text-align: left;">
                                    <table class="paragraph_block" width="100%" border="0" cellpadding="10" cellspacing="0">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#FE7642; font-size:38px; text-align:left;">
                                                    <p><strong>Verifique sua conta</strong></p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block" width="100%" border="0" cellpadding="10" cellspacing="0">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#131B25; font-size:16px; text-align:left;">
                                                    <p>Oi, {{name}}, obrigado por se cadastrar! Para ativar sua conta, utilize o código abaixo.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <br/>
                                    <table class="button_block" width="100%" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#FE7642; font-size:30px; font-weight: bold; text-align:left;">
                                                    <p>{{token}}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <br/>
                                    <table class="paragraph_block" width="100%" border="0" cellpadding="10" cellspacing="0">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#131B25; font-size:14px; text-align:left;">
                                                    <p>Se não solicitou esta verificação, ignore este e-mail.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="paragraph_block" width="100%" border="0" cellpadding="10" cellspacing="0">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#131B25; font-size:14px; text-align:left;">
                                                    <p>Este código expira em 30 minutos. Se precisar de ajuda, entre em contato: <a href="mailto:contato@pedcomvc.club">contato@pedcomvc.club</a></p>
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