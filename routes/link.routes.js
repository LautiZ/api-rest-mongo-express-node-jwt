import { Router } from "express";
import { createLink, getLink, getLinks, removeLink } from "../controllers/link.controller.js";
import { requireToken } from '../middlewares/requireToken.js';
import { bodyLinkValidator, paramLinkValidator } from "../middlewares/validatorManager.js";

const router = Router();

router.get('/', requireToken, getLinks);
router.get('/:id', requireToken, paramLinkValidator, getLink);
router.post('/', requireToken, bodyLinkValidator, createLink);
router.delete('/:id', requireToken, paramLinkValidator, removeLink);

export default router;