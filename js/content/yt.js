const blockedChannels = [
    // NOS
    "NOS",
    "NOS Sport",
    "NOS op 3",
    "NOS Jeugdjournaal",
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
    "Fox News",
    "FOX Weather",
    "CNN",
    "Reuters",

    "ZDF heute-show",
    "BILD",
];

const videoTitels = [
    "Overtreders",
    "Handhavers",
    "europapa",
    "Joost Klein",
];

// let activeBlocker

function propagandaBlocker() {
    const currentUrl = window.location.href.toLowerCase().replace('@', '').replace("+", " ")
    if (currentUrl.includes("?search_query=") && blockedChannels.some(channel => currentUrl.includes(channel.toLowerCase()))) {
        document.getElementById("page-manager").innerHTML = `
            <div class="blocked-container" id="blocked-contents">
                <h1>This page is blocked</h1>
                <p>The content you're trying to access is not available due to propaganda.</p>
            </div>
        `
    } else if(currentUrl.includes("/results") || currentUrl === "https://www.youtube.com/"){
        // activeBlocker = setInterval(videoBlocker, 250);
        videoBlocker()
        if (document.getElementById("blocked-contents")){
            document.getElementById("blocked-contents").remove()
        }
    } else if (blockedChannels.some(channel => currentUrl.includes(channel.toLowerCase()))) { // Convert channel name to lowercase for comparison
        // Replace page content with a message
        document.getElementById("page-manager").innerHTML = `
            <div class="blocked-container" id="blocked-contents">
                <h1>This page is blocked</h1>
                <p>The content you're trying to access is not available due to propaganda.</p>
            </div>
        `;
    }
}

function videoBlocker(){
    const videoElements = document.querySelectorAll("#dismissible, #content-section, .style-scope.yt-horizontal-list-renderer, .style-scope.ytd-rich-grid-row, .style-scope.ytd-item-section-renderer");

    videoElements.forEach(function (video) {
        // const channelLink = video.querySelector('#channel-name a, #info-section #text, #container #text');
        const channelLinkVideo = video.querySelector('#channel-name a');
        const channelLinkPlaylist = video.querySelector('#video-title');
        const channelLink = video.querySelector('#container #text');
        const videoTitle = video.querySelector('#video-title, #video-title .style-scope.ytd-video-renderer');

        // video
        if (channelLinkVideo && blockedChannels.includes(channelLinkVideo.textContent.trim())) {
            console.log("Removing video from blocked channel:", channelLinkVideo.textContent.trim());
            video.remove();
        } else if (channelLink && blockedChannels.includes(channelLink.textContent.trim())) {
            console.log("Removing channel from blocked channel:", channelLink.textContent.trim());
            video.remove();
        } else if (channelLinkPlaylist && includesBlockedChannels(channelLinkPlaylist.textContent.trim())) {
            console.log("Removing video from blocked playlist:", channelLink.textContent.trim());
            video.remove();
        } else if (videoTitle && includesTitles(videoTitle.textContent.trim())) {
            console.log("Removing video with blocked title:", videoTitle.textContent.trim());
            video.remove();
        } else {
            // myTimeout = setTimeout(function () {clearInterval(activeBlocker)}, 10000);
        }
    });
}

function disableJSByName() {
    const scripts = document.querySelectorAll('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === "") {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
}

function includesTitles(title) {
    const lowercaseTitle = title.toLowerCase();
    return videoTitels.some(blockedTitle => lowercaseTitle.includes(blockedTitle.toLowerCase()));
}

function includesBlockedChannels(title) {
    if (!blockedChannels || blockedChannels.length === 0) {
        return false; // Return false if blockedChannels is undefined or empty
    }
    const lowercaseTitle = title.toLowerCase();
    return blockedChannels.some(keyword => lowercaseTitle.includes(keyword.toLowerCase()));
}

window.navigation.addEventListener("navigate", () => {
    setTimeout(() => {
        if (window.location.href.includes("/shorts/")) {
            window.location.href = window.location.href.replace("/shorts/", "/watch?v=");
        } else {
            propagandaBlocker();
        }
    }, 30);
})

window.addEventListener('scroll', function () {
    propagandaBlocker()
});

if (document.readyState !== "loading") {
    disableJSByName();
    propagandaBlocker();
}