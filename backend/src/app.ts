import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from 'path';
import cookieParser from "cookie-parser";

import AuthRoutes from "./routes/authRoutes";
import UserRoutes from "./routes/userRoutes";
import ContactRoutes from "./routes/contactRoutes";
import ProductRoutes from "./routes/productRoutes";
import CartRoutes from "./routes/cartRoutes";
import OrderRoutes from "./routes/orderRoutes";
import JobRoutes from "./routes/jobRoutes";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000"
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization',  'x-session-id'],
    methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST']
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', AuthRoutes);
app.use('/api', UserRoutes);
app.use('/api', ContactRoutes);
app.use('/api', ProductRoutes);
app.use('/api', CartRoutes);
app.use('/api', OrderRoutes);
app.use('/api', JobRoutes);

app.get('/', (req, res) => {
    res.send(`Backend sunucusu çalışıyor...`);
});


export default app;


