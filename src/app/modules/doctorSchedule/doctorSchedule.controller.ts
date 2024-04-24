import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { DoctorScheduleService } from './doctorSchedule.service';
import sendResponse from '../../utils/sendResponse';
import pick from '../../utils/pick';
import { scheduleFilterableFields } from './doctorSchedule.constant';
import { IAuthUser } from '../../interface/common';


const insertIntoDB = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
  const user = req.user;
  const result = await DoctorScheduleService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Schedule created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await DoctorScheduleService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Schedule retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

// const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await DoctorScheduleService.getByIdFromDB(id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Doctor Schedule retrieval successfully',
//     data: result,
//   });
// });

// const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await DoctorScheduleService.updateIntoDB(id, req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Doctor Schedule updated successfully',
//     data: result,
//   });
// });

// const deleteFromDB = catchAsync(async (req: Request , res: Response) => {
//   const user = req.user;
//   const { id } = req.params;
//   const result = await DoctorScheduleService.deleteFromDB(user, id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Doctor Schedule deleted successfully',
//     data: result,
//   });
// });

// const getMySchedules = catchAsync(async (req: Request, res: Response) => {
//   const filters = pick(req.query, scheduleFilterableFields);
//   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//   const user = req.user;
//   const result = await DoctorScheduleService.getMySchedules(filters, options, user);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Doctor Schedule retrieval successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

export const ScheduleController = {
  insertIntoDB,
  getAllFromDB,
  // getByIdFromDB,
  // updateIntoDB,
//   deleteFromDB,
//   getMySchedules
};
