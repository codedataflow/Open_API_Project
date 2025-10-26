const messages = document.getElementById("messages");
const statusMessage = document.getElementById("statusMessage");

const breedInfo = document.getElementById("breedInfo");
breedInfo.style.display = 'none';

const breedInfoDetailed = document.getElementById("breedInfoDetailed");
breedInfoDetailed.style.display = 'none';

const breedSelect = document.getElementById("breedSelect");
const breedImage = document.getElementById("breedImage");
const breedName = document.getElementById("breedName");
const breedNameDetailed = document.getElementById("breedNameDetailed");
const breedGroup = document.getElementById("breedGroup");
const breedTemperament = document.getElementById("breedTemperament");
const breedLifeSpan = document.getElementById("breedLifeSpan");
const breedWeight = document.getElementById("breedWeight");
const breedHeight = document.getElementById("breedHeight");
const breedFor = document.getElementById("breedFor");

async function fetchData(url) {
    messages.style.display = 'none';
    const response = await fetch(
            url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

    if (!response.ok) {
        const exceptionMessage = `Failed to fetch data from DogAPI.\nPlease try again later ...\n\nUrl: ${url}.\nResponse status ${response.status}.`;
        messages.innerText = exceptionMessage;
        messages.style.display = '';
        throw new Error(exceptionMessage);
    }

    return response.json()
}

async function fetchBreeds() {
    // get all breeds
    const breedsData = await fetchData('https://api.thedogapi.com/v1/breeds');
    breedsData.forEach(breed => {
        const option = document.createElement("option");
        option.value = breed.id;
        option.textContent = breed.name;
        option.image_id = breed.reference_image_id;
        breedSelect.appendChild(option);
    });

    breedSelect.addEventListener("change", async function() {
        const breedId = this.value;
        breedInfoDetailed.style.display = 'none';
        if (breedId == -1 || breedId == NaN) { // breed IS NOT selected OR breedId IS NaN
            breedInfo.style.display = 'none';
        } else {                               // breed IS selected
            // get breed basic information
            breedName.innerText = this[breedId].textContent;
            const breedImageData = await fetchData(`https://api.thedogapi.com/v1/images/${this[breedId].image_id}`);
            breedImage.src = breedImageData.url;

            // display breed data
            breedInfo.style.display = '';
        }
    });
}

async function getBreedDetails() {
    const breedId = breedSelect.options[breedSelect.selectedIndex].value;
    const breedDetailsData = await fetchData(`https://api.thedogapi.com/v1/breeds/${breedId}`);
    breedNameDetailed.innerText = breedDetailsData.name;
    breedGroup.innerText = breedDetailsData.breed_group;
    breedFor.innerText = breedDetailsData.bred_for;
    breedTemperament.innerText = breedDetailsData.temperament;
    breedLifeSpan.innerText = breedDetailsData.life_span;
    breedWeight.innerText = `metric: ${breedDetailsData.weight.metric} (imperial: ${breedDetailsData.weight.imperial})`;
    breedHeight.innerText = `metric: ${breedDetailsData.height.metric} (imperial: ${breedDetailsData.height.imperial})`;

    breedInfoDetailed.style.display = '';
}

fetchBreeds();
