const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Discord Server Schema
const ServerSchema = new Schema({
    id: String,
    welcomeChannel: String,
    autoroles: { type: [ String ], default: [] } 
  })

  module.exports = ServerModel = mongoose.model("server", ServerSchema);
