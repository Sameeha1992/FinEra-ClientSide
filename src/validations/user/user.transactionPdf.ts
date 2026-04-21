import z from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const reportFilterSchema = z
  .object({
    filterType: z.enum(["all", "week", "month", "dateRange"]),
    selectedMonth: z.string(),
    selectedYear: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    if (data.filterType === "month") {
      const month = Number(data.selectedMonth);
      const year = Number(data.selectedYear);

      if (
        year > currentYear ||
        (year === currentYear && month > currentMonth)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selectedMonth"],
          message: "List not available for this month",
        });
      }
    }

    if (data.filterType === "dateRange") {
      if (data.startDate) {
        const start = new Date(data.startDate);
        start.setHours(0, 0, 0, 0);

        if (start > today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["startDate"],
            message: "List not available for this date",
          });
        }
      }

      if (data.endDate) {
        const end = new Date(data.endDate);
        end.setHours(0, 0, 0, 0);

        if (end > today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["endDate"],
            message: "List not available for this date",
          });
        }
      }

      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        if (start > end) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["startDate"],
            message: "Start date cannot be after end date",
          });
        }
      }
    }
  });