"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.transaction, {
        as: "userPayment",
        foreignKey: "userId",
      })
      user.hasMany(models.chat, {
        as: "senderMessage",
        foreignKey: {
          name: "idSender",
        },
      })
      user.hasMany(models.chat, {
        as: "recipientMessage",
        foreignKey: {
          name: "idRecipient",
        },
      })
    }
  }
  user.init(
    {
      email: DataTypes.STRING,
      fullName: DataTypes.STRING,
      password: DataTypes.STRING,
      listAs: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      profileImage: DataTypes.STRING,
      subscribe: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user",
    }
  )
  return user
}
