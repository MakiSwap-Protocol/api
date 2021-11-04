import express from "express";
import controller from "../controllers/main";
const router = express.Router();

router.get("/pairs", controller.getPairs);
router.get("/tickers", controller.getTickers);
router.get("/orderbook", controller.getOrderbook);

export = router;
