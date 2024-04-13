let activeBlocker;
let blockedContentsCreated = false
let currentUrl
const blockedContentsHtml = `
        <div class="blocked-container" id="blocked-contents">
            <h1>This page is blocked</h1>
            <p>The content you're trying to access is not available due to propaganda.</p>
        </div>`;

const blockedChannels = [
    // NOS
    "NOS",
    "NOS Sport",
    "NOS op 3",
    "NOS Jeugdjournaal",
    "Jeugdjournaal",
    "NOS Stories",
    "NOS Nieuws van de Week",
    "Nieuwsuur",
    "Rijkswaterstaat",
    "Het Klokhuis",

    "De Telegraaf",
    "RTL Nieuws",
    "de Volkskrant",
    "BNR",
    "WNL",
    "GeenStijl",
    "NPO Start",
    "NPO Radio 1",

    "Omroep PowNed",
    "Omroep Gelderland",

    "De Avondshow met Arjen Lubach | VPRO",
    "RTL Talkshow",

    "Vandaag Inside",

    "VRT NWS",
    "VRT 1",
    "VTM",

    "The Telegraph",

    "Eurovision Song Contest",

    "ABC News",
    "BBC News",
    "CBS News",
    "CBS Mornings",
    "Daily Mail",
    "MSNBC",
    "CNBC",
    "Fox News",
    "FOX Weather",
    "CNN",
    "9 News Australia",
    "Channel 4 News",
    "Guardian News",
    "Bloomberg Television",
    "U.S. Defense News",
    "US Army News",
    "The Sun",
    "TVP World",
    "Reuters",
    "Global News",

    "DW Documentary",
    "DW News",

    "ZDF heute-show",
    "BILD",

    "FRANCE 24",
];

const videoTitles = [
    "Overtreders",
    "Handhavers",
    "europapa",
    "Joost Klein",
];

function isBlockedChannel(channelName) {
    return blockedChannels.some(keyword => channelName.toLowerCase().includes(keyword.toLowerCase()));
}

function isBlockedTitle(title) {
    return videoTitles.some(blockedTitle => title.toLowerCase().includes(blockedTitle.toLowerCase()));
}

function removeBlockedVideos() {
    const ytElements = "#dismissible, #content-section, .style-scope.yt-horizontal-list-renderer, .style-scope.ytd-rich-grid-row, .style-scope.ytd-item-section-renderer";
    const invidiousElements = "#contents .pure-u-1:not(.navbar)";
    let videoElements
    const currentUrl = window.location.href.toLowerCase()
    if (currentUrl.includes("youtube.com")){
        videoElements = document.querySelectorAll(ytElements);
    } else {
        videoElements = document.querySelectorAll(invidiousElements);
    }

    videoElements.forEach(video => {
        const channelLink = video.querySelector('#text a') || video.querySelector('#container #text') || video.querySelector(".pure-u-14-24 a");
        const videoTitle = video.querySelector('#video-title') || video.querySelector(".video-card-row p");

        // console.log(channelLink);

        if (channelLink && isBlockedChannel(channelLink.textContent.trim())) {
            console.log("Removing video from blocked channel:", channelLink.textContent.trim());
            video.remove();
        } else if (videoTitle && isBlockedTitle(videoTitle.textContent.trim())) {
            console.log("Removing video with blocked title:", videoTitle.textContent.trim());
            video.remove();
        }
    });
}

function handlePageLoad() {
    disableJSByName();
    propagandaBlocker(true);
}

// Define a function to run when the element is loaded
function onElementLoad() {
    // Your code here
    const videoFrom = document.querySelector("#text-container a") || document.querySelector("#channel-name");
    // Your JavaScript code to execute when the video is loaded
    if (videoFrom && blockedChannels.includes(videoFrom.textContent.trim())) {
        blockedContentsCreated = true
        if (currentUrl.includes("youtube.com")) {
            document.getElementById("page-manager").innerHTML = blockedContentsHtml;
        } else {
            const playerContainer = document.getElementById("player-container");
            playerContainer.innerHTML = blockedContentsHtml;
            document.querySelectorAll("h1")[1].remove();
            const contents = document.querySelector("#contents .pure-g:not(.navbar)");
            contents.remove();
        }
    }
    // Do something with videoFrom
    console.log(videoFrom);
}

function propagandaBlocker(timer) {
    if (blockedContentsCreated){
        return
    }
    currentUrl = window.location.href.toLowerCase().replace('@', '').replace("+", " ");

    if (currentUrl.includes("/watch?")) {
// Set up a timer to periodically check for the element
        const intervalId = setInterval(function() {
            // Select the element
            const elementToLoad = document.querySelector("#text-container a") || document.querySelector("#channel-name");

            // Check if the element exists
            if (elementToLoad) {
                // Clear the interval timer
                clearInterval(intervalId);

                // Run the function when the element is found
                onElementLoad();
            } else {
                // console.log("Element not found");
            }
        }, 1000); // Check every second
    }

    if (isBlockedChannel(currentUrl)) {
        if (currentUrl.includes("youtube.com")){
            document.getElementById("page-manager").innerHTML = blockedContentsHtml;
        } else {
            const contents = document.querySelector("#contents .pure-g:not(.navbar)");
            if (contents) {
                contents.innerHTML = blockedContentsHtml;
            } else {
                console.error("Element matching '#contents .pure-g:not(.navbar)' not found.");
            }
        }
    } else if (
        currentUrl.includes("/search?") ||
        currentUrl.includes("/results") ||
        currentUrl.includes("/channel") ||
        currentUrl.includes("/videos") ||
        currentUrl.includes("/watch?") ||
        currentUrl.includes('/feed/popular') ||
        currentUrl === "https://www.youtube.com/"
    ) {
        const blockedContents = document.getElementById("blocked-contents");
        if (blockedContents && !blockedContentsCreated) {
            blockedContents.remove();
        }
        if (timer) {
            activeBlocker = setInterval(removeBlockedVideos, 250);
        } else {
            removeBlockedVideos();
            clearInterval(activeBlocker);
        }
    }
}


function disableJSByName() {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.src === "") {
            script.parentNode.removeChild(script);
        }
    });
}

window.navigation.addEventListener("navigate", () => {
    blockedContentsCreated = false;
    setTimeout(() => {
        if (window.location.href.includes("/shorts/")) {
            window.location.href = window.location.href.replace("/shorts/", "/watch?v=");
        } else {
            propagandaBlocker(false);
        }
    }, 30);
});

window.addEventListener('scroll', propagandaBlocker.bind(null, false));

if (document.readyState !== "loading") {
    handlePageLoad();
} else {
    document.addEventListener("DOMContentLoaded", handlePageLoad);
}