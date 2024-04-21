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
    // "Photo by De Twentsche Courant Tubantia",
    "ad_nl",
    "nu.nl",
    "ad_rotterdam",
    "nieuwsuur",
    "rtvnoord",
    "nosjeugdjournaal",
    "nos",
    "nosstories",

    "cnbc",
    "todayshow",

    "wnfnederland",

    "dilanyesilgoz_"
];
const exemptionList = [
  "fake"
];
const blockedContentsHtml = `
        <div class="blocked-container" id="blocked-contents">
            <h1>This page is blocked</h1>
            <p>The content you're trying to access is not available due to propaganda.</p>
        </div>`;

function blockByName() {
    currentUrl = window.location.href;
    const channelElement = document.querySelector(".xt0psk2 a span") || document.querySelector(".xt0psk2 span a");

    if (currentUrl.includes("/explore/")){
        const photoElements = document.querySelectorAll(".x9f619.xjbqb8w.x1lliihq .x1qjc9v5");

        photoElements.forEach(el => {
            const postBy = el.querySelector("img");

            if (postBy){
                const altText = postBy.alt.toLowerCase();
                for (const item of blockListByAlt) {
                    if (altText.includes(item.toLowerCase())) {
                        el.innerHTML;
                        console.log("Removed " + el);
                        break; // No need to continue checking once blocked
                    }
                }
            }
        });
    }

    if (currentUrl.includes("/p/")){
        const postElement = document.querySelector(".x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.xg6iff7") || document.querySelector(".x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k");

        if (channelElement) {
            const channelName = channelElement.textContent.toLowerCase();
            if (blockList.some(item => channelName.includes(item))) {
                if (exemptionList.some(item => channelName.includes(item))){
                    console.log("exempted");
                    return
                }
                postElement.innerHTML = blockedContentsHtml;
                document.title = "Propaganda"
                console.log("Removed " + channelName);
            }
        }
    }

    if (currentUrl === "https://www.instagram.com/"){
        const postElement = document.querySelector(".x9f619 article");
        if (postElement){
            const channelName = channelElement.textContent.toLowerCase();
            if (blockList.some(item => channelName.includes(item))) {
                if (exemptionList.some(item => channelName.includes(item))){
                    console.log("exempted");
                    return
                }
                postElement.remove();
                console.log("Removed " + channelName);
            }
        }
    }

    if (blockList.some(item => currentUrl.includes(item))) {
        const postElement = document.querySelector(".x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.xg6iff7");
        console.log("hier "+ postElement)
        if (postElement) {
            if (exemptionList.some(item => currentUrl.includes(item))){
                console.log("exempted");
                return
            }
            postElement.innerHTML = blockedContentsHtml;
            document.title = "Propaganda";
            console.log("Removed");
        }
    }
}

function handlePageLoad() {
    setTimeout(blockByName, 1000);
}

window.addEventListener('scroll', blockByName);

window.navigation.addEventListener("navigate", () => {
    setTimeout(() => {
            propagandaBlocker(false);
    }, 100);
});

if (document.readyState !== "loading") {
    handlePageLoad();
} else {
    document.addEventListener("DOMContentLoaded", handlePageLoad);
}
