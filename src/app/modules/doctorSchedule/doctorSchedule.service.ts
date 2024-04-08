import prisma from "../../utils/prisma"


const insertIntoDB = async(user:any,payload:{
    scheduleIds:string[]
}) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })
    const doctorScheduleData = payload.scheduleIds.map(scheduleId =>({
        doctorId:doctorData.id,
        scheduleId
    }))
    console.log(doctorScheduleData)
    const result = await prisma.doctorSchedule.createMany({
        data:doctorScheduleData
    })

    return result;
}

export const DoctorSchedulesService = {
    insertIntoDB
}