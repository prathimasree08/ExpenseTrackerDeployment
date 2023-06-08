const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const DownloadFile = sequelize.define("filelinks", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    alllowNull: false,
    primaryKey: true,
  },
  fileURL: Sequelize.STRING,
});

module.exports = DownloadFile;
