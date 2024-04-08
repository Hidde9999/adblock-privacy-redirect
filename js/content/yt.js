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

    "De Telegraaf",
    "RTL Nieuws",
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

    "The Telegraph",

    "Eurovision Song Contest",

    "ABC News",
    "BBC News",
    "CBS News",
    "CBS Mornings",
    "MSNBC",
    "CNBC",
    "Fox News",
    "FOX Weather",
    "CNN",
    "9 News Australia",
    "Channel 4 News",
    "Guardian News",
    "Bloomberg Television",
    "Reuters",

    "DW Documentary",

    "ZDF heute-show",
    "BILD",
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
        const channelLink = video.querySelector('#text a') || video.querySelector('#container #text') || video.querySelector(".channel-name");
        const videoTitle = video.querySelector('#video-title') || video.querySelector(".video-card-row p");

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

function propagandaBlocker(timer) {
    const currentUrl = window.location.href.toLowerCase().replace('@', '').replace("+", " ");

    if (isBlockedChannel(currentUrl)) {
        const blockedContentsHtml = `
        <div class="blocked-container" id="blocked-contents">
            <h1>This page is blocked</h1>
            <p>The content you're trying to access is not available due to propaganda.</p>
        </div>`;

        if (currentUrl.includes("youtube.com")){
            document.getElementById("page-manager").innerHTML = blockedContentsHtml;
        } else {
            const blockedContainer = document.querySelector("#contents .pure-g:not(.navbar)");
            if (blockedContainer) {
                blockedContainer.innerHTML = blockedContentsHtml;
            } else {
                console.error("Target element not found:", "#contents .pure-g");
            }

        }

    }else if (currentUrl.includes("/search?") || currentUrl.includes("/results") || currentUrl.includes("/channel") || currentUrl.includes("/videos") || currentUrl.includes("/watch?") || currentUrl === "https://www.youtube.com/" || currentUrl.includes('/feed/popular')) {
        let activeBlocker;
        if (document.getElementById("blocked-contents")) {
            document.getElementById("blocked-contents").remove();
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