import { medusaClient } from "lib/config";
import useToggleState, { StateType } from "lib/hooks/use-toggle-state";
import { isEqual } from "lodash";
import { formatAmount } from "medusa-react";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useStore } from "./store-context";

type AddressValues = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone: string;
};

export type CheckoutFormValues = {
  shipping_address: AddressValues;
  billing_address: AddressValues;
  email: string;
};

interface CheckoutContext {
  cart?: any;
  shippingMethods: { label: string; value: string; price: string }[];
  isLoading: boolean;
  readyToComplete: boolean;
  sameAsBilling: StateType;
  editAddresses: StateType;
  initPayment: () => Promise<void>;
  setAddresses: (addresses: CheckoutFormValues) => void;
  setSavedAddress: (address: any) => void;
  setShippingOption: (soId: string) => void;
  setPaymentSession: (providerId: string) => void;
  onPaymentCompleted: () => void;
}

const CheckoutContext = createContext<CheckoutContext | null>(null);

interface CheckoutProviderProps {
  children?: React.ReactNode;
}

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const [cart, setCart] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { countryCode, resetCart, setRegion } = useStore();
  const { replace } = useRouter();

  const editAddresses = useToggleState();
  const sameAsBilling = useToggleState(true);

  const methods = useForm<CheckoutFormValues>({
    defaultValues: mapFormValues(customer, cart, countryCode),
    reValidateMode: "onChange",
  });

  // ========================================
  // Load cart from AsyncStorage on mount
  // ========================================
  useEffect(() => {
    const loadCart = async () => {
      try {
        const AsyncStorage = require("@react-native-async-storage/async-storage").default;
        const cartId = await AsyncStorage.getItem("medusa_cart_id");
        if (cartId) {
          const result = await medusaClient.store.cart.retrieve(cartId);
          setCart(result.cart);
        }
      } catch (error) {
        console.error("Load cart error:", error);
      }
    };
    loadCart();
  }, []);

  // ========================================
  // Load customer
  // ========================================
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const result = await medusaClient.store.customer.retrieve();
        setCustomer(result.customer);
      } catch {
        // Not logged in
      }
    };
    loadCustomer();
  }, []);

  // ========================================
  // Load shipping options when cart is available
  // ========================================
  useEffect(() => {
    const loadShippingOptions = async () => {
      if (!cart?.id) return;
      try {
        const result = await medusaClient.store.fulfillment.listCartOptions({ cart_id: cart.id });
        setShippingOptions(result.shipping_options || []);
      } catch (error) {
        console.error("Load shipping options error:", error);
      }
    };
    loadShippingOptions();
  }, [cart?.id]);

  // ========================================
  // Load regions
  // ========================================
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const result = await medusaClient.store.region.list();
        setRegions(result.regions || []);
      } catch (error) {
        console.error("Load regions error:", error);
      }
    };
    loadRegions();
  }, []);

  // Reset form when cart changes
  useEffect(() => {
    if (cart?.id) {
      methods.reset(mapFormValues(customer, cart, countryCode));
    }
  }, [customer, cart, countryCode]);

  useEffect(() => {
    if (!cart) {
      editAddresses.open();
      return;
    }
    if (cart?.shipping_address && cart?.billing_address) {
      editAddresses.close();
      return;
    }
    editAddresses.open();
  }, [cart]);

  // ========================================
  // Checkout readiness
  // ========================================
  const readyToComplete = useMemo(() => {
    return (
      !!cart &&
      !!cart.email &&
      !!cart.shipping_address &&
      !!cart.billing_address &&
      !!cart.payment_session &&
      (cart.shipping_methods?.length || 0) > 0
    );
  }, [cart]);

  const shippingMethods = useMemo(() => {
    if (shippingOptions && cart?.region) {
      return shippingOptions.map((option: any) => ({
        value: option.id,
        label: option.name,
        price: formatAmount({
          amount: option.amount || 0,
          region: cart.region,
        }),
      }));
    }
    return [];
  }, [shippingOptions, cart]);

  // ========================================
  // Cart operations using Medusa v2 SDK
  // ========================================
  const setShippingOption = useCallback(async (soId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const result = await medusaClient.store.cart.addShippingMethod(cart.id, {
        option_id: soId,
      });
      setCart(result.cart);
    } catch (error) {
      console.error("Set shipping error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const initPayment = useCallback(async () => {
    if (!cart?.id || !cart?.items?.length) return;
    try {
      const result = await medusaClient.store.payment.initiatePaymentSession(cart, {
        provider_id: "manual",
      });
      setCart(result.cart);
    } catch (error) {
      console.error("Init payment error:", error);
    }
  }, [cart]);

  const setPaymentSession = useCallback(async (providerId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const result = await medusaClient.store.payment.initiatePaymentSession(cart, {
        provider_id: providerId,
      });
      setCart(result.cart);
    } catch (error) {
      console.error("Set payment session error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const setAddresses = useCallback(async (data: CheckoutFormValues) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { shipping_address, billing_address, email } = data;
      const payload: any = {
        shipping_address,
        email,
      };

      if (sameAsBilling.state) {
        payload.billing_address = shipping_address;
      } else {
        payload.billing_address = billing_address;
      }

      const result = await medusaClient.store.cart.update(cart.id, payload);
      setCart(result.cart);

      // After setting addresses, init shipping + payment
      if (shippingMethods.length > 0) {
        await setShippingOption(shippingMethods[0].value);
      }
      await initPayment();
    } catch (error) {
      console.error("Set addresses error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id, sameAsBilling.state, shippingMethods, setShippingOption, initPayment]);

  const setSavedAddress = useCallback((address: any) => {
    const setValue = methods.setValue;
    setValue("shipping_address", {
      address_1: address.address_1 || "",
      address_2: address.address_2 || "",
      city: address.city || "",
      country_code: address.country_code || "",
      first_name: address.first_name || "",
      last_name: address.last_name || "",
      phone: address.phone || "",
      postal_code: address.postal_code || "",
      province: address.province || "",
      company: address.company || "",
    });
  }, [methods]);

  const onPaymentCompleted = useCallback(async () => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const result = await medusaClient.store.cart.complete(cart.id);
      resetCart();
      if (result.type === "order") {
        replace(`/order/confirmed/${result.order.id}`);
      }
    } catch (error) {
      console.error("Complete checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id, resetCart, replace]);

  return (
    <FormProvider {...methods}>
      <CheckoutContext.Provider
        value={{
          cart,
          shippingMethods,
          isLoading,
          readyToComplete,
          sameAsBilling,
          editAddresses,
          initPayment,
          setAddresses,
          setSavedAddress,
          setShippingOption,
          setPaymentSession,
          onPaymentCompleted,
        }}
      >
        {children}
      </CheckoutContext.Provider>
    </FormProvider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  const form = useFormContext<CheckoutFormValues>();
  if (context === null) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return { ...context, ...form };
};

/**
 * Map form values from customer/cart data
 */
const mapFormValues = (
  customer?: any,
  cart?: any,
  currentCountry?: string
): CheckoutFormValues => {
  const customerShippingAddress = customer?.shipping_addresses?.[0];
  const customerBillingAddress = customer?.billing_address;

  return {
    shipping_address: {
      first_name: cart?.shipping_address?.first_name || customerShippingAddress?.first_name || "",
      last_name: cart?.shipping_address?.last_name || customerShippingAddress?.last_name || "",
      address_1: cart?.shipping_address?.address_1 || customerShippingAddress?.address_1 || "",
      address_2: cart?.shipping_address?.address_2 || customerShippingAddress?.address_2 || "",
      city: cart?.shipping_address?.city || customerShippingAddress?.city || "",
      country_code: currentCountry || cart?.shipping_address?.country_code || customerShippingAddress?.country_code || "",
      province: cart?.shipping_address?.province || customerShippingAddress?.province || "",
      company: cart?.shipping_address?.company || customerShippingAddress?.company || "",
      postal_code: cart?.shipping_address?.postal_code || customerShippingAddress?.postal_code || "",
      phone: cart?.shipping_address?.phone || customerShippingAddress?.phone || "",
    },
    billing_address: {
      first_name: cart?.billing_address?.first_name || customerBillingAddress?.first_name || "",
      last_name: cart?.billing_address?.last_name || customerBillingAddress?.last_name || "",
      address_1: cart?.billing_address?.address_1 || customerBillingAddress?.address_1 || "",
      address_2: cart?.billing_address?.address_2 || customerBillingAddress?.address_2 || "",
      city: cart?.billing_address?.city || customerBillingAddress?.city || "",
      country_code: cart?.shipping_address?.country_code || customerBillingAddress?.country_code || "",
      province: cart?.shipping_address?.province || customerBillingAddress?.province || "",
      company: cart?.billing_address?.company || customerBillingAddress?.company || "",
      postal_code: cart?.billing_address?.postal_code || customerBillingAddress?.postal_code || "",
      phone: cart?.billing_address?.phone || customerBillingAddress?.phone || "",
    },
    email: cart?.email || customer?.email || "",
  };
};
