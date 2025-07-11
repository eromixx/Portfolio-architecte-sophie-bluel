const form = document.getElementById("login-form");

async function login(){
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // empêche l'envoi classique

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formdata = new FormData(form)
    const payload = new URLSearchParams(formdata)

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: payload,
        
      });

      const data = await response.json();

      if (response.ok) {
        // Stockage du token (en localStorage)
        localStorage.setItem("authToken", data.token)

        // Redirection vers la page d'accueil
        window.location.href = "./index.html";
      } else {
        document.getElementById("login-error").style.display = "block";
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      document.getElementById("login-error").style.display = "block";
    }
  });
}

login() 