document.addEventListener('DOMContentLoaded', function() {
    const clearAllCookiesButton = document.getElementById('clearAllCookiesButton');
    const clearCookiesButton = document.getElementById('clearCookiesButton');
    const cookieList = document.getElementById('cookieList');
    const status = document.getElementById('status');
    let cookieKeepList = [];

    // Load the JSON file
    fetch(chrome.runtime.getURL("json/cookies.json"))
        .then(response => response.json())
        .then(data => {
            cookieKeepList = data;
            status.textContent = 'Cookie keep list loaded successfully.';
        })
        .catch(error => {
            console.error('Error loading cookiesToKeep.json:', error);
            status.textContent = 'Failed to load cookie keep list.';
        });

    function shouldKeepCookie(domain, name) {
        return cookieKeepList.some(entry => (
            (entry.domain === null || (entry.domain && domain.includes(entry.domain))) &&
            (entry.cookies.includes(name) || entry.cookies.includes('*'))
        ));
    }

    // Add click event listener to the "Clear All Cookies" button
    clearAllCookiesButton.addEventListener('click', function() {
        status.textContent = 'Clearing all cookies...';
        chrome.cookies.getAll({}, function(cookies) {
            for (let i = 0; i < cookies.length; i++) {
                chrome.cookies.remove({
                    url: "https://" + cookies[i].domain + cookies[i].path,
                    name: cookies[i].name
                });
            }
            getAllCookies();
            status.textContent = 'All cookies cleared.';
        });
    });

    // Add click event listener to the "Clear Cookies except" button
    clearCookiesButton.addEventListener('click', function() {
        status.textContent = 'Clearing cookies except those in the keep list...';
        chrome.cookies.getAll({}, function(cookies) {
            for (let i = 0; i < cookies.length; i++) {
                if (!shouldKeepCookie(cookies[i].domain, cookies[i].name)) {
                    chrome.cookies.remove({
                        url: "https://" + cookies[i].domain + cookies[i].path,
                        name: cookies[i].name
                    });
                }
            }
            getAllCookies();
            status.textContent = 'Cookies cleared except for those in the keep list.';
        });
    });

    function getAllCookies(){
        cookieList.innerText = "";
        // Load cookies initially
        chrome.cookies.getAll({}, function(cookies) {
            cookies.forEach(function(cookie) {
                const listItem = document.createElement('li');
                listItem.textContent = cookie.name + ' (' + cookie.domain + ')';
                cookieList.appendChild(listItem);
            });
        });
    }
    getAllCookies()
});