import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
    label?: string;
    loadingLabel?: string;
    isLoading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    disabledLabel?:string;
}



const SubmitButton = ({
    label = "Submit",
    loadingLabel = "Submitting…",
    isLoading = false,
    disabled = false,
    fullWidth = true,
    className = "",
    disabledLabel="",
}: SubmitButtonProps) => {
    const isDisabled = isLoading || disabled;

    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={`
        inline-flex items-center justify-center gap-2
        px-6 py-2.5 rounded-lg
        text-sm font-semibold text-white
        bg-teal-600 hover:bg-teal-700
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-colors duration-200
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
        >
            {isLoading && <Loader2 size={16} className="animate-spin shrink-0" />}
{isLoading
  ? loadingLabel
  : isDisabled
  ? disabledLabel || label
  : label}        </button>
    );
};

export default SubmitButton;
