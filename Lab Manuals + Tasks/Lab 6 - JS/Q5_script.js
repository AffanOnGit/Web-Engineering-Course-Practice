let recipes = [];

function addRecipe(name, ingredients, instructions) {
    let newRecipe = {
        name : name,
        ingredients : ingredients,
        instructions : instructions
    }
    recipes.push(newRecipe);
}

function listRecipes() {
    console.log(recipes);
}

function searchRecipeByIngredient(ingredient) {
    let len = recipes.length;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (recipes.ingredients[j] == ingredient) {
                console.log(recipes[i].name);
            }
        }
    }
}

let recipe1 = {
    name : "pasta",
    ingredients : ["flour", "water"],
    instructions : "Mix and cook"
};

let recipe2 = {
    name : "butter chicken",
    ingredients : ["butter", "chicken"],
    instructions : "cook"
};

let recipe3 = {
    name : "poached egg",
    ingredients : ["egg", "salt", "vinegar", "water"],
    instructions : "Stir and cook"
};

addRecipe(recipe1);
addRecipe(recipe2);
addRecipe(recipe3);

listRecipes();

searchRecipeByIngredient("water");