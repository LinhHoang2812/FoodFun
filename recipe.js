const url = new URLSearchParams(window.location.search);
const id = url.get("id");

const introContainer = document.querySelector(".intro-container");
const ingredients = document.querySelector(".ingredients-list");
const instructionDetail = document.querySelector(".instruction-detail");
const tagsList = document.querySelector(".tags-list");

const getSingleRecipe = async () => {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  const { meals } = data;
  return meals[0];
};

const displaySingleRecipe = async () => {
  const data = await getSingleRecipe();
  const {
    strMeal: name,
    strCategory: category,
    strArea: area,
    strMealThumb: image,
    strInstructions: instruction,
    strTags: tags,
  } = data;

  const simpleList = [];
  for (var i = 1; i < 21; i++) {
    var ingredient = data[`strIngredient${i}`];
    if (ingredient) {
      simpleList.push(ingredient);
    }
  }

  const ingredientsList = [];
  for (var i = 1; i < 21; i++) {
    var ingredient = data[`strMeasure${i}`] + " " + data[`strIngredient${i}`];
    if (
      ingredient !== "null null" &&
      ingredient !== "  " &&
      ingredient !== " "
    ) {
      ingredientsList.push(ingredient);
    }
  }

  const totalIngredients = ingredientsList.length;
  introContainer.innerHTML = `<div class="single-recipe-img" >
  <img src="${image}">
  </div>
  <div class="recipe-summary">
  <h3 class="recipe-name">${name}</h3>
  <div class="short-info">
  
  <div>
  <h4>Ingredients</h4>
  <p>${totalIngredients}</p>
  </div>
  
  <div>
  <h4>Category</h4>
  <p>${category}</p>
  </div>
  
  <div>
  <h4>Country</h4>
  <p>${area}</p>
  </div>
  
  </div>
  <button class="save-btn">Save to mealboard</button>
  
  </div>
  `;

  ingredients.innerHTML = `${ingredientsList
    .map((item) => {
      return `<li>${item}</li>`;
    })
    .join("")}`;
  var arrayInstruction = instruction.split(/\. (?=[A-Z])/);
  console.log(arrayInstruction);

  instructionDetail.innerHTML = `${arrayInstruction
    .map((item) => {
      return `<li>${item}</li>`;
    })
    .join("")}`;

  if (tags) {
    var tagsArray = tags.split(",");

    tagsList.innerHTML = `${tagsArray
      .map((item) => {
        return `<button class="tag-btn">${item}</button>`;
      })
      .join("")}`;
  }

  //save to mealboard
  const saveBtn = document.querySelector(".save-btn");

  saveBtn.addEventListener("click", () => {
    addLocalStorage(id, name, image, totalIngredients, simpleList);
  });
};

displaySingleRecipe();

function getLocalStorage() {
  return localStorage.getItem("meals")
    ? JSON.parse(localStorage.getItem("meals"))
    : [];
}

function addLocalStorage(id, name, image, totalIngredients, simpleList) {
  const meal = {
    id: id,
    name: name,
    image: image,
    totalIngredients: totalIngredients,
    simpleList: simpleList,
  };

  let list = getLocalStorage();
  list.push(meal);
  localStorage.setItem("meals", JSON.stringify(list));
}
