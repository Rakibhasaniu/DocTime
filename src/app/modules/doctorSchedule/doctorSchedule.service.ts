
import { IDoctorScheduleFilterRequest } from './doctorSchedule.interface';

import httpStatus from 'http-status';
import { equal } from 'assert';
import prisma from '../../utils/prisma';
import ApiError from '../../errors/appError';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../utils/paginationHelpers';
import { DoctorSchedules, Prisma } from '@prisma/client';


const insertIntoDB = async (data: { scheduleIds: string[] }, user: any): Promise<{ count: number }> => {
  const { scheduleIds } = data;
  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user.email
    }
  });
  // console.log('doctor',isDoctorExists)

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exists!")
  }
  const doctorSchedulesData = scheduleIds.map(scheduleId => ({
    doctorId: isDoctorExists.id,
    scheduleId
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorSchedulesData
  });
  console.log('result',result)
  return result;
};


// const getAllFromDB = async (
//   filters: IDoctorScheduleFilterRequest,
//   options: IPaginationOptions,
// ): Promise<IGenericResponse<DoctorSchedules[]>> => {
//   const { limit, page, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, ...filterData } = filters;
//   const andConditions = [];

//   if (searchTerm) {
//     andConditions.push({
//       doctor: {
//         name: {
//           contains: searchTerm,
//           mode: 'insensitive',
//         },
//       },
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
//       filterData.isBooked = true;
//     } else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
//       filterData.isBooked = false;
//     }
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key]
//         }
//       }))
//     });
//   }

//   const whereConditions: any =
//     andConditions.length > 0 ? { AND: andConditions } : {};
//   const result = await prisma.doctorSchedules.findMany({
//     include: {
//       doctor: true,
//       schedule: true,
//     },
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? { [options.sortBy]: options.sortOrder }
//         : {
//           createdAt: 'desc',
//         },
//   });
//   const total = await prisma.doctorSchedules.count({
//     where: whereConditions,
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

// const getByIdFromDB = async (id: string): Promise<DoctorSchedule | null> => {
//   const result = await prisma.doctorSchedule.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       doctor: true,
//       schedule: true,
//     },
//   });
//   return result;
// };

// const updateIntoDB = async (
//   id: string,
//   payload: Partial<DoctorSchedule>,
// ): Promise<DoctorSchedule | null> => {
//   const result = await prisma.doctorSchedule.update({
//     where: {
//       id,
//     },
//     data: payload,
//     include: {
//       doctor: true,
//       schedule: true,
//     },
//   });
//   return result;
// };

// const deleteFromDB = async (user: any, scheduleId: string): Promise<DoctorSchedules> => {
//   const isDoctorExists = await prisma.doctor.findFirst({
//     where: {
//       email: user.email
//     }
//   });

//   if (!isDoctorExists) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exitsts")
//   }

//   const result = await prisma.doctorSchedules.delete({
//     where: {
//       doctorId_scheduleId: {
//         doctorId: isDoctorExists.id,
//         scheduleId: scheduleId
//       }
//     }
//   })
//   return result;
// };

// const getMySchedules = async (
//   filters: IDoctorScheduleFilterRequest,
//   options: IPaginationOptions,
//   user: any
// ) => {
//   const { limit, page, skip } = paginationHelper.calculatePagination(options);
//   const { startDate, endDate, ...filterData } = filters;

//   const whereConditions: Prisma.DoctorSchedulesWhereInput = {
//     doctor: {
//       email: user.email
//     },
//     ...(startDate && endDate ? {
//       schedule: {
//         startDate: {
//           gte: new Date(startDate)
//         },
//         endDate: {
//           lte: new Date(endDate)
//         }
//       }
//     } : {}),
//     ...(Object.keys(filterData).length > 0 ? {
//       AND: Object.keys(filterData).map(key => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     } : {})
//   };


//   const doctorSchedules = await prisma.doctorSchedules.findMany({
//     where: whereConditions,
//     include: {
//       doctor: true,
//       schedule: true,
//       appointment: true,
//     },
//     skip,
//     take: limit,
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   return {
//     meta: {
//       total: doctorSchedules.length,
//       page,
//       limit,
//     },
//     data: doctorSchedules,
//   };
// };

export const DoctorScheduleService = {
  insertIntoDB,
//   getAllFromDB,
  // getByIdFromDB,
  // updateIntoDB,
//   deleteFromDB,
//   getMySchedules
};
