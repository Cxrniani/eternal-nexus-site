import type { NextApiRequest, NextApiResponse } from 'next';

// Inicializa o cliente Mercado Pago com o token de acesso
const mercadopago = require('mercadopago');

// Configura o SDK do Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const {
    transaction_amount,
    token,
    description,
    installments,
    paymentMethodId,
    issuer,
    email,
    identificationType,
    number,
  } = req.body;

  try {
    // Cria o pagamento com os dados fornecidos
    const paymentData = {
      transaction_amount: Number(transaction_amount),
      token,
      description,
      installments: Number(installments),
      payment_method_id: paymentMethodId,
      issuer_id: issuer,
      payer: {
        email,
        identification: {
          type: identificationType,
          number,
        },
      },
    };

    const response = await mercadopago.payment.save(paymentData);

    // Retorna o resultado do pagamento para o cliente
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor',
    });
  }
}
