const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create roleSchema
const RoleSchema = new Schema({
    message: String,
    emoji: String,
    role: String
  })

module.exports = RoleModel = mongoose.model("role", RoleSchema);
