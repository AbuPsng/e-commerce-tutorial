import JWT from 'jsonwebtoken';
import User from '../models/userModel.js'
import { comparePassword, hashPassword } from '../helpers/authHelper.js';

// SIGN UP && POST
export const registerController = async (req, res, next) => {
    try {
        const { name, email, password, address, phone, answer } = req.body;

        //Validation
        if (!name) {
            return res.json({ message: "Name is required" })
        }
        if (!email) {
            return res.json({ message: "Email is required" })
        }
        if (!password) {
            return res.json({ message: "Password is required" })
        }
        if (!address) {
            return res.json({ message: "Address is required" })
        }
        if (!phone) {
            return res.json({ message: "Phone is required" })
        }
        if (!phone) {
            return res.json({ message: "Date of Birth is required" })
        }

        //Check user
        const existingUser = await User.findOne({ email })

        //existing user
        if (existingUser) return res.status(200).json({ status: "fail", message: "Already Register, Please Login" })

        const hashedPassword = await hashPassword(password)

        //new User
        const newUser = await User.create({ name, email, password: hashedPassword, phone, address, answer })

        res.status(201).json({ status: "success", message: "User register Successfully", user: newUser })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Error in Registration",
            error
        })
    }
}

// LOGIN && POST

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body

        //Validation
        if (!email) {
            return res.json({ error: "Email is required" })
        }
        if (!password) {
            return res.json({ error: "Password is required" })
        }

        //check user
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ status: "fail", message: "Email is not registered" })

        const matchPassword = await comparePassword(password, user.password)
        console.log(password, user.password)

        if (!matchPassword) return res.status(200).json({ status: "fail", message: "Invalid Password" })

        // Token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(200).send({
            status: "success",
            message: "Login Successfully",
            user: {
                name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role
            },
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            message: "Error in Login",
            error
        })
    }
}

export const testController = async (req, res) => {
    res.send("herohonsa")
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required to change password" })
        }
        if (!answer) {
            res.status(400).json({ message: "Answer is required to change password" })
        }
        if (!newPassword) {
            res.status(400).json({ message: "New Password is required to change password" })
        }

        const user = await User.findOne({ email, answer })
        if (!user) return res.status(404).json({
            status: "error",
            message: "Wrong Email or Answer"
        })
        console.log(user._id)
        console.log(user)


        const hashedPassword = await hashPassword(newPassword)

        const updatedUser = await User.findByIdAndUpdate(user._id, { password: hashedPassword })
        res.status(200).json({
            status: "success",
            message: "Password Reset Successfully",
            user: updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error
        })
    }
}

//Update Profile
export const updateProfileController = async (req, res) => {
    console.log(req.user)
    try {
        const { name, email, password, address, phone } = req.body;
        const existingUser = await User.findById(req.user._id)

        if (password && password.length < 6) {
            return res.status(200).json({ status: "fail", error: "Password is required and must be greater than 6" })
        }

        const hashedPassword = password ? await hashPassword(password) : existingUser.password

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            name: name || existingUser.name,
            phone: phone || existingUser.phone,
            address: address || existingUser.address,
            password: hashedPassword || existingUser.password,
        })

        res.status(200).json({
            status: "success",
            message: "Profile Updated Successfully",
            updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Error while Updating profile",
            error
        })
    }
}