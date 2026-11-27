import BottomSheet from '@gorhom/bottom-sheet';
import { ParkingSessionSummary } from '@parkguard/types';
import { Search } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/modules/auth/context/auth-context';
import { useListSession } from '../api/listSessions';
import SessionBottomSheet from '../components/SessionBottomSheet';
import SessionCard from '../components/SessionCard';

export function HistoryScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [currentSession, setCurrentSession] = useState<ParkingSessionSummary | null>(null);
  const [status, setStatus] = useState<'active' | 'completed' | undefined>(undefined);
  const [plateNumber, setPlateNumber] = useState('');

  const debouncedPlateNumber = useDebounce(plateNumber);
  const { branches } = useAuth();
  const branchId = branches[0]?.branchId ?? '';
  const { data, refetch, isLoading } = useListSession({
    branchId,
    limit: 20,
    status,
    plateNumber: debouncedPlateNumber,
  });

  const sessions = data?.sessions;

  const handleOpenButtonSheet = (session: ParkingSessionSummary) => {
    setCurrentSession(session);
    bottomSheetRef.current?.snapToIndex(3);
  };

  return (
    <SafeAreaView
      edges={['top', 'right', 'left']}
      className="flex-1  items-center justify-center gap-3 bg-white px-6 pb-0"
    >
      <View className="flex-1 h-full  w-full pt-4">
        <View className="mb-10">
          <Input
            onChangeText={setPlateNumber}
            placeholder="Search by Plate Number..."
            leftIcon={<Search size={20} color={'#76777d'} />}
          />
          <Select
            value={
              status
                ? { label: status.charAt(0).toUpperCase() + status.slice(1), value: status }
                : { label: 'Filter by status', value: 'all' }
            }
            onValueChange={(option) =>
              setStatus(
                option?.value === 'active' || option?.value === 'completed'
                  ? option.value
                  : undefined,
              )
            }
            className="mt-5 w-[150px]"
          >
            <SelectTrigger className="bg-neutral-100">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="w-[150px] bg-white shadow-xl">
              <SelectItem label="All" value="all">
                All
              </SelectItem>
              <SelectItem label="Active" value="active">
                Active
              </SelectItem>
              <SelectItem label="Completed" value="completed">
                Completed
              </SelectItem>
            </SelectContent>
          </Select>
        </View>

        <View className="gap-4 flex-1">
          <FlatList
            data={sessions}
            ItemSeparatorComponent={<View className="h-4"></View>}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SessionCard onClick={handleOpenButtonSheet} session={item} />
            )}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        </View>
      </View>
      <SessionBottomSheet ref={bottomSheetRef} currentSession={currentSession} />
    </SafeAreaView>
  );
}
