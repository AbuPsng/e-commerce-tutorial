import Category from "../models/categoryModel.js";
import slugify from "slugify"

export const createCategoryController = async (req, res) => {
    try {

        const { name } = req.body;

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) return res.status(401).json({ status: "success", message: "Category Already Exists" })

        const category = await Category.create({ name, slug: slugify(name) })

        res.status(201).json({
            status: "success", message: "New Category Created", category
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            error,
            message: "Error is Category"
        })
    }

}

//Update Category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        console.log(name)
        const { id } = req.params
        console.log(id)
        const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        console.log(category)
        res.status(200).json({
            status: "success",
            message: "Category Updated Successfully",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "success",
            error,
            message: "Error while updating category"
        })
    }
}

//Get all category

export const categoryController = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({
            status: "success",
            message: "All Categories List",
            category: categories
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "success", error, message: "Error while getting all categories" })
    }

}

//Get single category
export const singleCategoryController = async (req, res) => {
    try {
        // console.log(re)
        const category = await Category.findOne({ slug: req.params.slug })
        if (!category) return res.status(404).json({ status: "fail", message: "Category dosen't exist" })

        res.status(200).json({
            status: "success",
            message: "Get Single Category Successfully",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            error,
            message: "Error while getting single category"
        })
    }
}

//Get single category
export const deleteCategoryController = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: "success",
            message: "Category Delete Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "fail",
            error,
            message: "Error while deleting single category"
        })
    }
}

