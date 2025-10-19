const messages = document.getElementById("messages");
const statusMessage = document.getElementById("statusMessage");

const dogInfo = document.getElementById("dogInfo");
dogInfo.style.display = 'none';

const breedSelect = document.getElementById("breedSelect");
const breedImage = document.getElementById("breedImage");
const breedName = document.getElementById("breedName");
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
                    'Content-Type': 'application/json',
                    // Security issue: api_key should never be explicitly specified in the JS
                    'x-api-key': 'live_3yD3l07OjspCw2bDQ935IuFjfs4AjEMizrGba20ozApAn67UWeekEIZWtIHzg0xc'
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
    // ToDo: breedsData contains all breed details,
    //       so the breedsData results should be cached and reused in "addEventListener" below,
    //       instead of making multiple "per breed id" fetches
    //       for performance and availability improvements
    breedsData.forEach(breed => {
        const option = document.createElement("option");
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });

    breedSelect.addEventListener("change", async function() {
        const breedId = this.value;
        if (breedId == -1 || breedId == NaN) { // breed IS NOT selected OR breedId IS NaN
            // hide breed data
            dogInfo.style.display = 'none';
        } else {                               // breed IS selected
            // get breed details
            const breedDetailsData = await fetchData(`https://api.thedogapi.com/v1/breeds/${breedId}`);
            breedName.innerText = breedDetailsData.name;
            breedGroup.innerText = breedDetailsData.breed_group;
            breedFor.innerText = breedDetailsData.bred_for;
            breedTemperament.innerText = breedDetailsData.temperament;
            breedLifeSpan.innerText = breedDetailsData.life_span;
            breedWeight.innerText = `metric: ${breedDetailsData.weight.metric} (imperial: ${breedDetailsData.weight.imperial})`;
            breedHeight.innerText = `metric: ${breedDetailsData.height.metric} (imperial: ${breedDetailsData.height.imperial})`;
            
            // get breed image
            // Per Dogs API design:
            //      image url can be constructed from "reference_image_id",
            //      instead of making Dogs API Image fetch HTTP request.
            //      e.g. `https://cdn2.thedogapi.com/images/@{reference_image_id}.jpg`
            const breedImageData = await fetchData(`https://api.thedogapi.com/v1/images/${breedDetailsData.reference_image_id}`);
            breedImage.src = breedImageData.url;
            
            // display breed data
            dogInfo.style.display = '';
        }
    });
}

fetchBreeds();
