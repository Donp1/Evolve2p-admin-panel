"use client";
import React, {
  useState,
  useCallback,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type AlertType = "success" | "error" | "info" | "warning" | "default";

type AlertAction = {
  label: string;
  className?: string;
  onClick?: () => void;
  keepOpen?: boolean;
};

type AlertOptions = {
  title?: string;
  message?: string;
  actions?: AlertAction[];
  type?: AlertType;
};

type AlertContextType = {
  openAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
};

const typeStyles: Record<AlertType, string> = {
  success: "border-green-500 bg-green-500",
  error: "border-red-500 bg-red-500",
  info: "border-blue-500 bg-blue-500",
  warning: "border-yellow-500 bg-yellow-500",
  default: "border-zinc-300 bg-white dark:bg-zinc-900",
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<AlertOptions | null>(null);
  const [mounted, setMounted] = useState(false);

  const openAlert = useCallback((options: AlertOptions) => {
    setAlert(options);
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AlertContext.Provider value={{ openAlert, closeAlert }}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {alert && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={`w-full max-w-md rounded-2xl shadow-xl border p-6 
                    dark:text-zinc-100 
                    ${typeStyles[alert.type || "default"]}`}
                >
                  {alert.title && (
                    <h2 className="text-lg font-semibold mb-2">
                      {alert.title}
                    </h2>
                  )}

                  {alert.message && (
                    <p className="text-sm mb-6 text-zinc-700 dark:text-zinc-300">
                      {alert.message}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 justify-end">
                    {alert.actions?.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          action.onClick?.();
                          if (!action.keepOpen) closeAlert();
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium 
                          transition-colors ${
                            action.className ||
                            "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside <AlertProvider>");
  return ctx;
};
