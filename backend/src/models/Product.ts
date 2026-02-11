import { model, Schema, Document, Model } from "mongoose";
import slugify from "slugify";
import { IProduct } from "../types/productTypes";

export interface ProductModal extends IProduct, Document { }

const ProductSchema = new Schema<ProductModal>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        title: {
            type: String,
            required: false,
            trim: true
        },

        subTitle: {
            type: String,
            required: false,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        imageUrls: {
            type: [String],
            required: true,
        },

        tags: {
            type: [String],
            required: false,
            enum: {
                values: ['yeni', 'cok-satan', 'populer', 'dayanikli'],
                message: '${VALUE} geçerli bir etiket değil'
            },
            validate: {
                validator: (tags: string[]) =>  tags.length <= 3,
                message: 'En fazla 3 etiket seçilebilir!'
            }
        },

        category: {
            type: String,
            required: true,
            enum: {
                values: ['kilit', 'kapi', 'aksesuar', 'kasa', 'elektronik-kilit', 'otel-elektronik-kilit'],
                message: 'Geçerli bir kategori değil!'
            },
            lowercase: true,
            trim: true,
            index: true
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        properties: {
            type: [String],
            required: true,
            validate: {
                validator: (properties: string[]) =>
                    properties.length > 0 && properties.length <= 30,
                message: 'Ürün özellikleri minimum 1, maximum 30 tane olmalıdır!'
            }
        },

        weight: {
            type: String,
            required: true,
            trim: true,
            default: ""
        },

        isSelling: {
            type: Boolean,
            default: true,
            index: true
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        color: {
            type: String,
            trim: true
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
        }

    },
    {
        timestamps: true
    }
);


function createSlug(text: string): string {
    const turkishChars: { [key: string]: string } = {
        'ş': 's', 'Ş': 's', 'ı': 'i', 'İ': 'i', 'ğ': 'g', 'Ğ': 'g',
        'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
    };

    return text
        .split('')
        .map(char => turkishChars[char] || char)
        .join('')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

ProductSchema.pre<ProductModal>('save', async function (next?: any) {
    try {
        if (!this.isModified('name') && this.slug) {
            if (next && typeof next === 'function') {
                return next();
            }
            return;
        }

        let baseSlug = createSlug(this.name);
        let slug = baseSlug;
        let counter = 1;

        const ProductModel = this.constructor as Model<ProductModal>;

        while (true) {
            try {
                const existingProduct = await ProductModel.findOne({ slug });
                if (!existingProduct || (this._id && existingProduct._id && existingProduct._id.toString() === this._id.toString())) {
                    break;
                }
                slug = `${baseSlug}-${counter}`;
                counter++;

                if (counter > 1000) {
                    slug = `${baseSlug}-${Date.now()}`;
                    break;
                }
            } catch (err) {
                break;
            }
        }

        this.slug = slug;

        if (next && typeof next === 'function') {
            next();
        }
    } catch (error) {
        if (next && typeof next === 'function') {
            next(error as Error);
        } else {
            throw error;
        }
    }
});


const updateSlugHook = async function (this: any) {
    try {
        const update: any = this.getUpdate();
        if (!update) {
            return;
        }

        let nameToUse: string | undefined;

        if (update.$set && update.$set.name) {
            nameToUse = update.$set.name;
        } else if (update.name) {
            nameToUse = update.name;
        }

        if (nameToUse) {
            let baseSlug = createSlug(nameToUse);
            let slug = baseSlug;
            let counter = 1;
            const ProductModel = this.model as any;

            while (true) {
                const existingProduct = await ProductModel.findOne({ slug });
                const query = this.getQuery();
                if (!existingProduct || (existingProduct._id && query._id && existingProduct._id.toString() === query._id.toString())) {
                    break;
                }
                slug = `${baseSlug}-${counter}`;
                counter++;

                if (counter > 1000) {
                    slug = `${baseSlug}-${Date.now()}`;
                    break;
                }
            }

            if (update.$set) {
                update.$set.slug = slug;
            } else {
                update.slug = slug;
            }
        }
    } catch (error) {
        throw error;
    }
};

ProductSchema.pre('updateOne', updateSlugHook);
ProductSchema.pre('findOneAndUpdate', updateSlugHook);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ isDeleted: 1, isSelling: 1 });

const Product = model<ProductModal>("product", ProductSchema);

export default Product;
