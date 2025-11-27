interface LetterStatusBadgeProps {
  status: "pending" | "diterima" | "ditolak";
}

export default function LetterStatusBadge({ status }: LetterStatusBadgeProps) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    diterima: "bg-green-100 text-green-800",
    ditolak: "bg-red-100 text-red-800",
  };

  const statusText = {
    pending: "Pending",
    diterima: "Diterima",
    ditolak: "Ditolak",
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyles[status]}`}
    >
      {statusText[status]}
    </span>
  );
}
