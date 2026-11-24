import { LucideProps } from 'lucide-react';
import { RefAttributes, ForwardRefExoticComponent } from 'react';

type cardProps = {
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  cardHeader: string;
  cardValue: string;
};
const DataCard = ({ Icon, cardHeader, cardValue }: cardProps) => {
  return (
    <div className="p-4 flex items-center shadow-md rounded-2xl">
      {Icon ? <Icon /> : null}
      <div>
        <h3 className="pb-5 font-headline tracking-wider">{cardHeader}</h3>
        <p className="font-headline text-3xl font-bold">{cardValue}</p>
      </div>
    </div>
  );
};

export default DataCard;
