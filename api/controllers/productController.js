import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/OrderModel.js"
import fs from "fs"
import slugify from "slugify";
import braintree from "braintree"
import dotenv from "dotenv"

dotenv.config()

//* Payment Gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: `${process.env.BRAINTREE_MERCHANT_ID}`,
    publicKey: `${process.env.BRAINTREE_PUBLIC_KEY}`,
    privateKey: `${process.env.BRAINTREE_PRIVATE_KEY}`,
});

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files;
        //Validation
        switch (true) {
            case !name:
                return res.status(500).json({ error: "Name is required" })
            case !description:
                return res.status(500).json({ error: "Description is required" })
            case !price:
                return res.status(500).json({ error: "Price is required" })
            case !category:
                return res.status(500).json({ error: "Category is required" })
            case !quantity:
                return res.status(500).json({ error: "Quantity is required" })
            case photo && photo.size > 1000000:
                return res.status(500).json({ error: "Photo is required and must be less than 1mb" })
        }

        const products = new Product({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()

        res.status(201).json({
            status: "success",
            message: "Product Created Successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            error,
            message: "Error in creating product"
        })
    }
}

//Get All Products
export const getAllProductController = async (req, res) => {
    try {
        const products = await Product.find({}).select("-photo").populate("category").limit(12).sort({ createdAt: -1 })
        res.status(200).json({
            status: "success",
            totalProducts: products.length,
            message: "All Products",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            message: "Error while getting all products",
            error: error.message
        })
    }
}

//Get Single Products
export const getSingleProductController = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        if (!product) {
            return (
                res.status(500).json({
                    status: "fail",
                    message: "No Product with this name"
                })
            )
        }
        res.status(200).json({
            status: "success",
            message: "Single Product",
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            message: "Error while getting single products",
            error: error.message
        })
    }
}
//Get  Products Photo
export const productPhotoController = async (req, res) => {
    const id = req.params.pid
    try {
        const product = await Product.findById(id).select("photo")
        // console.log(product)
        // console.log(product.photo.data)
        if (!product) {
            return (
                res.status(500).json({
                    status: "fail",
                    message: "No Product with this name"
                })
            )
        }

        if (product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }

        res.status(200).json({
            status: "success",
            message: "Single Product",
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            message: "Error while getting products photo",
            error: error.message
        })
    }
}

export const deleteSingleProductController = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id).select("-product_photo")
        res.status(200).json({
            status: "success",
            message: "Product Deleted Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            message: "Error while deleting products photo",
            error: error.message
        })
    }
}

//Update Single Product
export const updateSingleProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files;
        //Validation
        switch (true) {
            case !name:
                return res.status(500).json({ error: "Name is required" })
            case !description:
                return res.status(500).json({ error: "Description is required" })
            case !price:
                return res.status(500).json({ error: "Price is required" })
            case !category:
                return res.status(500).json({ error: "Category is required" })
            case !quantity:
                return res.status(500).json({ error: "Quantity is required" })
            case photo && photo.size > 1000000:
                return res.status(500).json({ error: "Photo is required and must be less than 1mb" })
        }

        const products = await Product.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()

        res.status(201).json({
            status: "success",
            message: "Product Updated Successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            error,
            message: "Error in updating product"
        })
    }
}

//** Filter Product */

export const productFiltersController = async (req, res) => {
    try {
        const { check, radio } = req.body;
        let args = {}
        if (check.length > 0) args.category = check
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

        const products = await Product.find(args)
        res.status(200).json({
            status: "success",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "fail", message: "Error while Filtering Products", error })
    }
}

// * Product Count
export const productCountController = async (req, res) => {
    try {
        const total = await Product.find({}).countDocuments()
        res.status(200).json({
            status: "success",
            total
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error in product count",
            error
        })
    }
}

//* Product List Base on Page
export const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1
        const total = await Product.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).json({
            status: "success",
            total
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error in getting product per page",
            error
        })
    }
}

//Search Product 
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")
        res.status(200).json({
            status: "success",
            results
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error in Search product API",
            error
        })
    }
}

// * Similar Products
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await Product.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")

        res.status(200).json({
            status: "success",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error while getting similar product ",
            error
        })
    }
}

// * Get product by category
export const productCategoryController = async (req, res) => {
    console.log(req.params)
    try {
        const { slug } = req.params
        const category = await Category.findOne({ slug })
        const products = await Product.find({ category })
        res.status(200).json({
            status: "success",
            category,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error while getting product by category ",
            error
        })
    }
}

// Payment gateway api
// 1> token
export const brainTreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error while getting token for payment ",
            error
        })
    }
};

// 2> Payment 
export const brianTreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map(i => total += i.price)

        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = Order.create({ product: cart, payment: result, buyer: req.user._id })
                    res.json({ ok: true })
                } else {
                    res.status(500).json({ error })
                }
            }
        )
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error while making payment",
            error
        })
    }
}

// * Orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id }).populate("product", "-photo").populate("buyer", "name")
        res.json({ orders })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error while getting ordersDetails ",
            error
        })
    }
}

// ** All Orders
export const getAllOrderController = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("product", "-photo").populate("buyer", "name").sort({ createdAt: -1 })
        res.json({ orders })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error while getting ordersDetails ",
            error
        })
    }
}

//* Order Status
export const orderStatusController = async (req, res) => {
    try {
        const { status } = req.body
        const { orderId } = req.params
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(updatedOrder)
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
            message: "Error while updating ordersDetails ",
            error
        })
    }
}