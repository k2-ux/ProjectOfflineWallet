export type TransactionStatus =
  | 'INITIATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED';

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  retryCount: number;
  createdAt: number;
  updatedAt: number;
}
