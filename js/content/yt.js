let activeBlocker;
let blockedContentsCreated = false
// let currentUrl
// const blockedContentsHtml = `
//         <div class="blocked-container" id="blocked-contents">
//             <h1>This page is blocked</h1>
//             <p>The content you're trying to access is not available due to propaganda.</p>
//         </div>`;

const blockedChannels = [
    "Stop Willem Engel",
    "Aangifte Willem Engel",

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
    "RTV Utrecht",
    "Omroep West",
    "NPO 3",
    "NPO 3 TV",
    "Radar AVROTROS",
    "AVROTROS",
    "vpro tegenlicht",
    "WeerNL TalpaNetwork",
    "Hart van Nederland",
    "Op1",

    "RIVMnl",

    "NTR Wetenschap",
    "Universiteit van Nederland",

    "GroenLinks-PvdA",

    "VRT NWS",
    "VRT 1",
    "VTM",

    "Eurovision Song Contest",
    "Megan Thee Stallion",

    "Sydney Children's Hospitals Network",

    "ABC News",
    "ABC10",
    "BBC News",
    "BBC",
    "CBS News",
    "ITV News",
    "NBC News",
    "CBS Mornings",
    "KOCO 5 News",
    "Daily Mail",
    "MSNBC",
    "CNBC",
    "CBS Sunday Morning",
    "The Telegraph",
    "Fox News",
    "FOX Weather",
    "CNN",
    "9 News Australia",
    "Channel 4 News",
    "Guardian News",
    "Bloomberg Television",
    "Eyewitness News ABC7NY",
    "NBCLA",
    "KCAL News",
    "USA TODAY",
    "CBS Evening News",
    "Associated Press",
    "U.S. Defense News",
    "US Army News",
    "The Sun",
    "TVP World",
    "Reuters",
    "Global News",
    "Times Radio",
    "Forbes Breaking News",
    "Saturday Night Live",
    "KETV NewsWatch 7",
    "KTLA 5",
    "PBS NewsHour",
    "US Military News",
    "CBS Philadelphia",
    "The Military Show",
    "Sky News",
    "LBC",
    "Al Jazeera English",
    "Kanal13",
    "The Hill",
    "WAR●MY",
    "Hindustan Times",
    "Forces News",
    "WION",
    "CBS Chicago",
    "ABC 7 Chicago",
    "CBS Boston",
    "Face the Nation",
    "Warographics",
    "ABC7 News Bay Area",
    "Military Summary",

    "James Charles",
    "Trixie Mattel",
    "RuPaul's Drag Race",
    "Shane2",

    "Beast Philanthropy",

    "DW Documentary",
    "DW News",

    "ZDF heute-show",
    "ZDFheute Nachrichten",
    "tagesschau",
    "BILD",

    "FRANCE 24",
];

const whiteList = [
    "Dfacto",
    "Project Paraguay",
    "Cafe Weltschmerz",
    "Clintel",
    "BENDER",
    "Ongehoord Nederland TV",
    "Harry Vermeegen Official",
    "blckbx",
    "Potkaars-live",
    "Tucker Carlson",
]

const videoTitles = [
    "Overtreders",
    "Handhavers",

    "europapa",
    "Joost Klein",

    "klimaat",
    "broeikaseffect",
    "globalwarming",
    "climate change",
    "climate",

    "dragqueen",
    "drag queen",

    "vaccination",
    "vaccin",
    "inenten",

    "Ukraine",

    "zonnebrand",

    "mazelen",
    "measles",
];

// Constants
const ytElementsSelector = "#dismissible, #content-section, .style-scope.yt-horizontal-list-renderer, .style-scope.ytd-rich-grid-row, .style-scope.ytd-item-section-renderer";
const invidiousElementsSelector = "#contents .pure-u-1:not(.navbar)";
const blockedContentsHtml = `
    <div class="blocked-container" id="blocked-contents">
        <h1>This page is blocked</h1>
        <p>The content you're trying to access is not available due to propaganda.</p>
    </div>`;

// Helper Functions
function isBlockedChannel(channelName) {
    return blockedChannels.some(keyword => channelName.toLowerCase().includes(keyword.toLowerCase()));
}

function isWhitelistedChannel(channelName) {
    return whiteList.some(keyword => channelName.toLowerCase().includes(keyword.toLowerCase()));
}

function isBlockedTitle(title) {
    return videoTitles.some(blockedTitle => title.toLowerCase().includes(blockedTitle.toLowerCase()));
}

function removeBlockedVideos(videoElements) {
    videoElements.forEach(video => {
        const channelLink = video.querySelector('#text a') || video.querySelector('#container #text') || video.querySelector(".pure-u-14-24 a") || video.querySelector(".channel-name");
        const videoTitle = video.querySelector('#video-title') || video.querySelector(".video-card-row p");

        if (channelLink && isWhitelistedChannel(channelLink.textContent.trim())) {
            return;
        }

        if (channelLink && isBlockedChannel(channelLink.textContent.trim())) {
            console.log("Removing video from blocked channel:", channelLink.textContent.trim());
            video.remove();
        } else if (videoTitle && isBlockedTitle(videoTitle.textContent.trim())) {
            console.log("Removing video with blocked title:", videoTitle.textContent.trim());
            video.remove();
        }
    });
}

function blockPage() {
    const pageManagerElement = document.getElementById("page-manager") || document.querySelector("#contents");
    if (pageManagerElement) {
        pageManagerElement.innerHTML = blockedContentsHtml;
    } else {
        console.error("Element matching '#page-manager' or '#contents' not found.");
    }
}

function addLinksToInvidious(videoElement) {
    function backToInvidious(link) {
        window.location.href = `${link.href.replace("www.youtube.com", "invidious.privacyredirect.com")}`;
    }

    if(videoElement){
        const link = videoElement.querySelector("a");
        videoElement.addEventListener('click', () => backToInvidious(link));
    }
}

// Main Functions
function handlePageLoad() {
    // disableJSByName();
    propagandaBlocker(true);
    addLinksToInvidious();
}

function propagandaBlocker(timer) {
    if (blockedContentsCreated) {
        return;
    }

    if (timer) {
        activeBlocker = setInterval(blockVideos, 250);
    } else {
        blockVideos();
        clearInterval(activeBlocker);
    }
}

function blockVideos() {
    const currentUrl = window.location.href.toLowerCase().replace("+", " ");
    const videoElements = currentUrl.includes("youtube.com") ? document.querySelectorAll(ytElementsSelector) : document.querySelectorAll(invidiousElementsSelector);

    if (currentUrl.includes("/watch?")) {
        const intervalId = setInterval(function () {
            const elementToLoad = document.querySelector("#text-container a") || document.querySelector("#channel-name");
            if (elementToLoad) {
                clearInterval(intervalId);
                onElementLoad();
            }
        }, 1000);
    }

    if (
        isBlockedChannel(currentUrl) && currentUrl.includes("youtube.com") ||
        (!currentUrl.includes("www.youtube.com") && currentUrl.includes("/channel/")) || currentUrl.includes("/search?")
    ) {
        const channelNameElement = document.querySelector("meta[itemprop='name']") || document.querySelector(".channel-profile span");
        const channelName = channelNameElement ? (channelNameElement.getAttribute("content") || channelNameElement.textContent) : null;
        if (channelName && isBlockedChannel(channelName) && !isWhitelistedChannel(channelName)) {
            blockPage();
        }
    }

    if (
        currentUrl.includes("/search?") ||
        currentUrl.includes("/results") ||
        currentUrl.includes("/channel") ||
        currentUrl.includes("/videos") ||
        currentUrl.includes("/watch?") ||
        currentUrl.includes('/feed/popular') ||
        currentUrl.includes('/feed/trending') ||
        currentUrl === "https://www.youtube.com/"
    ) {
        const blockedContents = document.getElementById("blocked-contents");
        if (blockedContents && !blockedContentsCreated) {
            blockedContents.remove();
        }
        removeBlockedVideos(videoElements);
    }
}

// Event Listeners
window.navigation.addEventListener("navigate", () => {
    blockedContentsCreated = false;
    setTimeout(() => {
        if (window.location.href.includes("/shorts/")) {
            window.location.href = window.location.href.replace("/shorts/", "/watch?v=");
        } else if (window.location.href.includes("/results")) {
            propagandaBlocker(true);
        } else {
            propagandaBlocker(false);
        }
    }, 200);
});

window.addEventListener('scroll', propagandaBlocker.bind(null, false));

// Initial Page Load
if (document.readyState !== "loading") {
    handlePageLoad();
} else {
    document.addEventListener("DOMContentLoaded", handlePageLoad);
}