const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const PasswordReset = sequelize.define("ForgotPasswordRequests", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  isActive: Sequelize.BOOLEAN,
});

//Override the default id generation with a UUId generator
PasswordReset.beforeCreate((resetRequest, _) => {
  resetRequest.id = uuidv4();
});

module.exports = PasswordReset;
