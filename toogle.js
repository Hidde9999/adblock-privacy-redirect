document.addEventListener("DOMContentLoaded", function () {
    getFilterList()
    // Set YouTube switch
    setSwitchFromLocalStorage("toggleSwitchYT", "youtubeRedirect")
    // Set Twitter switch
    setSwitchFromLocalStorage("toggleSwitchTwitter", "twitterRedirect")
    // Set YouTube switch
    setSwitchFromLocalStorage("toggleSwitchGoogle", "googleRedirect")
    // Set Twitter switch
    setSwitchFromLocalStorage("toggleSwitchGoogleFonts", "fontsRedirect")
    // Set YouTube switch
    setSwitchFromLocalStorage("toggleSwitchGmail", "gmailRedirect")

    // Add event listener to the switch
    document.getElementById("toggleSwitchYT").addEventListener("change", handleToggle("youtubeRedirect"))
    // Add event listener to the switch
    document.getElementById("toggleSwitchTwitter").addEventListener("change", handleToggle("twitterRedirect"))
    // Add event listener to the switch
    document.getElementById("toggleSwitchGoogle").addEventListener("change", handleToggle("googleRedirect"))
    // Add event listener to the switch
    document.getElementById("toggleSwitchGoogleFonts").addEventListener("change", handleToggle("fontsRedirect"))
    // Add event listener to the switch
    document.getElementById("toggleSwitchGmail").addEventListener("change", handleToggle("gmailRedirect"))
});

// Function to set switch based on localStorage value
function setSwitchFromLocalStorage(switchId, localStorageKey) {
    let switchElement = document.getElementById(switchId)
    const switchValue = localStorage.getItem(localStorageKey)
    if (switchValue === "true") {
        if (!switchElement){
            setTimeout(function(){
                switchElement = document.getElementById(switchId)
                switchElement.checked = true
            }, 100);
        } else {
            switchElement.checked = true
        }
    }
}

// Function to handle switch change
function handleToggle(name) {
    return function () {
        const isChecked = this.checked
        localStorage.setItem(name, isChecked ? "true" : "false")
        if (isChecked) {
            console.log(name + " Switch is ON")
            // Perform actions when switch is ON
        } else {
            console.log(name + " Switch is OFF")
            // Perform actions when switch is OFF
        }
    }
}

function getFilterList() {
    // Get the div element
    const filtersDiv = document.getElementById('filters')
    // Create a list element
    const list = document.createElement('div')

    // Parse stored filter names from localStorage
    const blockFiltersNames = JSON.parse(localStorage.getItem("filterNames"))

    // Check if blockFiltersNames is not null and is an array
    if (Array.isArray(blockFiltersNames)) {
        blockFiltersNames.forEach(key => {
            const labelFilterName = document.createElement('label')
            labelFilterName.textContent = key
            const labelFilterGroup = document.createElement('label')
            labelFilterGroup.className = "switch"
            const inputToggle = document.createElement('input')
            inputToggle.type = "checkbox" // Set the input type to checkbox
            inputToggle.id = `toggleSwitch${key}`
            const spanSlider = document.createElement('span')
            spanSlider.className = "slider"
            list.appendChild(labelFilterName)
            labelFilterGroup.appendChild(inputToggle)
            labelFilterGroup.appendChild(spanSlider)
            list.appendChild(labelFilterGroup)

            // Add event listener to the switch
            inputToggle.addEventListener("change", handleToggle(`${key}Filter`))
            inputToggle.addEventListener("change", setSwitchFromLocalStorage(`toggleSwitch${key}`, `${key}Filter`))

        })
    } else {
        console.error("Filter names not found or not in expected format.")
    }

    // Append the list to the div
    filtersDiv.appendChild(list)
}