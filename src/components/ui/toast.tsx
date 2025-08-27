// Minimal types to satisfy use-toast imports without shadcn implementation
export type ToastActionElement = React.ReactNode;
export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export {};