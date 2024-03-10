import { configureStore } from "@reduxjs/toolkit"
import recipeReducer from '../slice/RecipeSlice';

export const store =configureStore({
    reducer:{
        recipes: recipeReducer
    }
})