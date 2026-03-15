import { get } from "react-hook-form";
import type { UseFormRegister, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    options: SelectOption[];
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    rules?: RegisterOptions<T, Path<T>>;
    placeholder?: string;
    defaultValue?: string;
    /** Extra Tailwind classes for the select element */
    selectClassName?: string;
    className?: string;
}

/**
 * A reusable controlled select (dropdown) field wired to React Hook Form.
 * Accepts dynamic `options`, validation `rules`, and a label.
 *
 * @example
 * <SelectField
 *   name="employmentType"
 *   label="Employment Type"
 *   options={[
 *     { label: "Salaried", value: "salaried" },
 *     { label: "Self-Employed", value: "self_employed" },
 *     { label: "Business Owner", value: "business" },
 *   ]}
 *   register={register}
 *   errors={errors}
 *   rules={{ required: "Please select an employment type" }}
 * />
 */
const SelectField = <T extends FieldValues>({
    name,
    label,
    options,
    register,
    errors,
    rules,
    placeholder = "Select an option",
    selectClassName = "",
    className = "",
}: SelectFieldProps<T>) => {
    const error = get(errors, name);
    const hasError = Boolean(error?.message);

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {/* Label */}
            <label htmlFor={name} className="text-sm font-medium text-slate-700">
                {label}
                {rules?.required && (
                    <span className="ml-0.5 text-red-500" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            {/* Select */}
            <select
                id={name}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
                className={`
          w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800
          bg-white appearance-none
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500
          ${hasError
                        ? "border-red-400 bg-red-50"
                        : "border-slate-300 hover:border-slate-400"
                    }
          ${selectClassName}
        `}
                {...register(name, rules)}
            >
                {/* Placeholder option */}
                <option value="" disabled>
                    {placeholder}
                </option>

                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <ErrorMessage message={error?.message} />
        </div>
    );
};

export default SelectField;
