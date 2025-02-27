import Shurjopay, {
  PaymentRequest,
  PaymentResponse,
  VerificationResponse,
} from 'shurjopay';
import config from '../../config';

const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp.endpoint!,
  config.sp.username!,
  config.sp.password!,
  config.sp.prefix!,
  config.sp.return_url!,
);

// console.log(shurjopay);

const makePaymentAsync = async (paymentPayload: {
  [key: string]: string;
}): Promise<PaymentResponse> => {
  return new Promise<PaymentResponse>((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload as unknown as PaymentRequest, // Type assertion
      (response: unknown) => {
        resolve(response as PaymentResponse);
      },
      (error: unknown) => reject(error),
    );
  });
};

const verifyPaymentAsync = (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (
        response: VerificationResponse[] | PromiseLike<VerificationResponse[]>,
      ) => resolve(response),
      (error: unknown) => reject(error),
    );
  });
};

const generateOrderId = (prevId?: string): string => {
  // Format: INV-YYYYMMDD-XXXX where XXXX is a sequential number

  // Extract current date in YYYYMMDD format
  const today = new Date();
  const dateStr =
    today.getFullYear().toString() +
    (today.getMonth() + 1).toString().padStart(2, '0') +
    today.getDate().toString().padStart(2, '0');

  let sequenceNumber = 1; // Default starting value

  // If previous ID exists and follows the expected format, increment its sequence number
  if (prevId && prevId.includes('INV-')) {
    const parts = prevId.split('-');
    if (parts.length === 3) {
      const prevDate = parts[1];
      const prevSequence = parseInt(parts[2], 10);

      // If same date, increment sequence; otherwise start from 1
      if (prevDate === dateStr) {
        sequenceNumber = prevSequence + 1;
      }
    }
  }

  // Format sequence number to 4 digits with leading zeros
  const formattedSequence = sequenceNumber.toString().padStart(4, '0');

  // Combine all parts into the final order ID
  return `INV-${dateStr}-${formattedSequence}`;
};

export const orderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
  generateOrderId,
};
