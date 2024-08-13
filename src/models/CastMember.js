const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CastMemberSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  birthday: { type: Date, required: false }
});

module.exports = mongoose.model('CastMember', CastMemberSchema);
