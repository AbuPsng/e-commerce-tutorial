import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECT_DB)
        console.log(`connected to database ${connect.connection.host}`)
    } catch (error) {
        console.log("Unable to connect to database", error)
    }
}

export default connectDB