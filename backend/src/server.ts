import app from "./app"
import dotenv from "dotenv";
import dataBase from "./config/dataBase";

dotenv.config({
    debug: true
});

dataBase();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT}'unda çalışmaya başladı...`);
});