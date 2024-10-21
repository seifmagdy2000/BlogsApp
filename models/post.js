const mongoose = require("mongoose");

const schema = mongoose.Schema;
const postSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  tags: {
    type: Array,
    required: false,
  },
});
module.exports = mongoose.model("post", postSchema);
