import { Controller, get } from "react-hook-form";
import type { Control, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";
import { CalendarDays } from "lucide-react";
import ErrorMessage from "./ErrorMessage";

interface DatePickerFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T>;
    errors: FieldErrors<T>;
    rules?: RegisterOptions<T, Path<T>>;
    /** Minimum selectable date (ISO string: YYYY-MM-DD) */
    min?: string;
    /** Maximum selectable date (ISO string: YYYY-MM-DD) */
    max?: string;
    hint?: string;
    className?: string;
}

/**
 * A controlled date picker that uses React Hook Form's `Controller`.
 * Renders a styled native <input type="date"> with calendar icon overlay.
 *
 * @example
 * <DatePickerField
 *   name="dateOfBirth"
 *   label="Date of Birth"
 *   control={control}
 *   errors={errors}
 *   rules={{ required: "Date of birth is required" }}
 *   max={new Date().toISOString().split("T")[0]}
 * />
 */
const DatePickerField = <T extends FieldValues>({
    name,
    label,
    control,
    errors,
    rules,
    min,
    max,
    hint,
    className = "",
}: DatePickerFieldProps<T>) => {
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

            {/* Controller wrapper to use controlled value */}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <div className="relative">
                        <input
                            {...field}
                            id={name}
                            type="date"
                            min={min}
                            max={max}
                            aria-invalid={hasError}
                            aria-describedby={hasError ? `${name}-error` : undefined}
                            className={`
                w-full pl-3.5 pr-10 py-2.5 rounded-lg border text-sm text-slate-800
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500
                ${hasError
                                    ? "border-red-400 bg-red-50"
                                    : "border-slate-300 bg-white hover:border-slate-400"
                                }
              `}
                        />
                        <CalendarDays
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                )}
            />

            <ErrorMessage message={error?.message} />
        </div>
    );
};

export default DatePickerField;
