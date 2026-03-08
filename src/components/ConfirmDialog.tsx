import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Hapus Data',
    cancelText = 'Batal',
    type = 'danger'
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden"
                    >
                        <div className="p-8 text-center">
                            <div className={`w-20 h-20 ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <AlertTriangle size={40} strokeWidth={2.5} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all font-sans"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
