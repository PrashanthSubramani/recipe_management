const RecipeModel = require('../Models/RecipeModel');
const fs = require('fs');
const path = require('path');

module.exports.CreateRecipe = async (req, res, next) => {
    try {

        const { recipe_name, short_description, instruction, user_id } = req.body;

        const datetime = new Date();

        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        fs.readFile(req.file.path, (err, data) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: "Failed to read file" });
            }

            const base64Image = Buffer.from(data).toString('base64');

            RecipeModel.create({
                name: recipe_name,
                short_description: short_description,
                image: base64Image,
                instruction: instruction,
                user_id: user_id,
                created_at: datetime.toISOString().slice(0,10)
            })
            .then(() => {
                fs.unlinkSync(req.file.path);
                res.status(201).json({ error: 0, message: "Recipe added successfully" });
            })
            .catch(error => {
                console.error(error.message);
                res.status(500).json({ error, message: "Failed to save recipe" });
            });
        });
    } catch (error) {
        res.status(500).json({ error, message: error.message });
    }
};


module.exports.fetchRecipe = async (req, res, next)=>{
    try {
            const user_id = req.body.user_id;
            const response  = await RecipeModel.getAllRecipe(user_id);
            res.status(200).json({response:response});

    } catch (error) {
        res.status(500).json({ error, message: error.message });
    }
}


module.exports.editRecipe = async (req, res, next) => {
    try {
        const { _id, recipe_name, short_description, instruction } = req.body;

        const recipe = await RecipeModel.findById(_id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        recipe.name = recipe_name;
        recipe.instruction = instruction;
        recipe.short_description = short_description;

        // Save the updated recipe
        await recipe.save();

        return res.status(200).json({ error: 0, message: "Recipe updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: 1, message: error.message });
    }
}

module.exports.deleteRecipe = async (req, res, next) => {
    try {

        const {id} = req.body;

        const recipe = await RecipeModel.deleteOne({_id:id});

        return res.status(200).json({ error: 0, message: "Recipe delete successfully" });
        
    } catch (error) {
        return res.status(500).json({ error: 1, message: error.message });
    }
}




