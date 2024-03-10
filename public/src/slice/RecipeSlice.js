import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    recipeList: [],
    selectedrecipe: {},
    isLoading: false,
    error: ''
}

const BASE_URL = `https://recipe-management-4886.onrender.com/`;



// GET Fetch
export const getAllRecipe = createAsyncThunk(
    "api/getAllRecipe",
    async (user, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://recipe-management-4886.onrender.com/api/fetch_all_recipe`, {user_id:user});
            return response.data;
        } catch (error) {
            return rejectWithValue({ error: 'No recipe Found' });
        }
    }
);

// POST Insert
export const storeRecipe = createAsyncThunk(
    "api/add_recipe",
    async (recipe, { rejectWithValue }) => {
        try {
            var file = recipe.recipe_image;
            var form = new FormData();
            form.append('recipe_name', recipe.recipe_name);
            form.append('short_description', recipe.short_description);
            form.append('user_id', recipe.user_id);
            form.append('instruction', recipe.instruction);
            form.append('recipe_image', file, file.name);
            
            const response = await axios.post(`${BASE_URL}api/add_recipe`, form,  {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue({ error: 'SERVER_ERROR' });
        }
    }

);


// PATCH Update
export const editRecipe = createAsyncThunk(
    "api/edit_recipe",
    async (recipe, { rejectWithValue }) => {
        try {

            const form = {
                instruction: recipe.instruction,
                recipe_name: recipe.recipe_name,
                short_description: recipe.short_description,
                user_id: localStorage.getItem('user_id'),
                _id: recipe._id,
            }

            const response = await axios.post(`https://recipe-management-4886.onrender.com/api/edit_recipe`, form);

            return response.data;

        } catch (error) {
            console.error("Error updating recipe:", error.message);
            return rejectWithValue({ error: 'SERVER_ERROR' });
        }
    }
);


// DELETE Update
export const deleteRecipe = createAsyncThunk(
    "api/deleteRecipe",
    async (recipe, { rejectWithValue }) => {
        try {
            const id = recipe._id; 
            const response = await axios.post(`${BASE_URL}api/delete_recipe`, {id:id});
            return response.data;
        } catch (error) {
            return rejectWithValue({ error: 'recipe Not Deleted Successfully' });
        }
    }
);

const recipeSlice = createSlice({
    name: 'recipeSlice',
    initialState,
    reducers: {
        addRecipe: (state, action) => {
            let recipe = { ...action.payload };
            state.recipeList.push(recipe);
        },
        removeRecipe: (state, action) => {
            state.recipeList = state.recipeList.filter((recipe) => recipe.id !== action.payload.id);
        },
        updateRecipe: (state, action) => {
            state.recipeList = state.recipeList.map((recipe) => recipe.id === action.payload.id ? action.payload : recipe);
        },
        setRecipe: (state, action) => {
            state.selectedrecipe = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllRecipe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllRecipe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.recipeList = action.payload;
            })
            .addCase(getAllRecipe.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
                state.recipeList = [];
            })

            .addCase(storeRecipe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(storeRecipe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.recipeList.push(action.payload);
            })
            .addCase(storeRecipe.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
                state.recipeList = [];
            })

            .addCase(editRecipe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editRecipe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.recipeList = state.recipeList.map((recipe) => recipe.id === action.payload.response ? action.payload : recipe);
            })
            .addCase(editRecipe.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
                state.recipeList = [];
            })

            .addCase(deleteRecipe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
            })
            .addCase(deleteRecipe.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
                state.recipeList = [];
            });
    }
});

export const { addRecipe, removeRecipe, updateRecipe, setRecipe } = recipeSlice.actions;

export default recipeSlice.reducer;
