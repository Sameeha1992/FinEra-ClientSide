import { get } from "react-hook-form";
import type { UseFormRegister, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type InputType = "text" | "number" | "email" | "password" | "tel";

interface InputFieldProps<T extends FieldValues> {
    /** Unique field name — must match the key in your form schema */
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    type?: InputType;
    placeholder?: string;
    readOnly?: boolean;
    /** React Hook Form validation rules */
    rules?: RegisterOptions<T, Path<T>>;
    /** Helper text displayed below the label */
    hint?: string;
    /** Extra Tailwind classes for the input element */
    inputClassName?: string;
    /** Wrapper element class overrides */
    className?: string;
}

/**
 * A fully-typed, reusable text/number/email/password input field.
 * Integrates with React Hook Form's `register` API and surfaces errors automatically.
 *
 * @example
 * <InputField
 *   name="monthlyIncome"
 *   label="Monthly Income"
 *   type="number"
 *   register={register}
 *   errors={errors}
 *   rules={{ required: "Monthly income is required", min: { value: 1, message: "Must be positive" } }}
 *   placeholder="e.g. 50000"
 * />
 */
const InputField = <T extends FieldValues>({
    name,
    label,
    register,
    errors,
    type = "text",
    placeholder,
    readOnly = false,
    rules,
    hint,
    inputClassName = "",
    className = "",
}: InputFieldProps<T>) => {
    const error = get(errors, name);
    const hasError = Boolean(error?.message);

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {/* Label */}
            <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700"
            >
                {label}
                {rules?.required && (
                    <span className="ml-0.5 text-red-500" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            {/* Hint */}
            {hint && <p className="text-xs text-slate-400 -mt-0.5">{hint}</p>}

            {/* Input */}
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
                className={`
          w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800
          placeholder:text-slate-400
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500
          ${readOnly
                        ? "bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200"
                        : hasError
                            ? "border-red-400 bg-red-50"
                            : "border-slate-300 bg-white hover:border-slate-400"
                    }
          ${inputClassName}
        `}
                {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...register(name, {
                    ...(rules as any),
                    ...(type === "number"
                        ? { setValueAs: (v: string) => (v === "" || v === undefined ? undefined : parseFloat(v)) }
                        : {}),
                })}
            />

            {/* Validation error */}
            <ErrorMessage message={error?.message} />
        </div>
    );
};

export default InputField;
