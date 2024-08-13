const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TvShowSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  cast: [{ type: Schema.Types.ObjectId, ref: 'CastMember' }]
});

module.exports = mongoose.model('TvShow', TvShowSchema);
