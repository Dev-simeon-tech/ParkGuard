export function SetupStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-2.5">
      <span className="pt-0.5 font-mono text-[10px] font-semibold tracking-wide text-secondary">
        {number}
      </span>
      <span>
        <strong className="block font-semibold text-[#344a42]">{title}</strong>
        {description}
      </span>
    </li>
  );
}
