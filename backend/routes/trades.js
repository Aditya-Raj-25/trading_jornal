const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TradeController = require('../controllers/trades');

router.use(auth);

router.post('/', TradeController.createTrade.bind(TradeController));
router.get('/', TradeController.getTrades.bind(TradeController));
router.get('/:id', TradeController.getTradeById.bind(TradeController));
router.put('/:id', TradeController.updateTrade.bind(TradeController));
router.delete('/:id', TradeController.deleteTrade.bind(TradeController));

module.exports = router;
