const mealsContainer = document.querySelector(".meals-container");
const ingredientsSelection = document.querySelector(".ingredients-selection");
const popup = document.querySelector(".ingredient-popup");
const groceryContainer = document.querySelector(".grocery-container");
const allOut = document.querySelector(".clear-all");
const shoppingList = document.querySelector(".shopping-list");
const groceryList = document.querySelector(".grocery-list");
const groceryCloseBtn = document.querySelector(".grocery-close-btn");
const clearAllRecipes = document.querySelector(".clear-all-recipes");
const addAllRecipes = document.querySelector(".add-all-recipes");
const addMore = document.querySelector(".add-more");

let count = 0;

shoppingList.addEventListener("click", () => {
  groceryList.classList.add("show");
});
groceryCloseBtn.addEventListener("click", () => {
  groceryList.classList.remove("show");
});
addAllRecipes.addEventListener("click", addAllRecipesToList);

addMore.addEventListener("click", () => {
  addMoreIngredient();
});

//////////////// display saved recepies ////////////////

const displayLocalStorage = () => {
  const allMeals = getLocalStorage();

  mealsContainer.innerHTML = `${allMeals
    .map((meal) => {
      const { id, image, name, totalIngredients } = meal;
      return `<article class="single-meal" ">
    <div class="meal-img" >
  <img src="${image}">
  </div>
  <div class="meal-summary" data-id="${id}">
  <a class="meal-name" href="recipe.html?id=${id}"><h4">${name}</h4></a>
  <div><span>${totalIngredients} ingredients</span> <i class="fa-solid fa-circle-info ingredients-detail" data-id="${id}"></i></div>
  <div><button class="make-it" data-id="${id}"><i class="fa-solid fa-circle-plus "></i></button> <span>Add all ingredients to shopping list</span></div>
  <div><button class="remove"><i class="fa-solid fa-trash remove"></i></button> <span>Remove recipe</span></div>
  
  
  </div>
    </article>`;
    })
    .join("")}`;

  mealsContainer.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("ingredients-detail")) {
      e.stopPropagation();
      var dish = allMeals.find((dish) => dish.id === e.target.dataset.id);
      const top = e.target.offsetTop;
      const left = e.target.getBoundingClientRect().left + 20;
      popup.style.display = "block";
      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;

      const { simpleList } = dish;
      ingredientsSelection.innerHTML = simpleList
        .map((item) => {
          return `<li><button class="add-to-list"><i class="fa-solid fa-circle-plus"></i></button>${item}</li>`;
        })
        .join("");
    } else {
      popup.style.display = "none";
    }
  });
  mealsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("ingredients-detail")) {
      e.stopPropagation();
      var dish = allMeals.find((dish) => dish.id === e.target.dataset.id);
      const top = e.target.offsetTop;
      const left = e.target.getBoundingClientRect().left + 20;
      popup.style.display = "block";
      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;

      const { simpleList } = dish;
      ingredientsSelection.innerHTML = simpleList
        .map((item) => {
          return `<li><button class="add-to-list"><i class="fa-solid fa-circle-plus"></i></button>${item}</li>`;
        })
        .join("");
    } else {
      popup.style.display = "none";
    }
  });

  mealsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      const itemToDelete =
        e.target.parentElement.parentElement.parentElement.parentElement;
      mealsContainer.removeChild(itemToDelete);
      const id = e.target.parentElement.parentElement.parentElement.dataset.id;
      deteleteFromLocalStorage(id);
    } else if (e.target.classList.contains("make-it")) {
      var dish = allMeals.find((dish) => dish.id === e.target.dataset.id);
      const { simpleList } = dish;
      simpleList.forEach((item) => {
        addToGroceryList(item);
        if (groceryContainer.children.length > 0) {
          allOut.style.display = "block";
        }
      });
    }
  });

  ingredientsSelection.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-circle-plus")) {
      const item = e.target.parentElement.parentElement.textContent;
      addToGroceryList(item);
      displayClearAll();
      clearAll();
    }
  });
  clearAllRecipes.addEventListener("click", () => {
    const children = [...mealsContainer.children];
    children.forEach((child) => {
      mealsContainer.removeChild(child);
    });
    deleteAllFromLocalStorage();
  });
};

displayLocalStorage();

function addAllRecipesToList() {
  let items = getLocalStorage().map((item) => item.simpleList);
  items.forEach((item) => {
    item.forEach((ingredient) => addToGroceryList(ingredient));
  });
}

///////////////display grocery list ///////

const displayLocalGroceries = () => {
  const items = getLocalGrocery();
  items.forEach((item) => {
    const article = document.createElement("article");
    article.classList.add("grocery-item");
    const attribute = document.createAttribute("data-id");
    attribute.value = item.id;
    article.setAttributeNode(attribute);
    article.innerHTML = `<div class="single-grocery-item"> 
        <div>
        <button class="done"></button>
        <span>${item.item}</span>
        </div>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
         </div>`;
    groceryContainer.appendChild(article);
    const doneBtn = article.querySelector(".done");
    const deleteBtn = article.querySelector(".delete");
    doneBtn.addEventListener("click", (e) => {
      e.currentTarget.style.backgroundColor = "rgb(107, 54, 54)";
      deleteFromLocalGrocery(
        e.currentTarget.parentElement.parentElement.parentElement.dataset.id
      );
    });

    deleteBtn.addEventListener("click", (e) => {
      groceryContainer.removeChild(e.currentTarget.parentElement.parentElement);
      deleteFromLocalGrocery(
        e.currentTarget.parentElement.parentElement.dataset.id
      );
      displayClearAll();
    });
  });
  displayClearAll();
  clearAll();
};

displayLocalGroceries();

//////////////////////// functions for recipes ////////////////////////////////

function getLocalStorage() {
  return localStorage.getItem("meals")
    ? JSON.parse(localStorage.getItem("meals"))
    : [];
}

function deteleteFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("meals", JSON.stringify(items));
}

function deleteAllFromLocalStorage() {
  const items = [];
  localStorage.setItem("meals", JSON.stringify(items));
}

/////////////////////////// functions for grocery list //////////////
function displayClearAll() {
  if (groceryContainer.children.length == 0) {
    allOut.style.display = "none";
    return;
  }
  allOut.style.display = "block";
}

function clearAll() {
  allOut.addEventListener("click", () => {
    const children = [...groceryContainer.children];
    children.forEach((child) => {
      groceryContainer.removeChild(child);
    });
    allOut.style.display = "none";
    deleteAllFromLocalGrocery();
  });
}

function addToGroceryList(item) {
  count++;
  const article = document.createElement("article");
  article.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  const id = (new Date().getTime() + count).toString();
  attribute.value = id;
  article.setAttributeNode(attribute);
  article.innerHTML = `<div class="single-grocery-item"> 
        <div>
        <button class="done"></button>
        <span>${item}</span>
        </div>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
         </div>`;
  groceryContainer.appendChild(article);

  addToLocalGrocery(item, id);
  const doneBtn = article.querySelector(".done");
  const deleteBtn = article.querySelector(".delete");
  doneBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.currentTarget.style.backgroundColor = "rgb(107, 54, 54)";
    deleteFromLocalGrocery(
      e.currentTarget.parentElement.parentElement.parentElement.dataset.id
    );
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    groceryContainer.removeChild(e.currentTarget.parentElement.parentElement);
    deleteFromLocalGrocery(
      e.currentTarget.parentElement.parentElement.dataset.id
    );
    displayClearAll();
  });
}

function addMoreIngredient() {
  const article = document.createElement("article");
  article.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  const id = new Date().getTime().toString();
  attribute.value = id;
  article.setAttributeNode(attribute);
  article.innerHTML = `<div class="single-grocery-item"> 
        <div>
        <button class="done"></button>
        
        <input class="more-input" type="text"> 
        
        </div>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
         </div>`;
  groceryContainer.appendChild(article);
  const input = article.querySelector("input");
  input.addEventListener("change", () => {
    addToLocalGrocery(input.value, id);
  });

  const doneBtn = article.querySelector(".done");
  const deleteBtn = article.querySelector(".delete");
  doneBtn.addEventListener("click", (e) => {
    e.currentTarget.style.backgroundColor = "rgb(107, 54, 54)";
    deleteFromLocalGrocery(
      e.currentTarget.parentElement.parentElement.parentElement.dataset.id
    );
  });

  deleteBtn.addEventListener("click", (e) => {
    groceryContainer.removeChild(e.currentTarget.parentElement.parentElement);
    deleteFromLocalGrocery(
      e.currentTarget.parentElement.parentElement.dataset.id
    );
    displayClearAll();
  });
  displayClearAll();
}

function getLocalGrocery() {
  return localStorage.getItem("groceries")
    ? JSON.parse(localStorage.getItem("groceries"))
    : [];
}

function addToLocalGrocery(item, id) {
  const items = getLocalGrocery();
  const shopItem = { item: item, id: id };
  items.push(shopItem);
  localStorage.setItem("groceries", JSON.stringify(items));
}

function deleteFromLocalGrocery(id) {
  let items = getLocalGrocery();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("groceries", JSON.stringify(items));
}

function deleteAllFromLocalGrocery() {
  let items = getLocalGrocery();
  items = [];
  localStorage.setItem("groceries", JSON.stringify(items));
}
