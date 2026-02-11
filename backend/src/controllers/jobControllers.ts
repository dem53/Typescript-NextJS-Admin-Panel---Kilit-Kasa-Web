import { Response, Request, NextFunction } from "express";
import { ICreateJob, IUpdateJob, JobPaymentStatus, JobStatus } from "../types/jobTypes";
import Job from "../models/Job";


interface IAuth extends Request {
    user?: any;
}


export const getAllJob = async (req: IAuth, res: Response, next: NextFunction) => {
    try {
        const jobData = await Job.find().sort({ createdAt: -1 });
        if (!jobData || jobData.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'İş formları bulunamadı! Mevcut Değil!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tüm iş formları başarıyla getirildi',
            data: jobData
        });

    } catch (error: any) {
        console.error('Tüm iş formları getirilirken hata meydana geldi' + error.message);
        return res.status(500).json({
            success: false,
            message: 'Tüm iş verileri getirilirken hata meydana geldi',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};



export const createJob = async (req: IAuth, res: Response, next: NextFunction) => {
    try {

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı ID bulunamadı!'
            });
        }

        const { name, address, city, district, customer, price, jobPaymentType, adminNote }: ICreateJob = req.body;

        console.log("REQUEST : ", req.body);

        if (!name || !address || !city || !district || !customer || !price || !jobPaymentType) {
            return res.status(404).json({
                success: false,
                message: 'Lütfen zorunlu alanları boş bırakmayınız!'
            });
        }

        if (name.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen iş adını 6 karakterden fazla yazınız.'
            });
        }

        const validJobPaymentType = ['cash', 'credit_card'];
        if (!validJobPaymentType.includes(jobPaymentType)) {
            return res.status(400).json({
                success: false,
                message: 'İş ödeme tipi beklenilen tipte değil!'
            });
        }

        if (!customer.fullName || !customer.phone) {
            return res.status(400).json({
                success: false,
                message: 'İş tanımı için ulaşılacak kişi bilgisi eksik!'
            });
        }

        let createJobNumber = await Job.generateJobNumber();

        let perosonelNote = '';

        let updatedBy = '';

        const newJob = Job.create({
            jobNumber: createJobNumber,
            name,
            address,
            city,
            district,
            customer,
            price,
            jobPaymentType,
            adminNote: adminNote,
            personelNote: perosonelNote,
            jobStatus: JobStatus.PENDING,
            jobPaymentStatus: JobPaymentStatus.PENDING,
            createdBy: userId,
            updatedBy: updatedBy,
        });


        (await newJob).save();

        return res.status(201).json({
            success: true,
            message: 'Yeni yapılacak iş sisteme eklendi!',
            data: newJob
        });

    } catch (error: any) {
        console.error('Yeni iş tanımı eklenemedi!' + error.message);
        return res.status(500).json({
            success: false,
            message: 'Yeni iş tanımı eklenirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}



export const updateJob = async (req: IAuth, res: Response) => {

    try {

        const userName = req.user?.firstName;

        if (!userName) {
            return res.status(401).json({
                success: false,
                message: 'Yetkisiz erişim!'
            });
        }

        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'İş ID bulunamadı!'
            });
        }

        const { price, jobStatus, jobPaymentStatus, personelNote }: IUpdateJob = req.body;

        if (jobStatus === undefined || jobPaymentStatus === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Zorunlu alanlar eksik!'
            });
        }

        const isValidJobStatus = (s: any): s is JobStatus =>
            ['pending', 'success', 'failed', 'cancelled', 'ready'].includes(s);

        const isValidJobPaymentStatus = (s: any): s is JobPaymentStatus =>
            ['pending', 'success', 'failed', 'cancelled'].includes(s);

        if (!isValidJobStatus(jobStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz iş durumu!'
            });
        }

        if (!isValidJobPaymentStatus(jobPaymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz ödeme durumu!'
            });
        }

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'İş kaydı bulunamadı!'
            });
        }

        job.updatedBy = userName;
        if (price !== undefined) job.price = price;
        if (job.jobStatus) job.jobStatus = jobStatus;
        if (job.jobPaymentStatus) job.jobPaymentStatus = jobPaymentStatus;
        if (personelNote !== undefined) job.personelNote = personelNote;


        await job.save();

        return res.status(200).json({
            success: true,
            message: 'İş kaydı başarıyla güncellendi',
            data: job
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'İş güncellenirken hata oluştu!',
            error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
};



export const deleteJob = async (req: IAuth, res: Response) => {
    try {
        
        const { id } = req.params;

        if (!id){
            return res.status(404).json({
                success: false,
                message: 'Silinecek iş form kaydı ID bulunamadı!'
            });
        }

        const deletedJob = await Job.findByIdAndDelete(id);

        if(!deletedJob){
            return res.status(400).json({
                success: false,
                message: 'Silinecek iletişim form kaydı bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'İletişim form kaydı başarıyla silindi!',
            data: deletedJob
        });
        
    } catch (error: any) {
        console.error('İletişim form kaydı silinemedi! ' + error.message);
        return res.status(500).json({
            success: false,
            message: 'İletişim form kaydı silinirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}
