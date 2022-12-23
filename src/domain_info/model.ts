import mongoose, { Document, Schema } from 'mongoose'

export interface IReport {
    userName: string
    phoneNumber: string
    address: string
    email: string
    description: string
}

export interface IReportModel extends IReport, Document { }

const IReportSchema = new Schema({
    userName: { type: String, require: true },
    phoneNumber: { type: String, require: false },
    address: { type: String, require: false },
    email: { type: String, require: true },
    description: { type: String, require: true },
}, {
    timestamps: true,
    versionKey: false
})

export default mongoose.model<IReport>('Report', IReportSchema)