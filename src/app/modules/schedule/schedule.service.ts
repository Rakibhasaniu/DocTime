import { Request } from "express"
import { fileUploader } from "../../utils/fileUploader";
import prisma from "../../utils/prisma";

const insertIntoDB = async(payload:any) => {
    const {startDate,endDate,startTime,endTime} = payload;
    // return result;
}


export const SchedulesServices = {
    insertIntoDB,
    
}