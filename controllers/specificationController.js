const mongoose = require("mongoose")
const Specification = require("../models/specification")

// Create a new specification
exports.createSpecification = async (req, res) => {
    try{
        const {
            material,
            position,
            fitment,
            warranty,
            dimensions,
            weight,
            features,
            compatibility
        } = req.body

        if(!material || !position || !fitment || !warranty || !dimensions || !weight || !features || !compatibility) {
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        const newSpecification = new Specification({
            material,
            position,
            fitment,
            warranty,
            dimensions,
            weight,
            features,
            compatibility
        })
        await newSpecification.save()

        return res.status(201).json({
            success : true,
            message : "Specification created successfully",
            data : newSpecification
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Failed to create specification"
        })
    }
}

// Get all specification
exports.getAllSpecification = async (req, res) => {
    try{
        const specs = await Specification.find()
        return res.status(200).json({
            success : true,
            message : "Specification fetched successfully",
            data : specs
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Failed to fetch specification"
        })
    }
}

// Get specification by ID
exports.getSpecificationById = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success : false,
            message : "Invalid specification ID"
        })
    }
    try{
        const spec = await Specification.findById(id)

        if(!spec) {
            return res.status(404).json({
                success :false,
                message : "Specification not found"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Specification fetched successfully",
            data : spec
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Failed to fetch specification"
        })
    }
}

// Get specification by ID
exports.getSpecificationById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid specification ID"
        });
    }

    try {
        const spec = await Specification.findById(id);

        if (!spec) {
            return res.status(404).json({
                success: false,
                message: "Specification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Specification fetched successfully",
            data: spec
        });
    } catch (err) {
        console.error("Get Specification By ID Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch specification"
        });
    }
};

// Update specification by ID
exports.updateSpecification = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid specification ID"
        });
    }

    try {
        const updatedSpec = await Specification.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedSpec) {
            return res.status(404).json({
                success: false,
                message: "Specification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Specification updated successfully",
            data: updatedSpec
        });
    } catch (err) {
        console.error("Update Specification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update specification"
        });
    }
};

// Delete specification by ID
exports.deleteSpecification = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid specification ID"
        });
    }

    try {
        const deletedSpec = await Specification.findByIdAndDelete(id);

        if (!deletedSpec) {
            return res.status(404).json({
                success: false,
                message: "Specification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Specification deleted successfully"
        });
    } catch (err) {
        console.error("Delete Specification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete specification"
        });
    }
};