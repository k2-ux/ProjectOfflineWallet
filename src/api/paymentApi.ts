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
      // 🌐 simulate network issue
      if (Math.random() < 0.2) {
        reject(new Error('Network error'));
        return;
      }

      // 🛑 idempotency check
      if (processedTransactions.has(req.transactionId)) {
        resolve({ success: true });
        return;
      }

      // 💳 simulate payment failure
      if (Math.random() < 0.2) {
        resolve({ success: false });
        return;
      }

      // ✅ success
      processedTransactions.add(req.transactionId);
      resolve({ success: true });
    }, 1000);
  });
};
