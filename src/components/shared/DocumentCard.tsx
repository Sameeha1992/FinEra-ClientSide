import { FileText } from "lucide-react";

export const DocumentCard = ({
  title,
  url,
}: {
  title: string;
  url?: string;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-teal-200 hover:bg-teal-50/30 transition">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white rounded-lg border shadow-sm">
          <FileText className="w-5 h-5 text-teal-600" />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-900">{title}</p>
          <p className="text-xs text-zinc-500">
            {url ? "Available" : "Not uploaded"}
          </p>
        </div>
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
        >
          View
        </a>
      )}
    </div>
  );
};
