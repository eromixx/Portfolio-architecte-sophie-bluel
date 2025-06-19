const divGallery = document.getElementById("gallery");

async function fetchGalerieProject() {;
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        data.forEach(work => {
            const div = document.createElement("div");

            const img = document.createElement("img");
            img.src = work.imageUrl
        })
        console.log(data);
    } catch (error) {
        console.log("il y'a eu une erreur", error)
    }
}
fetchGalerieProject();