"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

type ToastVariant = "success" | "error";

interface ToastProps {
    message: string;
    type?: ToastVariant;
    duration?: number;
    onClose?: () => void;
}

export default function CustomToast({
    message,
    type = "success",
    duration = 4000,
    onClose,
}: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 250);
    };

    if (!visible) return null;

    const isSuccess = type === "success";

    return (
        <div
            className={`
        fixed top-6 right-6 z-50
        min-w-[340px] max-w-[420px]
        rounded-2xl border shadow-xl
        px-5 py-4
        transition-all duration-300
        bg-white
        ${isSuccess
                    ? "border-emerald-200"
                    : "border-red-200"
                }
      `}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`
            rounded-xl p-2
            ${isSuccess
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }
          `}
                >
                    {isSuccess ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                </div>

                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                        {isSuccess ? "Operación exitosa" : "Ocurrió un error"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {message}
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
