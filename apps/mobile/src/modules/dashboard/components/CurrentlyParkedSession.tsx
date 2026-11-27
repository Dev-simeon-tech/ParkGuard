import BottomSheet from '@gorhom/bottom-sheet';
import { ParkingSessionSummary } from '@parkguard/types';
import { useState, useRef } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { useAuth } from '@/modules/auth/context/auth-context';
import { useListSession } from '@/modules/history/api/listSessions';
import SessionBottomSheet from '@/modules/history/components/SessionBottomSheet';
import SessionCard from '@/modules/history/components/SessionCard';

const CurrentlyParkedSession = () => {
  const {
    branches: [{ branchId }],
  } = useAuth();
  const [currentSession, setCurrentSession] = useState<ParkingSessionSummary | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const { data, refetch, isRefetching } = useListSession({
    branchId,
    limit: 10,
    status: 'active',
  });

  const handleOpenButtonSheet = (session: ParkingSessionSummary) => {
    setCurrentSession(session);
    bottomSheetRef.current?.snapToIndex(3);
  };

  const sessions = data?.sessions;
  return (
    <>
      <View>
        {/* <FlatList
          data={sessions}
          ItemSeparatorComponent={<View className="h-4"></View>}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SessionCard onClick={handleOpenButtonSheet} session={item} />}
          refreshing={isRefetching}
          onRefresh={refetch}
        /> */}
        <View className="gap-3 pb-4 mt-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-neutral-900">Currently Parked</Text>
            <Pressable onPress={() => refetch()}>
              <Text className="text-sm font-medium text-brand-primary">Refresh</Text>
            </Pressable>
          </View>
        </View>
        <View className="gap-4">
          {sessions?.map((session, index) => (
            <SessionCard
              key={index + session.id}
              onClick={handleOpenButtonSheet}
              session={session}
            />
          ))}
        </View>
      </View>
      <SessionBottomSheet ref={bottomSheetRef} currentSession={currentSession} />
    </>
  );
};

export default CurrentlyParkedSession;
