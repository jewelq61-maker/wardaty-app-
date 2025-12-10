import React, { createContext, useContext, useState, useCallback, useRef } from "react";

type FABHandler = () => void;

interface FABContextType {
  registerFABHandler: (tabName: string, handler: FABHandler) => void;
  unregisterFABHandler: (tabName: string) => void;
  triggerFAB: (tabName: string) => void;
}

const FABContext = createContext<FABContextType | undefined>(undefined);

export function FABProvider({ children }: { children: React.ReactNode }) {
  const handlers = useRef<Map<string, FABHandler>>(new Map());

  const registerFABHandler = useCallback((tabName: string, handler: FABHandler) => {
    handlers.current.set(tabName, handler);
  }, []);

  const unregisterFABHandler = useCallback((tabName: string) => {
    handlers.current.delete(tabName);
  }, []);

  const triggerFAB = useCallback((tabName: string) => {
    const handler = handlers.current.get(tabName);
    if (handler) {
      handler();
    }
  }, []);

  return (
    <FABContext.Provider value={{ registerFABHandler, unregisterFABHandler, triggerFAB }}>
      {children}
    </FABContext.Provider>
  );
}

export function useFAB() {
  const context = useContext(FABContext);
  if (!context) {
    throw new Error("useFAB must be used within a FABProvider");
  }
  return context;
}

export function useFABHandler(tabName: string, handler: FABHandler) {
  const { registerFABHandler, unregisterFABHandler } = useFAB();

  React.useEffect(() => {
    registerFABHandler(tabName, handler);
    return () => unregisterFABHandler(tabName);
  }, [tabName, handler, registerFABHandler, unregisterFABHandler]);
}
