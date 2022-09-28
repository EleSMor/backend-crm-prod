const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema(
    {
        fullName: { type: String },
        tag: [{ type: String, enum: ["Cliente", "Propietario"], required: true }],
        email: { type: String },
        contactMobileNumber: { type: String },
        contactPhoneNumber: { type: String },
        company: { type: String },
        contactDirection: {
            address: {
                street: { type: String },
                directionNumber: { type: Number },
                directionFloor: { type: String }
            },
            postalCode: { type: String },
            city: { type: String },
            country: { type: String }
        },
        contactComments: { type: String },
        notReceiveCommunications: { type: Boolean },
        consultant: { type: mongoose.Types.ObjectId, ref: 'consultants' }
    },
    {
        timestamps: true
    }
)

const Contact = mongoose.model('contacts', contactSchema);

module.exports = Contact;