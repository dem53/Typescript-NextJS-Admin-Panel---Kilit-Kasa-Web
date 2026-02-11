import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    debug: true
});


export const connectionDatabase = async (): Promise<void> => {
    try {
        const mongoUrl = process.env.MONGO_LOCAL_URI;

        if (!mongoUrl){
            throw new Error("MongoDB URL adresi bulunamadı! Lütfen .env dosyanızı kontrol ediniz!");
        }

        await mongoose.connect(mongoUrl).then(() => {
            console.log("✅ Veri Tabanı Bağlantısı Başarılı!!")
        }).catch((err : any) => {
            console.log(err, "❌ Veri Tabanı Bağlantısı Başarısız Oldu!")
        })
    } catch (error : any) {
        console.log("‼️ Veri tabanaı Bağlantısı gerçekleşemedi!");
        process.exit(1);
    }
};



export default connectionDatabase;