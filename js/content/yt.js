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
    "CNN",
    "Reuters",

    "ZDF heute-show",
    "BILD",
];

const videoTitels = [
    "Overtreders",
    "Handhavers"
];

function propagandaBlocker() {
    setInterval(() => {
        const videoElements = document.querySelectorAll("#dismissible, #content-section, .style-scope.yt-horizontal-list-renderer, .style-scope.ytd-rich-grid-row");

        videoElements.forEach(function (video) {
            const channelLink = video.querySelector('#channel-name a, #info-section #text, #container #text');
            const videoTitle = video.querySelector('#video-title, #video-title .style-scope.ytd-video-renderer');
            if (channelLink && blockedChannels.includes(channelLink.innerHTML)) {
                video.remove()
            }
            if (videoTitle && includesTitels(videoTitle.innerHTML)){
                video.remove()
            }
        });
    }, 250);
}

if (document.readyState !== "loading") {
    propagandaBlocker();
} else {
    document.addEventListener("DOMContentLoaded", propagandaBlocker);
}

function includesTitels(title) {
    return videoTitels.some(keyword => title.includes(keyword));
}