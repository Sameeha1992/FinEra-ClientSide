interface StatusBadgeProps {
  status: "blocked" | "unblocked";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles =
    status === "unblocked"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status === "unblocked" ? "Unblocked" : "Blocked"}
    </span>
  );
};

export default StatusBadge;
