import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    paypal: any;
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
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'pill',
        label: 'paypal',
      },
      createOrder: (_: any, actions: any) => {
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
      onApprove: async (_: any, actions: any) => {
        await actions.order.capture();
        onSuccess();
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('Error en el pago con PayPal');
      },
    }).render(containerRef.current);
  }, [amount, onSuccess]);

  return <div ref={containerRef} />;
};

export default PayPalButton;
