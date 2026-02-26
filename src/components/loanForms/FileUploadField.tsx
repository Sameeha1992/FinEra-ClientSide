import { useRef, useState } from "react";
import { Controller, get } from "react-hook-form";
import type { Control, FieldValues, Path, RegisterOptions, FieldErrors } from "react-hook-form";
import { Paperclip, X } from "lucide-react";
import ErrorMessage from "./ErrorMessage";

interface FileUploadFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T>;
    errors: FieldErrors<T>;
    rules?: RegisterOptions<T, Path<T>>;
    /**
     * Comma-separated list of accepted MIME types or extensions.
     * e.g. "image/jpeg,image/png,application/pdf"
     * e.g. ".jpg,.png,.pdf"
     */
    accept?: string;
    hint?: string;
    className?: string;
}

/**
 * A single-file upload field integrated with React Hook Form's `Controller`.
 * - Shows selected file name with a clear button.
 * - Accepts file-type restrictions via the `accept` prop.
 * - Does NOT upload to a server — returns the raw `File` object in form data.
 *
 * @example
 * <FileUploadField
 *   name="salarySlip"
 *   label="Latest Salary Slip"
 *   control={control}
 *   errors={errors}
 *   rules={{ required: "Salary slip is required" }}
 *   accept=".pdf,.jpg,.jpeg,.png"
 * />
 */
const FileUploadField = <T extends FieldValues>({
    name,
    label,
    control,
    errors,
    rules,
    accept,
    hint,
    className = "",
}: FileUploadFieldProps<T>) => {
    const error = get(errors, name);
    const hasError = Boolean(error?.message);
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-sm font-medium text-slate-700">
                {label}
                {rules?.required && (
                    <span className="ml-0.5 text-red-500" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            {hint && <p className="text-xs text-slate-400 -mt-0.5">{hint}</p>}

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, onBlur } }) => (
                    <>
                        {/* Hidden native file input */}
                        <input
                            ref={inputRef}
                            type="file"
                            accept={accept}
                            className="hidden"
                            onBlur={onBlur}
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setFileName(file?.name ?? null);
                                onChange(file);
                            }}
                        />

                        {/* Custom trigger area */}
                        {!fileName ? (
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                aria-invalid={hasError}
                                className={`
                  flex items-center justify-center gap-2
                  w-full px-4 py-3 rounded-lg border-2 border-dashed
                  text-sm font-medium transition-colors duration-150
                  focus:outline-none focus:ring-2 focus:ring-teal-500/30
                  ${hasError
                                        ? "border-red-400 bg-red-50 text-red-500 hover:bg-red-100"
                                        : "border-slate-300 text-slate-500 bg-slate-50 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600"
                                    }
                `}
                            >
                                <Paperclip size={16} className="shrink-0" />
                                Click to choose a file
                                {accept && (
                                    <span className="text-xs text-slate-400 font-normal">
                                        ({accept})
                                    </span>
                                )}
                            </button>
                        ) : (
                            /* File selected state */
                            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-teal-400 bg-teal-50">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Paperclip size={15} className="shrink-0 text-teal-600" />
                                    <span className="text-sm text-teal-700 font-medium truncate">
                                        {fileName}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    aria-label="Remove file"
                                    onClick={() => {
                                        setFileName(null);
                                        onChange(null);
                                        if (inputRef.current) inputRef.current.value = "";
                                    }}
                                    className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            />

            <ErrorMessage message={error?.message} />
        </div>
    );
};

export default FileUploadField;
