const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderGrid = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {
    if (!countryName) {
        errorMessage.textContent = "Please enter a country name.";
        return;
    }

    try {
        
        countryInfo.innerHTML = "";
        borderGrid.innerHTML = "";
        errorMessage.textContent = "";

        
        spinner.classList.remove("hidden");

        // Fetch country data
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );

        if (!response.ok) {
            throw new Error("This Country is not found!");
        }

        const data = await response.json();
        const country = data[0];

        
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="120">
        `;

        // Fetch bordering countries
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResponse = await fetch(
                    `https://restcountries.com/v3.1/alpha/${code}`
                );

                const borderData = await borderResponse.json();
                const neighbor = borderData[0];

                borderGrid.innerHTML += `
                    <div>
                        <p>${neighbor.name.common}</p>
                        <img src="${neighbor.flags.svg}" 
                             alt="${neighbor.name.common} flag" 
                             width="50">
                    </div>
                `;
            }
        } else {
            borderGrid.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent =
            "Country not found. Please check the spelling and try again.";
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