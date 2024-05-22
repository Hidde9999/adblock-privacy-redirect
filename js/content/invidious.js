let subscribeList = []
let subscribeListObj = []
let videoListObj = []

function channelSearch() {
    const currentUrl = window.location.href.toLowerCase()
    if (currentUrl.includes("/channel/")) {
        const buttonContainer = document.querySelector('.pure-u-1-2.flex-right.flexible.button-container');
        if (buttonContainer) {
            // Create search input field
            const searchInput = document.createElement('input');
            searchInput.setAttribute('type', 'text');
            searchInput.setAttribute('placeholder', 'Enter your search query');

// Create search button
            const searchButton = document.createElement('button');
            searchButton.textContent = 'Search';
            searchButton.className = 'pure-button pure-button-primary';

// Function to handle search
            function handleSearch() {
                const searchTerm = searchInput.value.trim();
                // Perform search operation with the search term
                console.log('Searching for:', searchTerm);

                // Redirect to YouTube search URL
                window.location.href = `${window.location.href.replace("invidious.privacyredirect.com", "www.youtube.com")}/search?query=${encodeURIComponent(searchTerm)}`;
            }

// Add event listener to search button
            searchButton.addEventListener('click', handleSearch);

// Append input field and button to a container (e.g., body)
            buttonContainer.appendChild(searchInput);
            buttonContainer.appendChild(searchButton);
        }
    }
}

function loadChannels() {
    subscribeList = JSON.parse(localStorage.getItem("subscribe"));
}

function subscribeToChannel() {
    loadChannels(); // Load existing subscriptions from localStorage

    const subscribeButton = document.querySelector('#subscribe');
    if (subscribeButton) {
        const subscribe = document.querySelector(".pure-u-1-2.flex-left.flexible a") || document.querySelector(".pure-button.pure-button-secondary");
        subscribeButton.href = "#";

        if (subscribeList && subscribeList.includes(subscribe.href)) {
            // If already subscribed, set up unsubscribe functionality
            subscribeButton.classList.add("disabled");
            const buttonText = subscribeButton.querySelector('b');
            if (buttonText) {
                buttonText.innerText = buttonText.innerText.replace("Subscribe", "Subscribed");
            }

            subscribeButton.addEventListener('click', () => {
                unsubscribe(subscribe.href, subscribeButton);
            });

            return;
        }

        subscribeButton.addEventListener('click', () => {
            // Subscribe
            if (!subscribeList) {
                subscribeList = []; // Initialize as an array if it's not already
            }
            if (!subscribeList.includes(subscribe.href)) {
                subscribeList.push(subscribe.href);
                localStorage.setItem('subscribe', JSON.stringify(subscribeList)); // Store as string
                console.log(subscribe.href);
            }

            // Update UI
            subscribeButton.classList.add("disabled");
            const buttonText = subscribeButton.querySelector('b');
            if (buttonText) {
                buttonText.innerText = buttonText.innerText.replace("Subscribe", "Subscribed");
            }

            // Set up unsubscribe functionality
            subscribeButton.addEventListener('click', () => {
                unsubscribe(subscribe.href, subscribeButton);
            });
        });
    }
}

function unsubscribe(channelHref, subscribeButton) {
    if (subscribeList && subscribeList.includes(channelHref)) {
        subscribeList = subscribeList.filter(href => href !== channelHref);
        localStorage.setItem('subscribe', JSON.stringify(subscribeList)); // Update localStorage

        // Update UI
        subscribeButton.classList.remove("disabled");
        const buttonText = subscribeButton.querySelector('b');
        if (buttonText) {
            buttonText.innerText = buttonText.innerText.replace("Subscribed", "Subscribe");
        }

        console.log("Unsubscribed from:", channelHref);
    }
}

function getVideosOf(url) {
    fetch(url)
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml')

            // const channelName = xmlDoc.querySelector('title')

            const entries = xmlDoc.querySelectorAll('entry')
            entries.forEach((entry, i) => {
                const title = entry.querySelector('title').textContent;
                const link = entry.querySelector('link[rel="alternate"]').getAttribute('href');
                const published = entry.querySelector('published').textContent;
                const thumbnailElement = entry.getElementsByTagNameNS('*', 'thumbnail')[0]; // Select thumbnail using getElementsByTagNameNS
                const thumbnail = thumbnailElement ? thumbnailElement.getAttribute('url') : ''; // Check if thumbnail exists
                const videoIdElement = entry.getElementsByTagNameNS('*', 'videoId')[0]; // Select videoId using getElementsByTagNameNS
                const videoId = videoIdElement ? videoIdElement.textContent : ''; // Check if videoId exists

                videoListObj.push({
                    title: title,
                    link: link,
                    published: published,
                    thumbnail: thumbnail
                })
            });
            videosListFunc();

            // } else {
            //     const items = xmlDoc.querySelectorAll('item')
            //     items.forEach((item) => {
            //         const title = item.querySelector('title').textContent
            //         const link = item.querySelector('link').textContent
            //         const pubDate = item.querySelector('pubDate').textContent
            //
            //         saveVideo(title, link, pubDate, channelName.textContent, refresh)
            //     });
            //
            // }
            // saveVideoList(channelName.textContent, refresh)
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error)
        });
}

function getRSSfeed(subscribe, index) {
    let subscribeUrl = subscribe.replace("feed/", "")
    subscribeUrl = subscribeUrl.replace("/channel/", "/feed/channel/")

    fetch(subscribeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`)
            }

            return response.text()
        })
        .then(xmlString => {
            // console.log(xmlString);
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml')

            if (xmlDoc.documentElement === null) {
                throw new Error('Invalid XML structure.')
            }

            const titleElement = xmlDoc.querySelector('title')
            if (!titleElement) {
                throw new Error('No title found in the RSS feed.')
            }
            subscribeListObj.push({
                title: titleElement.textContent,
                url: subscribeUrl
            })
            channelList(index);

        })
        .catch(error => {
            console.error('Error:', error.message)
        })
}

function getAllRSSfeeds() {
    loadChannels()
    if (Array.isArray(subscribeList)) {
        subscribeList.forEach((subscribe, index) => {
            getRSSfeed(subscribe, index);
        });

        channelList();
    } else {
        console.log("No subscriptions found.");
    }
}

function channelList() {
    const currentUrl = window.location.href.toLowerCase()
    if (currentUrl.includes("/channel/")) {
    }
    const contents = document.querySelector("#contents footer");
    if (contents) {
        contents.innerHTML = "";

        const channelList = document.createElement("div");

        subscribeListObj.forEach((subscribe) => {
            const channelTitle = document.createElement("p");
            channelTitle.textContent = subscribe.title;
            channelTitle.onclick = () => {
                getVideosOf(subscribe.url);
            };
            channelList.appendChild(channelTitle);
            contents.appendChild(channelList);
        })
    }
}

function videosListFunc() {
    const contents = document.querySelector("#contents footer");
    if (contents) {
        contents.innerHTML = "";

        const videoList = document.createElement("div");

        videoListObj.forEach((video) => {
            const videoLink = document.createElement("a");
            videoLink.href = video.link;

            const videoImg = document.createElement("img");
            videoImg.src = video.thumbnail;
            videoImg.className = "subsribe-tumb";

            const videoTitle = document.createElement("label");
            videoTitle.textContent = video.title;

            videoLink.appendChild(videoImg);
            videoLink.appendChild(videoTitle);
            videoList.appendChild(videoLink);
        })
        contents.appendChild(videoList);
    }
}

function handlePageLoad() {
    channelSearch()
    // subscribeToChannel()
    // getAllRSSfeeds()
}

if (document.readyState !== "loading") {
    handlePageLoad();
} else {
    document.addEventListener("DOMContentLoaded", handlePageLoad);
}