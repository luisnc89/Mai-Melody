import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

declare global {
  interface Window {
    paypal?: any
    gtag?: (...args: any[]) => void
  }
}

interface PayPalButtonProps {
  amount: number
  language: 'es' | 'en' | 'ca' | 'fr' | 'it'
  onSuccess?: () => void
}

const THANKS_ROUTES: Record<PayPalButtonProps['language'], string> = {
  es: '/es/gracias',
  en: '/en/thanks',
  ca: '/ca/gracies',
  fr: '/fr/merci',
  it: '/it/grazie',
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  language,
  onSuccess,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (renderedRef.current) return
    if (!containerRef.current) return

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

    if (!clientId) {
      console.error('❌ Missing VITE_PAYPAL_CLIENT_ID')
      return
    }

    const loadPayPalScript = () =>
      new Promise<void>((resolve, reject) => {
        if (document.getElementById('paypal-sdk')) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.id = 'paypal-sdk'
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture`
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('PayPal SDK failed to load'))
        document.body.appendChild(script)
      })

    const renderButton = async () => {
      if (!window.paypal) {
        await loadPayPalScript()
      }

      if (!window.paypal || !containerRef.current) return

      window.paypal
        .Buttons({
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
            })
          },

          onApprove: async (_data: any, actions: any) => {
            try {
              await actions.order.capture()

              if (window.gtag) {
                window.gtag('event', 'purchase', {
                  event_category: 'payment',
                  event_label: 'paypal',
                  value: amount,
                  currency: 'EUR',
                })
              }

              if (onSuccess) {
                onSuccess()
              }

              const thanksUrl = THANKS_ROUTES[language]
              navigate(thanksUrl, { replace: true })
            } catch (err) {
              console.error('❌ Error capturing PayPal order:', err)
            }
          },

          onError: (err: any) => {
            console.error('❌ PayPal error:', err)
          },
        })
        .render(containerRef.current)

      renderedRef.current = true
    }

    renderButton()
  }, [amount, language, navigate, onSuccess])

  return <div ref={containerRef} />
}

export default PayPalButton
