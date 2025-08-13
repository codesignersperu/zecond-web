export type Balance = {
  availableBalance: number;
  lockedBalance: number;
};

type Transaction = {
  id: number;
  amount: number;
  status:
    | "pending"
    | "processing"
    | "pending-clearance"
    | "succeeded"
    | "failed"
    | "payment-failed"
    | "cancelled"
    | "refunded"
    | "rejected";
  createdAt: string;
  updatedAt: string;
};

export type TransactionType = "order" | "withdrawal";

export type OrderTransaction = {
  type: Extract<TransactionType, "order">;
  orderId: number;
  productId: number;
  order: {
    id: number;
    buyer: {
      firstName: string;
      lastName: string;
    };
  };
} & Transaction;

export type WithdrawalTransaction = {
  type: Extract<TransactionType, "withdrawal">;
  accountId: number;
  account: Pick<WithdrawalAccount, "bank" | "accountNumber">;
} & Transaction;

export type WithdrawalAccount = {
  id: number;
  bank: string;
  accountNumber: string;
  cciNumber: number;
  isPrimary: boolean;
};
