import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { ScheduleService } from './schedule.services';

import { scheduleFilterableFields } from './schedule.constants';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import pick from '../../utils/pick';
import { IAuthUser } from '../../interface/common';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule created successfully',
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = req.user;
  const result = await ScheduleService.getAllFromDB(filters, options,user as IAuthUser);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule retrieval successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule deleted successfully',
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};
