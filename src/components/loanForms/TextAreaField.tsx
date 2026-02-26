import { get } from "react-hook-form";
import type { UseFormRegister, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

interface TextAreaFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    rules?: RegisterOptions<T, Path<T>>;
    placeholder?: string;
    rows?: number;
    readOnly?: boolean;
    hint?: string;
    className?: string;
    textAreaClassName?: string;
}

/**
 * A reusable multi-line textarea wired to React Hook Form.
 * Use for additional notes, purpose descriptions, or long-form text inputs.
 *
 * @example
 * <TextAreaField
 *   name="loanPurpose"
 *   label="Loan Purpose"
 *   register={register}
 *   errors={errors}
 *   rules={{ required: "Please describe the loan purpose" }}
 *   placeholder="Briefly describe why you need this loan…"
 *   rows={4}
 * />
 */
const TextAreaField = <T extends FieldValues>({
    name,
    label,
    register,
    errors,
    rules,
    placeholder,
    rows = 4,
    readOnly = false,
    hint,
    className = "",
    textAreaClassName = "",
}: TextAreaFieldProps<T>) => {
    const error = get(errors, name);
    const hasError = Boolean(error?.message);

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label htmlFor={name} className="text-sm font-medium text-slate-700">
                {label}
                {rules?.required && (
                    <span className="ml-0.5 text-red-500" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            {hint && <p className="text-xs text-slate-400 -mt-0.5">{hint}</p>}

            <textarea
                id={name}
                rows={rows}
                placeholder={placeholder}
                readOnly={readOnly}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
                className={`
          w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800
          placeholder:text-slate-400 resize-none
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500
          ${readOnly
                        ? "bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200"
                        : hasError
                            ? "border-red-400 bg-red-50"
                            : "border-slate-300 bg-white hover:border-slate-400"
                    }
          ${textAreaClassName}
        `}
                {...register(name, rules)}
            />

            <ErrorMessage message={error?.message} />
        </div>
    );
};

export default TextAreaField;
