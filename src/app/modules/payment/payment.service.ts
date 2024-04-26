import axios from 'axios'
import config from '../../config';
import prisma from '../../utils/prisma';
import { SSlService } from '../ssl/ssl.service';
import { PaymentStatus } from '@prisma/client';
import { IPaymentData } from '../ssl/ssl.interface';

const initPayment = async(id:string) => {
    const paymentData = await prisma.payment.findFirstOrThrow({
        where:{
            appointmentId:id
        },
        include:{
            appointment:{
                include:{
                    patient:true
                }
            }
        }
    })
    // console.log(paymentData)
    const initPaymentData:IPaymentData = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        name: paymentData.appointment.patient.name,
        email: paymentData.appointment.patient.email,
        address: paymentData.appointment.patient.address,
        phoneNumber: paymentData.appointment.patient.contactNumber
    }
    // console.log(initPaymentData)

    const result = await SSlService.initPayment(initPaymentData)
    
    return {
        paymentUrl:result.GatewayPageURL
    }
    
}
const validatePayment = async (payload: any) => {
    // if (!payload || !payload.status || !(payload.status === 'VALID')) {
    //     return {
    //         message: "Invalid Payment!"
    //     }
    // }

    // const response = await SSlService.validatePayment(payload);

    // if (response?.status !== 'VALID') {
    //     return {
    //         message: "Payment Failed!"
    //     }
    // }

    const response = payload;

    await prisma.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
            }
        });

        await tx.appointment.update({
            where: {
                id: updatedPaymentData.appointmentId
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
    });

    return {
        message: "Payment success!"
    }

}

export const PaymentService = {
    initPayment,
    validatePayment
    
}