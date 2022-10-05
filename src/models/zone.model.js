const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const zoneSchema = new Schema(
    {
        zone: { type: String },
        name: { type: String },
        id: { type: String },
        status: { type: Boolean, default: false },
    },
    {
        timestamps: true
    });

const Zone = mongoose.model('zones', zoneSchema);

module.exports = Zone;