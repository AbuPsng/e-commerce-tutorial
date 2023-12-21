import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    product: [
        {
            type: mongoose.ObjectId,
            ref: "Product"
        }
    ],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]
    }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)

export default Order 