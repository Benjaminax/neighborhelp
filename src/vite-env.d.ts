/// <reference types="vite/client" />

declare module '@paystack/inline-js' {
  type PaystackTransaction = {
    reference: string
    message: string
  }

  type PaystackTransactionOptions = {
    key: string
    email: string
    amount: number
    currency: string
    channels: string[]
    metadata: Record<string, string>
    onSuccess: (transaction: PaystackTransaction) => void
    onCancel: () => void
    onError: (error: { message: string }) => void
  }

  export default class PaystackPop {
    newTransaction(options: PaystackTransactionOptions): void
  }
}
