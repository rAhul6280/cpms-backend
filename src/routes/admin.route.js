import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import { getAllSelections, getFilteredSelection, updateSelectionStatus } from "../controllers/admin.controller.js";

const router = Router()
//get all selections
router.route('/get-all').get(verifyJWT,getAllSelections)

//get selections based on status
router.route('/filtere-selections').get(verifyJWT,getFilteredSelection)

//approve or reject a selctions 
router.route('/update/:selectionId').patch(verifyJWT,updateSelectionStatus)

export default router

