export type EnabledPayments =
  | "credit_card"
  | "echannel"
  | "permata_va"
  | "bca_va"
  | "bni_va"
  | "bri_va"
  | "cimb_va"
  | "gopay"
  | "shopeepay"
  | "alfamart"
  | "indomaret"
  | "akulaku"
  | "kredivo";

export type TransactionDetails = {
  order_id: string;
  gross_amount: number;
};

export type Expiry = {
  start_time?: string;
  unit: "minute" | "hour" | "day";
  duration: number;
};

export interface ItemDetails {
  id?: string;
  price: number;
  quantity: number;
  name: string;
  brand?: string;
  category?: string;
  merchant_name?: string;
  url?: string;
}

export interface Address {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country_code?: string;
}

export interface CustomerDetails {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  billing_address?: Address;
  shipping_address?: Address;
}

export interface CreditCard {
  save_card?: boolean;
  secure?: boolean;
  channel?: string;
  bank?: string;
  installment?: {
    required?: boolean;
    terms?: Record<string, number[]>;
  };
  whitelist_bins?: string[];
  dynamic_descriptor?: {
    merchant_name?: string;
    city_name?: string;
    country_code?: string;
  };
}

export interface Callbacks {
  finish?: string;
  error?: string;
}

export interface RequestBody {
  transaction_details: TransactionDetails;
  item_details?: ItemDetails[];
  customer_details?: CustomerDetails;
  enabled_payments?: EnabledPayments[];
  credit_card?: CreditCard;
  bca_va?: {
    va_number?: string;
    sub_company_code?: string;
    free_text?: {
      inquiry?: { en: string; id: string }[];
      payment?: { en: string; id: string }[];
    };
  };
  permata_va?: {
    va_number?: string;
    recipient_name?: string;
  };
  callbacks?: Callbacks;
  expiry?: Expiry;
}

export interface CreateTransactionSuccessResponse {
  token: string;
  redirect_url: string;
}

// https://docs.midtrans.com/reference/sample-response
export interface CreateTransactionErrorResponse {
  error_messages: string[]; // List of error messages explaining what went wrong
}

export type CreateTransactionResponse =
  | CreateTransactionSuccessResponse
  | CreateTransactionErrorResponse;

export interface TransactionStatusResponse {
  status_code: string; // Status code of the transaction charge result
  status_message: string; // Description of the transaction charge result
  transaction_id: string; // Transaction ID provided by Midtrans
  order_id: string; // Order ID specified by the merchant
  gross_amount: string; // Total amount of the transaction in IDR
  payment_type: string; // Payment method used by the customer
  transaction_time: string; // Timestamp of the transaction (ISO 8601, GMT+7)
  transaction_status:
    | "capture"
    | "settlement"
    | "deny"
    | "authorize"
    | "pending"
    | "expire"
    | "cancel"; // Current status of the transaction
  fraud_status?: "accept" | "challenge" | "deny"; // Fraud Detection System (FDS) result
  approval_code?: string; // Approval code from the payment provider
  signature_key?: string; // Key to validate notifications from Midtrans
  bank?: string; // Acquiring bank of the transaction
  masked_card?: string; // Masked credit card number (first 8 and last 4 digits)
  channel_response_code?: string; // Response code from the payment channel provider
  channel_response_message?: string; // Response message from the payment channel provider
  card_type?: "credit" | "debit"; // Type of card used in the transaction
  payment_option_type?: string; // Type of payment (e.g., GOPAY_WALLET, PAY_LATER)
  shopeepay_reference_number?: string; // ShopeePay reference number (if applicable)
  reference_id?: string; // Reference ID given by the payment provider
  refund_amount?: string; // Cumulative refund amount in IDR
  refunds?: RefundDetail[]; // List of refund details for the transaction
}

export interface RefundDetail {
  refund_chargeback_id: string; // Midtrans refund ID
  refund_amount: string; // Amount refunded in IDR
  created_at: string; // Timestamp of when the refund was created
  reason: string; // Reason for the refund
}

export interface CancelTransactionResponse {
  status_code: string; // Status code of the transaction cancel result
  status_message: string; // Description of the transaction cancel result
  transaction_id: string; // Transaction ID assigned by Midtrans
  masked_card?: string; // First 8-digits and last 4-digits of the customer's credit card (if applicable)
  order_id: string; // Order ID specified by the merchant
  payment_type: string; // Payment method used by the customer
  transaction_time: string; // Timestamp of the transaction (ISO 8601 format, GMT+7)
  transaction_status: "cancel"; // Status of the transaction (e.g., "cancel")
  fraud_status?: "accept" | "deny"; // Fraud Detection System (FDS) result
  bank?: string; // Acquiring bank for the transaction (if applicable)
  gross_amount: string; // Total amount of the transaction in IDR
}
