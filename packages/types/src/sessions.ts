export type VehicleSummary = {
  id: string;
  plateNumber: string;
  color: string | null;
  model: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VehicleDetail = VehicleSummary & {
  visitCount: number;
  totalBilled: number;
  lastSeenAt: string | null;
};

export type ParkingSessionSummary = {
  id: string;
  status: 'active' | 'completed';
  branch: { id: string; name: string };
  vehicle: { id: string; plateNumber: string; color: string | null; model: string | null };
  entryAt: string;
  exitAt: string | null;
  hasEntryPhoto: boolean;
  hasExitPhoto: boolean;
  entryConfidence: number | null;
  exitConfidence: number | null;
  entryRecordedBy: { id: string; firstName: string; lastName: string };
  exitRecordedBy: { id: string; firstName: string; lastName: string } | null;
  durationMinutes: number | null;
  totalAmount: number | null;
  createdAt: string;
  updatedAt: string;
};

export type PlateRecognitionResponse = {
  photoRef: string;
  plateNumber: string | null;
  confidence: number | null;
  matchedSessionId: string | null;
  matchedVehicle: VehicleSummary | null;
};

export type SessionAnalytics = {
  date: string;
  currentlyParked: number;
  totalCarsIn: number;
  totalCarsOut: number;
  totalRevenue: number;
};

export type SessionRevenueAnalytics = {
  date: string;
  branches: Array<{ branchId: string; branchName: string; expectedRevenue: number }>;
  totalExpectedRevenue: number;
  activeBranches: number;
  activeAttendants: number;
};

export type AttendantSessionAnalytics = {
  date: string;
  attendantId: string;
  totalCarsIn: number;
  totalCarsOut: number;
  recentSessions: ParkingSessionSummary[];
};
