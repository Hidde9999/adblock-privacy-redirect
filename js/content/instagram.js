let currentUrl;
const blockListByAlt = [
    "Photo by Omroep Gelderland",
    "Photo by Omroep Brabant",
    "Photo by De Gelderlander",
    "Photo by De Twentsche Courant Tubantia",
    "Photo by AD.nl",
    "#nieuwsuur",
    "#rtvnoord"
];
const blockList = [
    "omroepgelderland",
    "omroepbrabant",
    "omroep_west",
    "rtlnieuws",
    "degelderlander",
    "ad_nl",
    "nu.nl",
    "ad_rotterdam",
    "nieuwsuur",
    "rtvnoord",
    "nosjeugdjournaal",
    "nos",
    "nosstories",
    "kro.ncrv",
    "vrtnws",

    "cnbc",
    "todayshow",
    "wnfnederland",
    "dilanyesilgoz_"
];
const exemptionList = ["fake"];
const blockedContentsHtml = `
        <div class="blocked-container" id="blocked-contents">
            <h1>This page is blocked</h1>
            <p>The content you're trying to access is not available due to propaganda.</p>
        </div>`;

// Function to block content by alt text
function blockByAltText() {
    currentUrl = window.location.href;
    if (currentUrl.includes("/explore/")){
        const photoElements = document.querySelectorAll(".x9f619.xjbqb8w.x1lliihq .x1qjc9v5");

        photoElements.forEach(el => {
            const postBy = el.querySelector("img");

            if (postBy){
                const altText = postBy.alt.toLowerCase();
                for (const item of blockListByAlt) {
                    if (altText.includes(item.toLowerCase())) {
                        el.innerHTML = blockedContentsHtml;
                        console.log("Blocked: " + altText);
                        break; // No need to continue checking once blocked
                    }
                }
            }
        });
    }
}

// Function to block content by channel name
function blockByChannelName() {
    currentUrl = window.location.href;
    const channelElement = document.querySelector(".xt0psk2 a span") || document.querySelector(".xt0psk2 span a");

    if (currentUrl.includes("/p/")){
        const postElement = document.querySelector(".x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.xg6iff7") || document.querySelector(".x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k");

        if (channelElement) {
            const channelName = channelElement.textContent.toLowerCase();
            // if (blockList.some(item => channelName.includes(item))) {
            //     if (exemptionList.some(item => channelName.includes(item))){
            //         console.log("Exempted");
            //         return;
            //     }
            //     postElement.innerHTML = blockedContentsHtml;
            //     document.title = "Propaganda";
            //     console.log("Blocked: " + channelName);
            // }
            if (postElement) {
                if (exemptionList.some(item => channelName.includes(item))){
                    console.log("Exempted");
                    return;
                }
                postElement.remove();
                console.log("Blocked: " + channelName);
            }
        }
    }

    if (currentUrl === "https://www.instagram.com/"){
        const postElement = document.querySelector(".x9f619 article");
        if (postElement){
            const channelName = channelElement.textContent.toLowerCase();
            if (blockList.some(item => channelName.includes(item))) {
                if (exemptionList.some(item => channelName.includes(item))){
                    console.log("Exempted");
                    return;
                }
                postElement.remove();
                console.log("Blocked: " + channelName);
            }
        }
    }
}

// Function to handle page load
function handlePageLoad() {
    setTimeout(() => {
        blockByAltText();
        blockByChannelName();
    }, 1000);
}

// Event listeners
window.addEventListener('scroll', () => {
    blockByAltText();
    blockByChannelName();
});

window.navigation.addEventListener("navigate", () => {
    setTimeout(() => {
        blockByAltText();
        blockByChannelName();
    }, 100);
});

// Check document ready state
if (document.readyState !== "loading") {
    handlePageLoad();
} else {
    document.addEventListener("DOMContentLoaded", handlePageLoad);
}
