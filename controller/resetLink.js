const UserExpense = require("../models/expense");

const User = require("../models/user");

const ForgotPasswordRequests = require("../models/ForgotPasswordRequests");

const sequelize = require("../util/database");




exports.getResetLink = async (req, res, next) => {

  const prodId = req.params.id;

  try {

    const user = await ForgotPasswordRequests.findOne({

      where: {

        id: prodId,

        isActive: true,

      },

    });

    if (!user) {

      return res.status(400).json({ error: "Link Expired,Please try again" });

    }

    res.status(200).send(`<html>

        <script>

        function formsubmitted(e){

            e.preventDefault();

            console.log('called')

        }

        </script>

        <body>

        <form action = "/password/updatepassword/${prodId}" method = "get">

        <label for ="newpassword">Enter New Password</label>

        <input name =  'newpassword" type="password" required>

        <button>Reset Password</button>

        </form>

        </body>

        </html>

        `);

    res.end();

  } catch (err) {

    console.log(err);

    return res.status(500).json({ error: "Server Error" });

  }

};