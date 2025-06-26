const divGallery = document.querySelector(".gallery");
const filters = document.querySelector(".filtres")
let allWorks = [];

function displayWork(work) {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    divGallery.appendChild(figure);
}


async function fetchGalerieProject() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();

        data.forEach(work => {
            displayWork(work)
        });

    } catch (error) {
        console.log("Il y a eu une erreur :", error);
    }
}

// Récupération des catégories
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

async function filterCategories() {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        const buttons = document.querySelectorAll(".filtres button")

        buttons.forEach((button) => {
            button.addEventListener("click", (btn) => {
                const buttonId = btn.target.id
                divGallery.innerHTML=""
                buttons.forEach((btn) => btn.classList.remove("category-selected"));
                btn.target.classList.add("category-selected")

                if(buttonId !== "0") {
                    const filteredWorks = data.filter((work) => work.categoryId == buttonId)
                    console.log(filteredWorks)
                    filteredWorks.forEach(work => {
                        displayWork(work)
                    })
                } else {
                    data.forEach(work => {
                        displayWork(work)
                    })
                }
            }) 

        })
}

async function showCategoriesButton() {
    const allCategories = await getCategories()
    
    const buttonAll = document.createElement("button")
    buttonAll.textContent = "Tous"
    buttonAll.id = "0"
    buttonAll.classList.add("category-select", "category-button")
    filters.appendChild(buttonAll)

    allCategories.forEach(category => {
       const button = document.createElement("button");

       button.textContent = category.name; 
       button.id = category.id;

       button.classList.add("category-button");
       filters.appendChild(button); 
    });
    filterCategories()
}
fetchGalerieProject();
showCategoriesButton();