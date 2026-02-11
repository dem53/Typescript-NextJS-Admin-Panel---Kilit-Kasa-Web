import { Model, Schema, model } from "mongoose";
import { ICustomerInfo, IJob, JobPaymentStatus, JobPaymentType, JobStatus } from "../types/jobTypes";



const CustomerSchema = new Schema<ICustomerInfo>({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxLength: 11
    },
    phone2: {
        type: String,
        required: false,
        trim: true,
        maxLength: 11
    }
}, {
    timestamps: false,
    _id: false
});


const JobSchema = new Schema<IJob>({

    jobNumber: {
        type: String,
        required: false,
        trim: true,
        unique: true,
        sparse: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    customer: CustomerSchema,

    adminNote: {
        type: String,
        required: false,
        trim: true
    },

    personelNote: {
        type: String,
        required: false,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    district: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0,
        trim: true
    },

    jobStatus: {
        type: String,
        enum: Object.values(JobStatus),
        default: JobStatus.PENDING || 'pending'
    },

    jobPaymentType: {
        type: String,
        enum: Object.values(JobPaymentType),
        default: JobPaymentType.CREDIT_CARD || 'credit_card'
    },

    jobPaymentStatus: {
        type: String,
        enum: Object.values(JobPaymentStatus),
        default: JobPaymentStatus.PENDING || 'pending'
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        trim:  true,
        required: false
    },

    updatedBy: {
        type: String,
        ref: 'user',
        trim: true,
        required: false
    },

}, {
    _id: true,
    timestamps: true
});


JobSchema.index({ jobNumber: 1 }, { unique: true });

interface IJobModal extends Model<IJob> {
    generateJobNumber(): Promise<string>;
}


JobSchema.statics.generateJobNumber = async function (): Promise<string> {

    const prefix = "JOB";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let jobNumber;
    let isUnique = false;

    while (!isUnique) {

        let randomPart = "";

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomPart += characters.charAt(randomIndex);
        }

        jobNumber = `${prefix}${randomPart}`

        const existingJobNumber = await this.findOne({ jobNumber });
        if (!existingJobNumber) {
            isUnique = true;
        }

    }
    return jobNumber as string;
}


const Job = model<IJob, IJobModal>('job', JobSchema);


export default Job;