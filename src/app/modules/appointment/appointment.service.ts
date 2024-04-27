import { AppointmentStatus, PaymentStatus, Prisma, UserRole } from "@prisma/client"
import { IAuthUser } from "../../interface/common"
import { IPaginationOptions } from "../../interface/pagination"
import { paginationHelper } from "../../utils/paginationHelpers"
import prisma from "../../utils/prisma"
import { v4 as uuidv4} from 'uuid'
import ApiError from "../../errors/appError"
import httpStatus from "http-status"



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
    // console.log(user,filters,options)
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

const changeAppointmentStatus = async(id:string,status:AppointmentStatus,user:IAuthUser) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where:{
            id
        },
        include:{
            doctor:true
        }
    })
    if (user?.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment!")
        }
    }
    const result = await prisma.appointment.update({
        where:{
            id
        },
        data:{
            status
        }
    })
    return result;
}
const cancelUnpaidAppointments = async () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)

    const unPaidAppointments = await prisma.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo
            },
            paymentStatus: PaymentStatus.UNPAID
        },
    });

    const appointmentIdsToCancel = unPaidAppointments.map(appointment => appointment.id);

    await prisma.$transaction(async (tx) => {
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIdsToCancel
                }
            }
        });

        await tx.appointment.deleteMany({
            where: {
                id: {
                    in: appointmentIdsToCancel
                }
            }
        });

        for (const upPaidAppointment of unPaidAppointments) {
            await tx.doctorSchedules.updateMany({
                where: {
                    doctorId: upPaidAppointment.doctorId,
                    scheduleId: upPaidAppointment.scheduleId
                },
                data: {
                    isBooked: false
                }
            })
        }
    })

    //console.log("updated")
}
export const AppointmentService = {
    createAppointment,
    getMyAppointMent,
    changeAppointmentStatus,
    cancelUnpaidAppointments


}