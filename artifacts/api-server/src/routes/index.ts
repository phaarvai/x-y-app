import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import searchRouter from "./search";
import conversationsRouter from "./conversations";
import languagesRouter from "./languages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(searchRouter);
router.use(conversationsRouter);
router.use(languagesRouter);

export default router;
