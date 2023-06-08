const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sib = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequests");

//require("dotenv").config();
const dotenv = require('dotenv');
dotenv.config();

const client = Sib.ApiClient.instance;
const apikey = client.authentications["api-key"];
apikey.apiKey = process.env.API_KEY;

exports.postForgetPassword = (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const tranEmailApi = new Sib.TransactionalEmailsApi();

  User.findAll({ where: { email }, attributes: ["id"] })
    .then((data) => {
      const jsonData = JSON.parse(JSON.stringify(data));
      if (jsonData.length > 0) {
        return ForgotPasswordRequest.create({
          id,
          isActive: true,
          userId: jsonData[0].id,
        });
      } else {
        res.json({ status: "email not found" });
      }
    })
    .then((data) => {
      const sender = {
        name: "Reset Password",
        email: "shivkumar9334@gmail.com",
      };
      const recivers = [
        {
          email: email,
        },
      ];
      return tranEmailApi.sendTransacEmail({
        sender,
        to: recivers,
        subject: "Reset Password",
        textContent: "Reset Your Password",
        htmlContent: `<p>Please click the link below to reset your password.
                if not done by you, please change your password</p> 
                <a href="http://localhost:4000/password/resetpassword/${id}">Reset link</a>`,
      });
    })
    .then((data) => {
      console.log(data);
      res.status(200).json({ status: "done" });
    })
    .catch((e) => {
      console.log(e);
      res.json({ status: "error" });
    });
};

exports.getUpdatePassword = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const data = await ForgotPasswordRequest.findByPk(req.params.id);
    console.log(data);
    if (data.isActive) {
      data.isActive = false;
      data.save();
      res.send(`
    <form action='http://localhost:4000//password/updatepassword' method='POST'>
      <input name='password' placeholder='enter new password'/>
      <input type="hidden" name="id" value=${data.userId} />
      <button type='submit'>Submit</button>
    </form>`);
    } else {
      res.send("<h1>Link Exprire</h1>");
    }
  } catch (e) {
    console.log(e);
    res.send("<h1>Link Exprire</h1>");
    console.log(e);
  }
};

exports.finalReset = (req, res, next) => {
  const { password, id } = req.body;

  bcrypt.hash(password, 8, (err, hash) => {
    User.findByPk(id)
      .then((data) => {
        data.password = hash;
        data.save();
        res.send("<h3>Password Has Been Reset!</h3><h3>Login again</h3> ");
      })
      .catch((e) => console.log(e));
  });
};

/*const User = require("../models/user");
const Sib = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequests");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
require("dotenv").config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;
// apiKey.apiKey =
//   "xsmtpsib-e460c9c7970bfa6417603edaf2963b4160ade3aa9c1a8fa19e17405354a838eb-RVF9BjkhrMY0WJyI";
const sender = {
  email: "shivkumar9334@gmail.com",
  name: "Expense Tracker App",
};

exports.postForgetPassword = async (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  const id = v4();
  console.log(id);
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(409).json({ error: "User does not exist" });
    } else {
      const reset = await ForgotPasswordRequest.create({
        isActive: true,
        userId: user.id,
      });
      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const receivers = [
        {
          email: email,
        },
      ];
      const response = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Password Reset Link",
        textContent: `Please click on the link to reset your password.`,
        htmlContent: `<p>Please click the link below to reset your password.
                if not done by you, please change your password</p> 
                <a href="http://localhost:4000/password/resetpassword/${id}">Reset link</a>`,
      });
      console.log(response);
      return res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ error: "User does not exists" });
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(req.query);
    const newpassword = req.query.newpassword;
    const result = await ForgotPasswordRequest.findOne({ where: { id: id } });
    const user = await User.findOne({ where: { id: result.userId } });

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
      bcrypt.hash(newpassword, salt, function (err, hash) {
        //Store hash in your DB
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        user.update({ password: hash }).then(() => {
          res
            .status(201)
            .json({ message: "You Successfully updated the new password" });
          res.update({
            isActive: false,
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}; */
