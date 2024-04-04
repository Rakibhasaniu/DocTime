import { NextFunction, Request, Response, Router } from "express";
import { SpecialtiesController } from "./Specialties.controller";
import { fileUploader } from "../../utils/fileUploader";
import { SpecialtiesValidation } from "./specialties.validation";


const router = Router();


router.get('/',SpecialtiesController.getAllData)
router.delete('/:id',SpecialtiesController.deleteData)
router.post('/',
    fileUploader.upload.single('file'),
    (req:Request,res:Response,next:NextFunction) => {
        req.body=SpecialtiesValidation.create.parse(JSON.parse(req.body.data))
        return SpecialtiesController.insertIntoDB(req,res,next)
    }
)

export const SpecialtiesRoutes = router