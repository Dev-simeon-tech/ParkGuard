import { LucideProps } from 'lucide-react';
import { RefAttributes, ForwardRefExoticComponent } from 'react';

type cardProps = {
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  cardHeader: string;
  cardValue: string;
};
const DataCard = ({ Icon, cardHeader, cardValue }: cardProps) => {
  return (
    <div className="p-4 flex items-center shadow-rounded">
      <Icon />
      <div>
        <h3 className="pb-5 font-body tracking-wider">{cardHeader}</h3>
        <p className="font-headline text-2xl font-bold">{cardValue}</p>
      </div>
    </div>
  );
};

export default DataCard;
