const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const { authRoute, paymentRoute, transferRoute, walletRoute } = require('./routes');
router.use('/account', authRoute);
router.use('/payment', paymentRoute);
router.use('/transfer', transferRoute);
router.use('/wallet', walletRoute);
app.use('/', router);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use((req, res, next) => {
  next(new APIError('API not found', 404))
})

app.use((err, req, res, next1) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message
  });
});
