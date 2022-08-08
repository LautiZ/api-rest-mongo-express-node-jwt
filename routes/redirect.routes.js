import { Router } from "express";
import { redirectLink } from "../controllers/redirect.controller.js";
const router = Router();

router.get('/:nanolink', redirectLink);

export default router;