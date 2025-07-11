//variables 
const divGallery = document.querySelector(".gallery");
const filters = document.querySelector(".filtres")
const token = localStorage.getItem("authToken");
let allWorks = [];


// Création des éléments dans le HTML (les projets)
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

// récuperation des projet de l'API
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
// filtre
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
// function catégorie du filtre
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

//logout bouton

  const navItems = document.querySelectorAll("nav ul li");
  const loginItem = Array.from(navItems).find(li => li.textContent.toLowerCase() === "login");
  if (token && loginItem) {
    loginItem.textContent = "logout";
    loginItem.style.cursor = "pointer";

    loginItem.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      window.location.href = "index.html";
    });
  } else if (!token && loginItem) {
    loginItem.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

// création et placement de la fenetre modale

if (token) {
    const portfolioSection = document.getElementById("portfolio");
    const portfolioHeader = document.querySelector(".portfolio-header");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifier les projets";
    editBtn.classList.add("edit-button");
    editBtn.id = "open-modal";
    const h2 = portfolioSection.querySelector("h2");
    h2.insertAdjacentElement("afterend", editBtn);
    editBtn.addEventListener("click", () => {
        document.getElementById("modal").style.display = "flex";
    });
    portfolioHeader.appendChild(editBtn);

    editBtn.addEventListener("click", () => {
        document.getElementById("modal").style.display = "flex";
    });
}




  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close-modal");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Fermer si on clique hors de la modale
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

//affichage des projets dans la modale
async function fetchWorksForModal() {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    data.forEach((work) => {
      const figure = document.createElement("figure");
      figure.classList.add("modal-figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const trashBtn = document.createElement("button");
      trashBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      trashBtn.classList.add("trash-btn");
//suppression du travail
      trashBtn.addEventListener("click", () => {
        deleteWork(work.id);
      });

      figure.appendChild(img);
      figure.appendChild(trashBtn);
      modalGallery.appendChild(figure);
    });
  } catch (err) {
    console.error("Erreur lors du chargement de la galerie dans la modale :", err);
  }
}
// Ajout du bouton "ajouter des photos" de la modale
document.addEventListener("", () => {
  const addPhotoBtn = document.getElementById("add-photo-btn");

  if (addPhotoBtn) {
    addPhotoBtn.addEventListener("click", () => {
      // Affiche un formulaire d'ajout (à créer)
      console.log("Clique sur 'Ajouter une photo'");
      // Tu peux ici appeler une fonction showAddPhotoForm() si tu crées une autre vue dans la modale
    });
  }
});

// copie de la premiere modale a modifier pour avoir l'onglet d'ajout de photos
  if (token) {
    const portfolioSection = document.getElementById("portfolio");

  const portfolioHeader = document.querySelector(".portfolio-header");

if (token && portfolioHeader) {
  const editBtn = document.createElement("button");
  editBtn.textContent = "Modifier les projets";
  editBtn.classList.add("edit-button");
  editBtn.id = "open-modal";

  portfolioHeader.appendChild(editBtn);

  editBtn.addEventListener("click", () => {
    document.getElementById("modal").style.display = "flex";
  });
}}


fetchWorksForModal();
fetchGalerieProject();
showCategoriesButton();