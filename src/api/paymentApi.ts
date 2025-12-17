type PayRequest = {
  transactionId: string;
  amount: number;
};

type PayResponse = {
  success: boolean;
};

const processedTransactions = new Set<string>();

export const payApi = async (
  req: PayRequest,
): Promise<PayResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error('Network error'));
        return;
      }

      if (processedTransactions.has(req.transactionId)) {
        resolve({ success: true });
        return;
      }

      if (Math.random() < 0.2) {
        resolve({ success: false });
        return;
      }

      processedTransactions.add(req.transactionId);
      resolve({ success: true });
    }, 1000);
  });
};
