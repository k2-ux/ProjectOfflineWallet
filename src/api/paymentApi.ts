import { http } from './httpClient';

type PayArgs = {
  transactionId: string;
  amount: number;
};

export const payApi = async ({ transactionId, amount }: PayArgs) => {
  return http('/payments', {
    method: 'POST',
    body: JSON.stringify({
      transactionId,
      amount,
    }),
  });
};

export const getPaymentStatus = async (transactionId: string) => {
  return http(`/payments/${transactionId}`);
};
