import { IAuthUser } from "../../interface/common"
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
        return appointmentData;
    })
    return result;
}

export const AppointmentService = {
    createAppointment,

}