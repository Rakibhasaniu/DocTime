import { z } from "zod";

const updateAdminData = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
});


export const adminValidationSchemas = {
    updateAdminData
}