export default function LetterDetailSection({
  title,
  value,
  additionalValue,
}: {
  title: string;
  value: string | number;
  additionalValue?: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-gray-900">{value}</p>
      {additionalValue && (
        <p className="mt-1 text-sm text-gray-600">{additionalValue}</p>
      )}
    </div>
  );
}
