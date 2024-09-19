const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guideSchema = new Schema({
    g_id: {type: String, required: true, unique: true },
    h_id: { type: String, ref: 'hotel', required: true },  // Reference to Hotel
    check_in: { type: Date, required: true },
    check_out: { type: Date, required: true },
    g_prefrences: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Guide', guideSchema);
