const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    short_description: {
        type: String,
        required: [true, "Short description is required"]
    },
    image: {
        type: String,
        required: [true, "Image URL is required"]
    },
    instruction: {
        type: String,
        required: [true, "Instruction is required"]
    },
    user_id: {
        type: String,
        required: [true, "user_id is required"]
    },
    created_at: {
        type: String,
        required: [true, "Created_at is required"]
    },
});


RecipeSchema.statics.getAllRecipe = async function(id){
    const fetchAllRecord = await this.find({ user_id: id });
    if(fetchAllRecord){
        return fetchAllRecord;
    }
    throw Error("NO RECORD FOUND");
}

RecipeSchema.statics.editRecipe = async function(id){
    const editRecord = await this.find({_id: id});
    if(editRecord){
        return editRecord;
    }
    throw Error("NO RECORD FOUND");
}

module.exports = mongoose.model('Recipe', RecipeSchema);
