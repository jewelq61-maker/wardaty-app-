import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl, apiRequest } from "./query-client";

const PARTNER_SESSION_KEY = "@wardaty_partner_session";

export interface PartnerSession {
  linkedUserId: string;
  connectedAt: string;
}

export interface PartnerSummary {
  cycleDay: number | null;
  phase: "period" | "fertile" | "ovulation" | "luteal" | "follicular" | "normal";
  nextPeriodDate: string | null;
  daysUntilNextPeriod: number | null;
  fertileWindow: { start: string; end: string } | null;
  moodTrend: "great" | "good" | "okay" | "stressed" | "tired" | null;
  partnerName: string;
}

interface PartnerContextType {
  isPartnerMode: boolean;
  isLoading: boolean;
  partnerSession: PartnerSession | null;
  partnerSummary: PartnerSummary | null;
  connectAsPartner: (code: string) => Promise<{ success: boolean; error?: string }>;
  disconnectPartner: () => Promise<void>;
  refreshPartnerData: () => Promise<void>;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [partnerSession, setPartnerSession] = useState<PartnerSession | null>(null);
  const [partnerSummary, setPartnerSummary] = useState<PartnerSummary | null>(null);

  const isPartnerMode = partnerSession !== null;

  useEffect(() => {
    loadPartnerSession();
  }, []);

  useEffect(() => {
    if (partnerSession) {
      refreshPartnerData();
    }
  }, [partnerSession]);

  async function loadPartnerSession() {
    try {
      const data = await AsyncStorage.getItem(PARTNER_SESSION_KEY);
      if (data) {
        const session = JSON.parse(data) as PartnerSession;
        setPartnerSession(session);
      }
    } catch (error) {
      console.error("Error loading partner session:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function savePartnerSession(session: PartnerSession | null) {
    try {
      if (session) {
        await AsyncStorage.setItem(PARTNER_SESSION_KEY, JSON.stringify(session));
      } else {
        await AsyncStorage.removeItem(PARTNER_SESSION_KEY);
      }
    } catch (error) {
      console.error("Error saving partner session:", error);
    }
  }

  const connectAsPartner = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const baseUrl = getApiUrl();
      const res = await apiRequest("POST", new URL("/api/partner/connect", baseUrl).toString(), { code });
      
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Connection failed" };
      }
      
      const data = await res.json();
      const session: PartnerSession = {
        linkedUserId: data.linkedUserId,
        connectedAt: new Date().toISOString(),
      };
      
      setPartnerSession(session);
      await savePartnerSession(session);
      
      return { success: true };
    } catch (error) {
      console.error("Error connecting as partner:", error);
      return { success: false, error: "Network error" };
    }
  }, []);

  const disconnectPartner = useCallback(async () => {
    setPartnerSession(null);
    setPartnerSummary(null);
    await savePartnerSession(null);
  }, []);

  const refreshPartnerData = useCallback(async () => {
    if (!partnerSession) return;
    
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(
        new URL(`/api/partner/summary?userId=${partnerSession.linkedUserId}`, baseUrl).toString()
      );
      
      if (res.ok) {
        const data = await res.json();
        setPartnerSummary(data);
      } else {
        console.error("Error fetching partner summary:", await res.text());
      }
    } catch (error) {
      console.error("Error refreshing partner data:", error);
    }
  }, [partnerSession]);

  return (
    <PartnerContext.Provider
      value={{
        isPartnerMode,
        isLoading,
        partnerSession,
        partnerSummary,
        connectAsPartner,
        disconnectPartner,
        refreshPartnerData,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartner must be used within a PartnerProvider");
  }
  return context;
}
