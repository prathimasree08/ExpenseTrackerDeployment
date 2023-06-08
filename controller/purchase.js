const Razorpay = require("razorpay");
const Order = require("../models/order");
const dotenv = require('dotenv');
dotenv.config();

exports.purchaseMembership = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      /* key_id: "rzp_test_6rsz85LJwO1Ent",
      key_secret: "SbKIQKtHn0d64Od3j73gIztl",*/
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    const amount = 50000;

    const order = await rzp.orders.create({ amount, currency: "INR" });

    await req.user.createOrder({ orderId: order.id, status: "Pending" });

    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    res.status(403).json({ message: "something went wrong", error: err });
  }
};

exports.transactionUpdate = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderId: order_id } });

    const promise1 = order.update({
      paymentId: payment_id,
      status: "Successfull",
    });
    const promise2 = req.user.update({ isPremiumUser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "Transaction Successfull" });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.failTransactionUpdate = async (req, res, next) => {
  try {
    console.log(req.body.order_id);
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderId: order_id } });
    order.update({ paymentId: payment_id, status: "FAILED" });
    return res.status(403).json({ message: "Transaction Failed" });
  } catch (err) {
    console.log(err);
  }
};
