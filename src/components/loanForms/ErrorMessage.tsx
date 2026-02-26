import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
    message?: string;
}

/**
 * Renders a validation error message below a form field.
 * Works seamlessly with React Hook Form field errors.
 */
const ErrorMessage = ({ message }: ErrorMessageProps) => {
    if (!message) return null;

    return (
        <p
            role="alert"
            className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-red-500"
        >
            <AlertCircle size={13} className="shrink-0" />
            {message}
        </p>
    );
};

export default ErrorMessage;
