import { medusaClient } from "lib/config";
import { useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

interface AccountContext {
  customer?: any;
  retrievingCustomer: boolean;
  loginView: [LOGIN_VIEW, React.Dispatch<React.SetStateAction<LOGIN_VIEW>>];
  checkSession: () => void;
  refetchCustomer: () => void;
  handleLogout: () => void;
}

const AccountContext = createContext<AccountContext | null>(null);

interface AccountProviderProps {
  children?: React.ReactNode;
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const [customer, setCustomer] = useState<any>(null);
  const [retrievingCustomer, setRetrievingCustomer] = useState(true);
  const loginView = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN);
  const router = useRouter();

  // Fetch customer on mount
  const fetchCustomer = useCallback(async () => {
    setRetrievingCustomer(true);
    try {
      const result = await medusaClient.store.customer.retrieve();
      setCustomer(result.customer);
    } catch {
      setCustomer(null);
    } finally {
      setRetrievingCustomer(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const checkSession = useCallback(() => {
    if (!customer && !retrievingCustomer) {
      router.push("/account/login");
    }
  }, [customer, retrievingCustomer, router]);

  const handleLogout = useCallback(async () => {
    try {
      // Medusa v2: delete auth session
      await medusaClient.auth.logout();
    } catch {
      // Session might already be expired
    }
    setCustomer(null);
    loginView[1](LOGIN_VIEW.SIGN_IN);
    router.push("/");
  }, [router, loginView]);

  return (
    <AccountContext.Provider
      value={{
        customer,
        retrievingCustomer,
        loginView,
        checkSession,
        refetchCustomer: fetchCustomer,
        handleLogout,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === null) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
};
