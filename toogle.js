// script.js
document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the value of youtubeRedirect from localStorage
    const youtubeRedirect = localStorage.getItem("youtubeRedirect");

    // If youtubeRedirect is set and true, set the switch to ON
    if (youtubeRedirect === "true") {
        document.getElementById("toggleSwitch").checked = true;
    }

    // Function to handle switch change
    function handleToggle() {
        const isChecked = this.checked;
        localStorage.setItem("youtubeRedirect", isChecked ? "true" : "false");
        if (isChecked) {
            console.log("Switch is ON");
            // Perform actions when switch is ON
        } else {
            console.log("Switch is OFF");
            // Perform actions when switch is OFF
        }
    }

    // Add event listener to the switch
    document.getElementById("toggleSwitch").addEventListener("change", handleToggle);
});

