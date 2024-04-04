const propagandaVideo = [{
    url: "https://www.youtube.com/watch?v=7-K-bTeGjMg",
    category: "Vaccin propaganda",
    beginTime: {
        hour: 0,
        min: 0,
        sec: 56,
    },
    endTime: {
        hour: 0,
        min: 1,
        sec: 20,
    }
},{
    url: "https://www.youtube.com/watch?v=KjSp-GU3CKU",
    category: "Fake News",
    beginTime: {
        hour: 0,
        min: 0,
        sec: 36,
    },
    endTime: {
        hour: 0,
        min: 0,
        sec: 59,
    }
}];


// Function to convert time object to seconds
function timeToSeconds(time) {
    return time.hour * 3600 + time.min * 60 + time.sec;
}

// Function to get the begin and end times in seconds
function getTimesInSeconds(video) {
    const beginTimeInSeconds = timeToSeconds(video.beginTime);
    const endTimeInSeconds = timeToSeconds(video.endTime);
    return { beginTimeInSeconds, endTimeInSeconds };
}
function checkPropaganda() {
    const currentUrl = window.location.href;
    propagandaVideo.forEach(video => {
        if (currentUrl.includes(video.url)) {
            const { beginTimeInSeconds, endTimeInSeconds } = getTimesInSeconds(video);
            const videoContainer = document.querySelector(".html5-video-container");
            const videoElement = document.querySelector(".video-stream.html5-main-video");
            const progressBar = document.querySelector(".ytp-progress-bar-container");

            // Calculate the total duration of the video
            const totalDuration = videoElement.duration;

            // Calculate the percentage of the video duration for beginTime and endTime
            const beginTimePercentage = (beginTimeInSeconds / totalDuration) * 100;
            const endTimePercentage = (endTimeInSeconds / totalDuration) * 100;

            // Create a red overlay element for the skipped part
            const skippedPartOverlay = document.createElement("div");
            skippedPartOverlay.classList.add("skipped-part-overlay");
            skippedPartOverlay.style.left = `${beginTimePercentage}%`;
            skippedPartOverlay.style.width = `${endTimePercentage - beginTimePercentage}%`;

            // Append the overlay to the progress bar
            progressBar.appendChild(skippedPartOverlay);

            // Add an event listener to the video's 'timeupdate' event
            videoElement.addEventListener("timeupdate", function () {
                // Check if the current time is within the specified range
                if (videoElement.currentTime >= beginTimeInSeconds && videoElement.currentTime <= endTimeInSeconds) {
                    // If it is, set the current time to the end time
                    videoElement.currentTime = endTimeInSeconds;

                    // Create and append banner element
                    const banner = document.createElement("div");
                    banner.classList.add("skip-banner");
                    banner.innerHTML = `
                        <h2>Fragment Skipped: ${video.category}</h2>
                        <p>This message hides in 5 sec</p>
                    `;
                    videoContainer.appendChild(banner);
                    setTimeout(() => {
                        banner.remove()
                    }, 5000);

                }
            });
        }
    });
}

window.navigation.addEventListener("navigate", () => {
    if (document.querySelector(".skipped-part-overlay")){
        document.querySelector(".skipped-part-overlay").remove()
    }
    setTimeout(() => {
        checkPropaganda()
    }, 30);
})

if (document.readyState !== "loading") {
    checkPropaganda();
} else {
    document.addEventListener("DOMContentLoaded", checkPropaganda);
}