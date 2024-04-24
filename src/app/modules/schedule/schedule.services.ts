import { Prisma, Schedule } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import { ISchedule, IScheduleFilterRequest } from './schedule.interface';
import prisma from '../../utils/prisma';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../utils/paginationHelpers';
import { IAuthUser } from '../../interface/common';


const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
}

const insertIntoDB = async (payload: ISchedule) => {
  const { startDateTime, endDateTime, startTime, endTime } = payload;

  const interverlTime = 30;

  const schedules = [];

  const currentDate = new Date(startDateTime); // start date
  const lastDate = new Date(endDateTime) // end date
  console.log(currentDate)
  console.log(lastDate)

  while (currentDate <= lastDate) {
    // 09:30  ---> ['09', '30']
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(startTime.split(':')[0])
        ),
        Number(startTime.split(':')[1])
      )
    );
    console.log(startDateTime)
  
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(endTime.split(':')[0])
        ),
        Number(endTime.split(':')[1])
      )
    );
    console.log('s',endDateTime)
  

    while (startDateTime < endDateTime) {
      const scheduleData = {
          startDateTime: startDateTime,
          endDateTime: addMinutes(startDateTime, interverlTime)
      }

      // const s = await convertDateTime(startDateTime);
      // const e = await convertDateTime(addMinutes(startDateTime, interverlTime))

      // const scheduleData = {
      //   startDateTime: s,
      //   endDateTime: e
      // }

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime
        }
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData
        });
        schedules.push(result);
      }
      // console.log(scheduleData)

      startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const getAllFromDB = async (
  filters: IScheduleFilterRequest,
  options: IPaginationOptions,
  user:IAuthUser
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const {startDateTime,endDateTime,...filterData } = filters;
  // console.log(startDateTime,endDateTime)

  const andConditions = [];
  if (startDateTime && endDateTime) {
        andConditions.push({
          AND: [
            {
              startDateTime: {
                gte: startDateTime, // Greater than or equal to startDate
              },
            },
            {
              endDateTime: {
                lte: endDateTime, // Less than or equal to endDate
              },
            },
          ],
        });
      }

  // if (searchTerm) {
  //   andConditions.push({
  //     OR: patientSearchableFields.map(field => ({
  //       [field]: {
  //         contains: searchTerm,
  //         mode: 'insensitive',
  //       },
  //     })),
  //   });
  // }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
      const doctorsSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email
      }
    }
  });

  const doctorScheduleIds = doctorsSchedules.map(schedule => schedule.scheduleId);
console.log(doctorScheduleIds)
  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id:{
        notIn:doctorScheduleIds
      }
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc',
        },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id:{
        notIn:doctorScheduleIds
      }
    
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// const getAllFromDB = async (
//   filters: IScheduleFilterRequest,
//   options: IPaginationOptions,
//   user: any
// ) => {
//   const { limit, page, skip } = paginationHelper.calculatePagination(options);
//   const { startDate, endDate, ...filterData } = filters; // Extracting startDate and endDate from filters

//   const andConditions = [];

//   // Adding date filtering conditions if startDate and endDate are provided
//   if (startDate && endDate) {
//     andConditions.push({
//       AND: [
//         {
//           startDate: {
//             gte: startDate, // Greater than or equal to startDate
//           },
//         },
//         {
//           endDate: {
//             lte: endDate, // Less than or equal to endDate
//           },
//         },
//       ],
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map(key => {
//         return {
//           [key]: {
//             equals: (filterData as any)[key],
//           },
//         };
//       }),
//     });
//   }

//   const whereConditions: Prisma.ScheduleWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};


//   const doctorsSchedules = await prisma.doctorSchedules.findMany({
//     where: {
//       doctor: {
//         email: user.email
//       }
//     }
//   });

//   const doctorScheduleIds = new Set(doctorsSchedules.map(schedule => schedule.scheduleId));

//   const result = await prisma.schedule.findMany({
//     where: {
//       ...whereConditions,
//       id: {
//         notIn: [...doctorScheduleIds]
//       }
//     },
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? { [options.sortBy]: options.sortOrder }
//         : {
//           createdAt: 'desc',
//         },
//   });
//   const total = await prisma.schedule.count({
//     where: {
//       ...whereConditions,
//       id: {
//         notIn: [...doctorScheduleIds]
//       }
//     }
//   });

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   };
// };

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ScheduleService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};
