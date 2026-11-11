import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { subscribeToast } from '../three/hooks/useSceneStore';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToast((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      if (newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    });
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const isError = t.type === 'error';
          const isSuccess = t.type === 'success';
          const borderColor = isError
            ? 'border-rose-500/40 bg-zinc-950/90'
            : isSuccess
            ? 'border-emerald-500/40 bg-zinc-950/90'
            : 'border-cyan-500/40 bg-zinc-950/90';

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${borderColor}`}
              role="status"
            >
              <div className="mt-0.5 shrink-0">
                {isError ? (
                  <FiAlertCircle className="w-5 h-5 text-rose-400" aria-hidden="true" />
                ) : isSuccess ? (
                  <FiCheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                ) : (
                  <FiInfo className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-sm font-semibold text-white">{t.title}</p>
                )}
                {t.message && (
                  <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

