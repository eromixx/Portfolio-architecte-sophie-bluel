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
    divGallery.innerHTML = "";
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

// fonction catégorie du filtre
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
async function logoutButton() {
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
}


// création et placement de la fenetre modale
async function createModal() {
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

  // La fermeture de la modale
  window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
  });
}

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
// Gestion de la suppression
  trashBtn.addEventListener("click", (e) => {
    e.preventDefault
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
// Gestion du clic sur le bouton "Ajouter une photo"
document.addEventListener("click", (e) => {
if (e.target && e.target.id === "add-photo-btn") {
document.getElementById("modal").style.display = "none"; 
showAddPhotoModal();
}
});

// Fonction pour afficher la modale d'ajout de photo
function showAddPhotoModal() {
const modal = document.getElementById("add-photo-modal");
modal.style.display = "flex";
fillCategories();
resetAddPhotoForm();
}

// Fonction pour remplir les catégories
async function fillCategories() {
const select = document.getElementById("category");
select.innerHTML = '<option value="">Sélectionnez une catégorie</option>';

try {
const response = await fetch("http://localhost:5678/api/categories");
const categories = await response.json();

categories.forEach(category => {
  const option = document.createElement("option");
  option.value = category.id;
  option.textContent = category.name;
  select.appendChild(option);
});
} catch (error) {
console.error("Erreur lors du chargement des catégories:", error);
}
}

// Fonction pour réinitialiser le formulaire
function resetAddPhotoForm() {
document.getElementById("add-photo-form").reset();
document.getElementById("validate-btn").disabled = true;
document.getElementById("validate-btn").style.backgroundColor = "#A7A7A7";

const previewContainer = document.querySelector(".photo-upload");
const previewImg = document.querySelector(".preview-image");
const icon = document.querySelector(".photo-upload i");
const label = document.querySelector(".photo-upload label");
const text = document.querySelector(".photo-upload p");

if (previewImg) {
previewImg.style.display = "none";
}

icon.style.display = "block";
label.style.display = "block";
text.style.display = "block";
}

// Gestion des événements pour la modale d'ajout
function setupAddPhotoModalEvents() {
  // Bouton de retour à la galerie
  const backButton = document.querySelector(".back-to-gallery");
  if (backButton) {
    backButton.addEventListener("click", () => {
      document.getElementById("add-photo-modal").style.display = "none";
      document.getElementById("modal").style.display = "flex";
    });
  }

  // Fermeture de la modale d'ajout
  const closeAddPhoto = document.querySelector(".close-add-photo");
  if (closeAddPhoto) {
    closeAddPhoto.addEventListener("click", () => {
      document.getElementById("add-photo-modal").style.display = "none";
    });
  }

  // Prévisualisation de l'image
  const photoInput = document.getElementById("photo-input");
  if (photoInput) {
    photoInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          let previewImg = document.querySelector(".preview-image");
          if (!previewImg) {
            previewImg = document.createElement("img");
            previewImg.classList.add("preview-image");
            const uploadContainer = document.querySelector(".photo-upload");
            uploadContainer.insertBefore(previewImg, uploadContainer.firstChild);
          }
          
          previewImg.src = event.target.result;
          previewImg.style.display = "block";
          
          // Masquer les éléments par défaut
          document.querySelector(".photo-upload i").style.display = "none";
          document.querySelector(".photo-upload label").style.display = "none";
          document.querySelector(".photo-upload p").style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Validation du formulaire
  const addPhotoForm = document.getElementById("add-photo-form");
  if (addPhotoForm) {
    addPhotoForm.addEventListener("input", function() {
      const title = document.getElementById("title").value;
      const category = document.getElementById("category").value;
      const photo = document.getElementById("photo-input").files[0];
      const validateBtn = document.getElementById("validate-btn");
      
      if (title && category && photo) {
        validateBtn.disabled = false;
        validateBtn.style.backgroundColor = "#1D6154";
        validateBtn.classList.add("active");
      } else {
        validateBtn.disabled = true;
        validateBtn.style.backgroundColor = "#A7A7A7";
        validateBtn.classList.remove("active");
      }
    });

    // Ajout de projet
    addPhotoForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const title = document.getElementById("title").value;
      const category = document.getElementById("category").value;
      const photo = document.getElementById("photo-input").files[0];
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("image", photo);
      
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
        
        if (response.ok) {
          // Fermer la modale et rafraîchir les galeries
          document.getElementById("add-photo-modal").style.display = "none";
          resetAddPhotoForm();
          await fetchGalerieProject();
          await fetchWorksForModal();
        } else {
          console.error("Erreur lors de l'ajout du projet");
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    });
  }
}

// Appeler la fonction une seule fois au chargement
setupAddPhotoModalEvents();


// fonction suppression de projet (V2)
async function deleteWork(workId) {
try {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
          "Authorization": `Bearer ${token}`
      }
  });

  if (response.ok) {
      await fetchGalerieProject();
      await fetchWorksForModal();
  } else {
      console.error("Erreur lors de la suppression");
  }
} catch (error) {
  console.error("Erreur:", error);
}
}


// Fonction de la Bannière mode édition
function createEditModeBanner() {
// Création des éléments
const banner = document.createElement('div');
banner.id = 'edit-mode-banner';
banner.className = 'edit-banner';

const icon = document.createElement('i');
icon.className = 'fa-solid fa-pen-to-square';

const text = document.createElement('span');
text.textContent = 'Mode édition';

// Assemblage
banner.appendChild(icon);
banner.appendChild(text);

// Ajout au DOM
document.body.insertBefore(banner, document.body.firstChild);

return banner;
}

function showEditModeBanner() {
if (token) {
  // Crée ou récupère la bannière existante
  let banner = document.getElementById('edit-mode-banner');
  if (!banner) {
      banner = createEditModeBanner();
  }
  banner.style.display = 'block';
  document.body.classList.add('edit-mode');
}
}

// Appel initial
if (token) {
showEditModeBanner();
}
createModal();
fetchWorksForModal();
fetchGalerieProject();
showCategoriesButton();
logoutButton();