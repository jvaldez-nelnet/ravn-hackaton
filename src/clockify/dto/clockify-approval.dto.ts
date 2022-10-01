export class ClockifyApprovalDto {
  id: string;
  workspaceId: string;
  dateRange: { start: string; end: string };
  owner: {
    userId: string;
    userName: string;
    timeZone: string;
    startOfWeek: string;
  };
  status: {
    state: string;
    updatedBy: string;
    updatedByUserName: string;
    updatedAt: string;
    note: string;
  };
  creator: {
    userId: string;
    userName: string;
    userEmail: string;
  };
}
