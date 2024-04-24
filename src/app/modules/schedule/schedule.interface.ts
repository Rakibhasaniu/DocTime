export type ISchedule = {
  startDateTime: string;
  endDateTime: string;
    startTime: string;
    endTime: string;
  };
  
  export type IScheduleFilterRequest = {
    startDateTime?: string | undefined;
    endDateTime?: string | undefined;
  };
  