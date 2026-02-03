import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    paypal: any;
    gtag?: (...args: any[]) => void;
  }
}

interface PayPalButtonProps {
  amount: number;
  onSuccess: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!window.paypal) return;
    if (!containerRef.current) return;
    if (renderedRef.current) return;

    renderedRef.current = true;

    window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,

      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'pill',
        label: 'paypal',
      },

      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount.toFixed(2),
                currency_code: 'EUR',
              },
            },
          ],
        });
      },

      onApprove: async (_data: any, actions: any) => {
        try {
          // ✅ Evento Google Analytics: PayPal aprobado
          if (window.gtag) {
            window.gtag('event', 'paypal_approved', {
              event_category: 'payment',
              event_label: 'paypal',
              value: amount,
              currency: 'EUR',
            });
          }

          await actions.order.capture();
          onSuccess();
        } catch (err) {
          console.error('Capture error:', err);
        }
      },

      onError: (err: any) => {
        console.error('PayPal error:', err);
      },
    }).render(containerRef.current);
  }, [amount, onSuccess]);

  return <div ref={containerRef} />;
};

export default PayPalButton;
