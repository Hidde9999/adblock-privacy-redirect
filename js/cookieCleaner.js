document.addEventListener('DOMContentLoaded', function() {
    const clearCookiesButton = document.getElementById('clearCookiesButton');
    const cookieList = document.getElementById('cookieList');

    // Add click event listener to the button
    clearCookiesButton.addEventListener('click', function() {
        // Clear all cookies
        chrome.cookies.getAll({}, function(cookies) {
            for (let i = 0; i < cookies.length; i++) {
                chrome.cookies.remove({
                    url: "https://" + cookies[i].domain + cookies[i].path,
                    name: cookies[i].name
                });
            }
            // After clearing, update the UI to show that cookies are cleared
            cookieList.innerHTML = '<li>All cookies cleared</li>';
        });
    });

    // Load cookies initially
    chrome.cookies.getAll({}, function(cookies) {
        cookies.forEach(function(cookie) {
            const listItem = document.createElement('li');
            listItem.textContent = cookie.name + ' (' + cookie.domain + ')';
            cookieList.appendChild(listItem);
        });
    });
});
