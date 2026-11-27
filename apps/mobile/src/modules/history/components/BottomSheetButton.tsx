import { useBottomSheet } from '@gorhom/bottom-sheet';
import { Button } from '@/components/Button';

export default function BottomSheetButton({ title }: { title: string }) {
  const { close } = useBottomSheet();
  return (
    <Button onPress={() => close()} size={'lg'} variant={'outline'} className="">
      {title}
    </Button>
  );
}
