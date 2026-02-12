import { Response, Request } from "express";
import { ICreateProduct, IProduct, IUpdateProduct } from "../types/productTypes";
import Product from "../models/Product";



export const getAllProduct = async (req: Request, res: Response) => {
    try {
        const productData = await Product.find({ isDeleted: false }).sort({
            createdAt: -1
        });
        if (!productData || productData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Mevcut Ürün verisi bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Ürünler başarıyla getirildi!',
            data: productData
        });

    } catch (error) {
        console.error('Ürünler getirilirken hata meydana geldi!');
        return res.status(500).json({
            success: false,
            message: 'Ürünler getirilemedi! Lütfen tekrar deneyiniz!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};


export const getActiveProduct = async (req: Request, res: Response) => {
    try {

        const activeProduct = await Product.find({ isDeleted: false, isSelling: true, stock: { $gt: 0 } })
            .sort({ createdAt: -1 })
            .select('-isDeleted -createdAt -updatedAt');

        if (!activeProduct || activeProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aktif ürün listesi bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Aktif ürün listesi başarıyla getirildi!',
            data: activeProduct
        });

    } catch (error) {
        console.error('Aktif ürün listesi getirilirken hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Aktif ürün listesi getirilemedi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen kaynaklı hata!'
        });
    }
};


export const getBySlugProduct = async (req: Request, res: Response) => {
    try {

        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Ürün slug ismi bulunamadı!'
            });
        }

        const product = await Product.findOne({
            slug: slug,
            isDeleted: false,
            isSelling: true,
        }).select('-stock -discount -isDeleted -isSelling -createdAt -updatedAt');

        if (!product) {
            return res.status(400).json({
                success: false,
                message: 'Ürün bulunamadı! Ürün detayları getirilemedi!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Ürün detayları başarıyla getirildi',
            data: product
        });

    } catch (error: any) {
        console.error('Ürün detayları getirilemedi!' + error.message);
        return res.status(500).json({
            success: false,
            message: 'Ürün detayları getirilirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}


export const getSoftDeletedProduct = async (req: Request, res: Response) => {
    try {

        const softDeleteProduct = await Product.find({ isDeleted: true, isSelling: false }).sort({ createdAt: -1 });

        if (!softDeleteProduct || softDeleteProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sistemden geçici olarak silinen ürün mevcut değil!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Sistemden geçici olarak silinen ürünler başarıyla getirildi!',
            data: softDeleteProduct
        });

    } catch (error) {
        console.error('Sistemden geçici olarak silinen ürünler getirilemedi!', error);
        return res.status(500).json({
            success: false,
            message: 'Sistemden geçici olarak silinen ürün listesi getirilirken hata!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};


export const createProduct = async (req: Request, res: Response) => {

    try {

        const { name, description, title, subTitle, tags, category, price, color, stock, weight, properties, discount, isSelling }: ICreateProduct = req.body;

        console.log("REQ BODY : ", req.body);

        if (!name || !description || !title || !subTitle || !tags || !category || !price || !weight || !properties || !color || !stock) {
            return res.status(404).json({
                success: false,
                message: 'Lütfen zorunlu alanları doldurunuz.'
            });
        }

        if (typeof isSelling !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Satış özelliği beklenilen formatta değil!'
            });
        }

        if (typeof price !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Ürün fiyatı beklenilen fiyatta değil!'
            });
        }

        const categorySelect = ['kapi', 'kilit', 'aksesuar', 'kasa', 'elektronik-kilit', 'otel-elektronik-kilit'];
        if (!categorySelect.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Kategori geçersiz!'
            });
        }


        if (typeof stock !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Stok sayısı beklenilen formatta değil!'
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stok sayısı 0"dan az olamaz!'
            })
        }

        const props = Array.isArray(properties) ? properties : [properties];

        const tagsArray = Array.isArray(tags) ? tags : [tags];

        const files = req.files as Express.Multer.File[];

        const imageUrl = files?.map(file =>
            `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        );


        const newProduct = Product.create({
            name,
            title,
            subTitle,
            description,
            imageUrls: imageUrl,
            tags: tagsArray,
            category,
            price: parseFloat(price as any),
            weight,
            discount: discount ? parseFloat(discount as any) : 0,
            isSelling,
            properties: props,
            color,
            stock
        });


        (await newProduct).save();

        return res.status(201).json({
            success: true,
            message: 'Ürün başarıyla oluşturuldu!',
            data: newProduct
        });


    } catch (error) {
        console.error('Ürün oluşturulurken hata meydana geldi!');
        return res.status(500).json({
            success: false,
            message: 'Ürün oluşturulurken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};



export const updateProduct = async (req: Request | any, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Sorgulanıp güncellenecek ürün ID bulunamadı!'
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Güncellenecek ürün bulunamadı!'
            });
        }

        const {
            name,
            description,
            title,
            subTitle,
            tags,
            category,
            color,
            stock,
            price,
            isSelling,
            weight,
            properties,
            discount,
            deletedImages
        }: IUpdateProduct & { deletedImages?: string[] } = req.body;

        console.log("REQUEST BODY :", req.body);

        console.log("DELETE IMAGES : ", deletedImages);

        const updateProduct: Partial<IUpdateProduct> = {};

        if (name) updateProduct.name = name;
        if (description) updateProduct.description = description;
        if (tags) updateProduct.tags = tags;
        if (title) updateProduct.title = title;
        if (subTitle) updateProduct.subTitle = subTitle;
        if (category) updateProduct.category = category;
        if (color) updateProduct.color = color;
        if (stock !== undefined) updateProduct.stock = stock;
        if (price !== undefined) updateProduct.price = price;
        if (isSelling !== undefined) updateProduct.isSelling = isSelling;
        if (weight) updateProduct.weight = weight;
        if (properties) updateProduct.properties = properties;
        if (discount !== undefined) updateProduct.discount = discount;

        const deletedImagesArray: string[] = deletedImages
            ? Array.isArray(deletedImages)
                ? deletedImages
                : [deletedImages]
            : [];

        let imageUrls = product.imageUrls || [];

        if (deletedImagesArray.length > 0) {
            imageUrls = imageUrls.filter(
                img => !deletedImagesArray.includes(img)
            );
        }

        const files = req.files as Express.Multer.File[];

        if (files && files.length > 0) {
            const newImages = files.map(file =>
                `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            );

            imageUrls = [...imageUrls, ...newImages];
        }

        updateProduct.imageUrls = imageUrls;


        if (Object.keys(updateProduct).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Güncellenecek alan bulunamadı!'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateProduct,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Ürün başarıyla güncellendi!',
            data: updatedProduct
        });

    } catch (error: any) {
        console.error('Ürün güncellenirken hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Ürün güncellenirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};




export const softDeleteProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Sorgulanıp soft delete silinecek ID bulunamadı!'
            });
        }

        const softProduct = await Product.findByIdAndUpdate(
            id,
            {
                isDeleted: true, isSelling: false
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!softProduct) {
            return res.status(404).json({
                success: false,
                message: 'Yumuşak silinecek bir ürün bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Ürün yumuşak olarak silindi! Sistemden geçici olarak kaldırıldı!',
            data: softProduct
        });

    } catch (error) {
        console.error('Ürün yumuşak olarak silinirken hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Ürün yumuşak olarak silinemedi! Sistemden geçici olarak kaldırılamadı!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};



export const restoreProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Sorgulanıp restore edilecek ürün ID bulunamadı!'
            });
        }

        const restoreProduct = await Product.findByIdAndUpdate(
            id,
            {
                isDeleted: false, isSelling: true
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!restoreProduct) {
            return res.status(404).json({
                success: false,
                message: 'Restore edilecek bir ürün bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Ürün restore edildi! Sisteme geri çağrıldı!',
            data: restoreProduct
        });

    } catch (error) {
        console.error('Ürün restore edilirken hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Ürün restore edilirken hata! Ürün sisteme geri çağrılamadı!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};



export const hardDeleteProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Sorgulanıp silinecek bir ürün ID bulunamadı!'
            });
        }

        const deleteProduct = await Product.findByIdAndDelete(id);

        if (!deleteProduct) {
            return res.status(404).json({
                success: false,
                message: 'Silinecek bir ürün bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Ürün başarıyla silindi! Sistemden kalıcı olarak kaldırıldı!',
            data: deleteProduct
        });

    } catch (error) {
        console.error('Ürün silinirken hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Ürün sistemden kalıcı olarak silinemedi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};


