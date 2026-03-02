const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderGrid = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

//clear prev results

function clearResults() {
    countryInfo.textContent = "";
    borderGrid.textContent = "";
    errorMessage.textContent = "";

}

function showError(message){
    errorMessage.textContent = message;

}

//display country information

function displayCountry(country) {
    const name = document.createElement("h2");
    name.textContent = country.name.common;

    const capital = document.createElement("p");
    capital.textContent = "Capital: " + 
        (country.capital ? country.capital[0] : "N/A");

    const population = document.createElement("p");
    population.textContent = "Population: " + 
        country.population.toLocaleString();

    const region = document.createElement("p");
    region.textContent = "Region: " + country.region;

    const flag = document.createElement("img");
    flag.src = country.flags.svg;
    flag.alt = country.name.common + " flag";
    flag.width = 120;

    countryInfo.append(name);
    countryInfo.append(capital);
    countryInfo.append(population);
    countryInfo.append(region);
    countryInfo.append(flag);
}

//bordering country information

function displayBorderCountry(neighbor) {
    const card = document.createElement("div");

    const name = document.createElement("p");
    name.textContent = neighbor.name.common;

    const flag = document.createElement("img");
    flag.src = neighbor.flags.svg;
    flag.alt = neighbor.name.common + " flag";
    flag.width = 50;

    card.append(name);
    card.append(flag);

    borderGrid.append(card);
}

async function searchCountry(countryName) {
    if (!countryName) {
        showError("Please enter a country name.");
        return;
    }

    clearResults();
    spinner.classList.remove("hidden");

    try {
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        displayCountry(country);

        // Bordering countries
        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(
                    `https://restcountries.com/v3.1/alpha/${code}`
                );

                const borderData = await borderResponse.json();
                displayBorderCountry(borderData[0]);
            }
        } else {
            const noBorders = document.createElement("p");
            noBorders.textContent = "No bordering countries.";
            borderGrid.appendChild(noBorders);
        }

    } catch (error) {
        showError("Country not found. Please try again.");
    } finally {
        spinner.classList.add("hidden");
    }
}

// Button click
searchBtn.addEventListener("click", () => {
    searchCountry(countryInput.value.trim());
});

// Press Enter
countryInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchCountry(countryInput.value.trim());
    }
});