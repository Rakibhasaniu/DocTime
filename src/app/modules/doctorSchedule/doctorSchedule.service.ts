import prisma from "../../utils/prisma"


const insertIntoDB = async(user:any,payload:{
    scheduleIds:string[]
}) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })
}

export const DoctorSchedulesService = {
    insertIntoDB
}