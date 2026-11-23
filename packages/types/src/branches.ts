export type BranchSummary = {
  id: string;
  name: string;
  state: string;
  address: string;
  totalCapacity: number;
  status: 'active' | 'disabled';
  disabledAt: string | null;
  totalMembers: number;
  totalActiveSessions: number;
  rate: {
    durationMinutes: number;
    pricePerDuration: number;
    gracePeriodMinutes: number;
    dailyMaxAmount: number | null;
  };
  createdAt: string;
  updatedAt: string;
};
