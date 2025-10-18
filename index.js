 const breedSelect = document.getElementById("breedSelect");
const dogImage = document.getElementById("dogImage");
const breedName = document.getElementById("breedName");
const temperament = document.getElementById("temperament");
const lifeSpan = document.getElementById("lifeSpan");
const dogInfo = document.getElementById("dogInfo");

// Fetch all dog breeds (endpoint 1)
fetch("https://api.thedogapi.com/v1/breeds")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch breed data. Please try again later.");
    }
    return response.json();
  })
  .then((breeds) => {
    console.log("Breeds:", breeds);

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error fetching breeds:", error);
  });

// Event listener for breed selection
breedSelect.addEventListener("change", () => {
  const breedId = breedSelect.value;
  if (!breedId) return;

  // Fetch image by breed (endpoint 2)
  fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch breed image. Please try again later.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Image data:", data);
      const breedData = data[0].breeds[0];
      dogInfo.style.display = "block";
      breedName.textContent = breedData.name;
      temperament.textContent = breedData.temperament || "N/A";
      lifeSpan.textContent = breedData.life_span || "N/A";
      dogImage.src = data[0].url;
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
    });
});