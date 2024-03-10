const { register, login, forget_password, reset_password, update_password,  } = require('../Controllers/AuthController');
const { CreateRecipe, fetchRecipe, editRecipe, deleteRecipe } = require('../Controllers/RecipeController');
const { checkUser } = require('../Middleware/AuthMiddleware');

const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = `public/recipe_image/${req.body.user_id}/${req.body.recipe_name}/`;
        fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });
const router = require('express').Router();

router.post('/', checkUser);
router.post('/register',register);
router.post('/login',login);
router.post('/forget-password',forget_password);
router.get('/reset-password/:id/:token',reset_password);
router.post('/reset-password/:id/:token',update_password);

/*** CRUD => RECIPE ***/ 
router.post('/api/add_recipe',upload.single('recipe_image'),CreateRecipe)
router.post('/api/fetch_all_recipe',fetchRecipe);
router.post('/api/edit_recipe/',editRecipe);
router.post('/api/delete_recipe/',deleteRecipe);



module.exports = router;
