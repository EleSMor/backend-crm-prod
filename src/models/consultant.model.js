const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const consultantSchema = new Schema({
    role: { type: String, enum: ["Admin", "Consultor"], default: "Consultor" },
    fullName: { type: String, required: true },
    consultantEmail: { type: String, required: true },
    consultantPassword: { type: String, required: true },
    avatar: { type: String },
    companyUnitLogo: { type: String },
    consultantMobileNumber: { type: String, required: true },
    consultantPhoneNumber: { type: String },
    position: { type: String },
    profession: { type: String },
    office1: { type: String },
    office2: { type: String },
    consultantComments: { type: String },
    ads: { type: mongoose.Types.ObjectId, ref: 'ads' },
},
    {
        timestamps: true
    }
)

const Consultant = mongoose.model('consultants', consultantSchema);

module.exports = Consultant;