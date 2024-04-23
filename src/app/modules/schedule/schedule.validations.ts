import { z } from 'zod';

const create = z.object({
  body: z.object({
    startDateTime: z.string({
      required_error: 'Start Date is required',
    }),
    endDateTime: z.string({
      required_error: 'End Date is required',
    }),
    startTime: z.string({
      required_error: 'Start Time is required',
    }),
    endTime: z.string({
      required_error: 'End Time is required',
    }),
  }),
});

export const ScheduleValidation = {
  create,
};
