import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

interface DOBPickerProps {
  value: string; // Expected in YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export const DOBPicker: React.FC<DOBPickerProps> = ({ value, onChange, error, className }) => {
  // Enforce 18+ years requirement
  const maxDate = dayjs().subtract(18, "year");

  return (
    <div className={`w-full ${className}`}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Date of Birth (DD/MM/YYYY)"
          value={value ? dayjs(value) : null}
          onChange={(newValue: Dayjs | null) => {
            if (newValue && newValue.isValid()) {
                // Ensure output is in YYYY-MM-DD for backend compatibility
              onChange(newValue.format("YYYY-MM-DD"));
            }
          }}
          maxDate={maxDate}
          format="DD/MM/YYYY"
          // Ensure the calendar view opens directly to the year selection if needed
          views={['year', 'month', 'day']}
          openTo="year" // Great UX: Immediately ask for year first for DOB
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error,
              placeholder: "DD/MM/YYYY",
              sx: {
                // Fintech-inspired Teal styling
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  fontSize: "0.9rem",
                  backgroundColor: "white",
                  transition: "all 0.2s ease-in-out",
                  "& fieldset": {
                    borderColor: error ? "#f87171" : "#e2e8f0", // slate-200
                  },
                  "&:hover fieldset": {
                    borderColor: "#2dd4bf", // teal-400
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#14b8a6", // teal-500
                    borderWidth: "2px",
                  },
                },
                "& .MuiFormLabel-root": {
                  fontSize: "0.85rem",
                  color: "#64748b", // slate-500
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#0d9488", // teal-600
                },
              },
            },
            // Customizes the popover calendar header and behavior
            calendarHeader: {
              sx: {
                "& .MuiPickersCalendarHeader-label": {
                  fontWeight: 600,
                  color: "#0f172a", // slate-900
                }
              }
            }
          }}
        />
      </LocalizationProvider>
    </div>
  );
};
