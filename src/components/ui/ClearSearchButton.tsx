import React from "react";
import { X } from "lucide-react";

interface ClearSearchButtonProps {
  /** Condition to show the button (e.g., search.length > 0) */
  show: boolean;
  /** Callback function to clear the search state */
  onClick: () => void;
  /** Optional additional classes for the button */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Size of the X icon (default: 16) */
  size?: number;
}

/**
 * A reusable Clear Search button designed to be placed inside a relative-positioned
 * input wrapper. It matches the FinEra design system with subtle hover effects.
 */
const ClearSearchButton: React.FC<ClearSearchButtonProps> = ({
  show,
  onClick,
  className = "",
  ariaLabel = "Clear search",
  size = 16,
}) => {
  if (!show) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 z-10 ${className}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <X size={size} strokeWidth={2.5} />
    </button>
  );
};

export default ClearSearchButton;
