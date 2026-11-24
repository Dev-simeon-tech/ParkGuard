import { formatNaira } from '@/utils/formatCurrency';

type RevenueDataCardProps = {
  branchName: string;
  amount: number;
};
const RevenuDataCard = ({ branchName, amount }: RevenueDataCardProps) => {
  return (
    <div className="rounded-lg bg-input-bg border border-border p-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">{branchName}</h3>
        <p className="text-secondary text-xl font-bold">{formatNaira(amount)}</p>
      </div>
    </div>
  );
};

export default RevenuDataCard;
