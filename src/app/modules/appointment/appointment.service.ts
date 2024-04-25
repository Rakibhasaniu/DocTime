import { Prisma, UserRole } from "@prisma/client"
import { IAuthUser } from "../../interface/common"
import { IPaginationOptions } from "../../interface/pagination"
import { paginationHelper } from "../../utils/paginationHelpers"
import prisma from "../../utils/prisma"
import { v4 as uuidv4} from 'uuid'



const createAppointment = async(user:IAuthUser,payload:any) => {
    // console.log('ap',payload)

    const patientData = await prisma.patient.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            id:payload.doctorId
        }
    })
    const DoctorScheduleData = await prisma.doctorSchedules.findFirstOrThrow({
        where:{
            doctorId:doctorData.id,
            scheduleId:payload.scheduleId,
            isBooked:false
        }
    })
    const videoCallingId:string =  uuidv4()
    // console.log(videoCallingId)
    const result = await prisma.$transaction(async (cr) => {
        const appointmentData = await cr.appointment.create({
            data:{
                patientId:patientData.id,
                doctorId:doctorData.id,
                scheduleId:payload.scheduleId,
                videoCallingId
            },
            include:{
                patient:true,
                doctor:true,
                schedule:true
            }
        })
        await cr.doctorSchedules.update({
            where:{
                doctorId_scheduleId:{
                    doctorId:doctorData.id,
                    scheduleId:payload.scheduleId
                }
            },
            data:{
                isBooked:true,
                appointmentId:appointmentData.id
            }
        })
        const today = new Date();
        const transactionId = "DocTime-"+today.getFullYear()+"-"+today.getMonth()+"-"+today.getDay()+"-"+today.getHours()+"-"+today.getMinutes();
        await cr.payment.create({
            data:{
                appointmentId:appointmentData.id,
                amount:doctorData.appointmentFee,
                transactionId,

            }
        })
        return appointmentData;
    })
    return result;
}

const  getMyAppointMent = async(user:IAuthUser,filters:any,options:IPaginationOptions) => {
    console.log(user,filters,options)
    const {limit,page,skip} = paginationHelper.calculatePagination(options);
    const {...filterData} = filters;

    const condition:Prisma.AppointmentWhereInput[]=[];


    if(user?.role === UserRole.PATIENT){
        condition.push({
            patient:{
                email:user?.email
            }
        })
    }else if (user?.role === UserRole.DOCTOR){
        condition.push({
            doctor:{
                email:user?.email
            }
        })
     }

    

    if(Object.keys(filterData).length > 0){
        const filterCondition = Object.keys(filterData).map(key => ({
            [key]:{
                equals:(filterData as any)[key],
            }
        }))
        condition.push(...filterCondition)
    }
    
    const FinalCondition:Prisma.AppointmentWhereInput =condition.length > 0? {AND: condition}:{}

    const result = await prisma.appointment.findMany({
        where:FinalCondition,
        skip:(Number(page-1) * limit),
        take: Number(limit),
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: user?.role === UserRole.PATIENT 
        ?{ doctor: true,schedule: true } : { patient: {include: { medicalReport:true, patientHealthData:true }} ,schedule:true }
    });
    const total = await prisma.appointment.count({
        where: FinalCondition
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}

export const AppointmentService = {
    createAppointment,
    getMyAppointMent,

}