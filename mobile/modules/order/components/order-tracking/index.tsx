import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { Order } from "@medusajs/medusa";

type OrderTrackingProps = {
  order: Order;
};

const TIMELINE_STEPS = [
  { key: "pending", label: "Pesanan Diterima", icon: "📦" },
  { key: "processing", label: "Diproses", icon: "⚙️" },
  { key: "shipped", label: "Dikirim", icon: "🚚" },
  { key: "delivered", label: "Selesai", icon: "✅" },
];

function getActiveStep(fulfillmentStatus: string): number {
  if (fulfillmentStatus === "delivered" || fulfillmentStatus === "completed") return 3;
  if (fulfillmentStatus === "shipped" || fulfillmentStatus === "fulfilled") return 2;
  if (fulfillmentStatus === "processing" || fulfillmentStatus === "partially_fulfilled") return 1;
  return 0;
}

const OrderTracking = ({ order }: OrderTrackingProps) => {
  const fulfillmentStatus = order.fulfillment_status || "not_fulfilled";
  const activeStep = getActiveStep(fulfillmentStatus);

  const fulfillments = (order as any).fulfillments || [];
  const latestFulfillment = fulfillments[fulfillments.length - 1] || null;
  const trackingLinks = latestFulfillment?.tracking_links || [];
  const trackingLink = trackingLinks[0] || null;
  const trackingNumber = trackingLink?.tracking_number || latestFulfillment?.tracking_number || null;
  const trackingUrl = trackingLink?.url || null;

  const handleTracking = () => {
    if (trackingUrl) {
      Linking.openURL(trackingUrl);
    } else if (trackingNumber) {
      Linking.openURL(`https://www.jne.co.id/id/tracking/trace?awb=${trackingNumber}`);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-xl font-semibold mb-4 text-gray-900">Status Pengiriman</Text>

      {/* Timeline */}
      <View className="flex-row justify-between relative mb-6">
        <View className="absolute top-5 left-4 right-4 h-1 bg-gray-200 z-0" />
        <View
          className="absolute top-5 left-4 h-1 bg-blue-500 z-0"
          style={{ width: `${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}%` }}
        />

        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= activeStep;
          return (
            <View key={step.key} className="items-center flex-1 z-10">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center border-2 
                  ${isCompleted ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"}`}
              >
                <Text className={isCompleted ? "text-white text-lg" : "text-gray-400 text-lg"}>
                  {step.icon}
                </Text>
              </View>
              <Text
                className={`text-xs text-center mt-2 font-medium
                  ${isCompleted ? "text-gray-900" : "text-gray-500"}`}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Tracking Info */}
      {trackingNumber ? (
        <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Text className="font-semibold text-gray-900 mb-2">Info Pengiriman</Text>
          
          {latestFulfillment?.provider_id && (
            <View className="flex-row mb-1">
              <Text className="text-gray-500 w-24">Ekspedisi:</Text>
              <Text className="font-medium text-gray-900 uppercase">
                {latestFulfillment.provider_id}
              </Text>
            </View>
          )}
          
          <View className="flex-row mb-3">
            <Text className="text-gray-500 w-24">No. Resi:</Text>
            <Text className="font-medium text-gray-900">{trackingNumber}</Text>
          </View>

          <Pressable
            onPress={handleTracking}
            className="bg-blue-600 rounded-md py-3 items-center justify-center"
          >
            <Text className="text-white font-medium">Lacak Paket</Text>
          </Pressable>
        </View>
      ) : activeStep < 2 ? (
        <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Text className="text-gray-500">
            Nomor resi akan ditampilkan setelah pesanan dikirim.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default OrderTracking;
