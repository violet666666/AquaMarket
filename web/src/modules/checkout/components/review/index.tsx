"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import MidtransPayment from "../midtrans-payment"
import { useSearchParams, useParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const params = useParams()

  const isOpen = searchParams.get("step") === "review"
  const countryCode = (params?.countryCode as string) || "id"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Tinjauan & Pembayaran
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Dengan mengklik tombol &quot;Bayar Sekarang&quot;, Anda
                mengonfirmasi bahwa Anda telah membaca, memahami, dan menerima
                Syarat Penggunaan, Syarat Penjualan, serta Kebijakan
                Pengembalian kami.
              </Text>
            </div>
          </div>

          {/* Midtrans Payment Button */}
          <div className="mb-4">
            <MidtransPayment cart={cart} countryCode={countryCode} />
          </div>

          {/* Divider */}
          <div className="flex items-center w-full my-4">
            <div className="flex-1 border-t border-ui-border-base"></div>
            <span className="px-3 text-xs text-ui-fg-muted">atau metode lain</span>
            <div className="flex-1 border-t border-ui-border-base"></div>
          </div>

          {/* Original Medusa payment button as fallback */}
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
