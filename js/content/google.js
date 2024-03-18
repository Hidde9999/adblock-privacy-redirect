// Disable JavaScript on Google pages
document.addEventListener('DOMContentLoaded', function() {
    const scriptTags = document.getElementsByTagName('script');
    for (let i = 0; i < scriptTags.length; i++) {
        scriptTags[i].parentNode.removeChild(scriptTags[i]);
    }
    const linkTags = document.getElementsByTagName('link');
    for (let i = 0; i < scriptTags.length; i++) {
        linkTags[i].parentNode.removeChild(linkTags[i]);
    }
});
