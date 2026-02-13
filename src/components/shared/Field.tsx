export const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="text-base font-medium text-zinc-900">
      {value || "-"}
    </div>
  </div>
);
