import type { ReactNode } from "react";

interface FormSectionProps {
    /** Section heading shown at the top of the card */
    title: string;
    /** Optional supporting description beneath the title */
    description?: string;
    /** Form fields or any React content to render inside */
    children: ReactNode;
    /** Extra Tailwind classes for the wrapper element */
    className?: string;
}

/**
 * A visual grouping card for related form fields.
 * Provides consistent padding, border, and spacing across all loan forms.
 */
const FormSection = ({
    title,
    description,
    children,
    className = "",
}: FormSectionProps) => {
    return (
        <section
            className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden ${className}`}
        >
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                {description && (
                    <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                )}
            </div>

            {/* Fields Grid */}
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {children}
            </div>
        </section>
    );
};

export default FormSection;
