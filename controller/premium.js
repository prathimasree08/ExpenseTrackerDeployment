const User = require("../models/user");
const UserExpense = require("../models/expense");
//const sequelize = require("../util/database");
const S3Services = require("../services/s3services");
const AWS = require("aws-sdk");
const FileDb = require("../models/download");

async function getAllUsersWithExpenses(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
}

async function download(req, res, next) {
  try {
    const userId = req.user.id;
    const expense = await UserExpense.findAll({ where: { userId: userId } });
    const strExpenses = JSON.stringify(expense);
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(strExpenses, filename);
    const link = await FileDb.create({
      fileURL: fileURL,
      userId: userId,
    });
    res.status(201).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function downloadFile(req, res, next) {
  try {
    const userId = req.user.id;
    const links = await FileDb.findAll({
      where: {
        userId: userId,
      },
    });

    res.json(links);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getAllUsersWithExpenses, download, downloadFile };
