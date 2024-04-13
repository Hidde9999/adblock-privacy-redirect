// const linkedinPropaganda = [
//     "klimaat",
//     "vegan",
//     "Design patterns",
//
// ];
//
//
// function replaceText(node) {
//     if (node.nodeType === Node.TEXT_NODE) {
//         let text = node.textContent;
//         linkedinPropaganda.forEach(data => {
//             // text = text.replace(target, replacement);
//             console.log(data)
//             if (text.includes(data)){
//                 console.log(`${text} contains propaganda`)
//             }
//
//         });
//         node.textContent = text;
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//         node.childNodes.forEach(replaceText);
//     }
// }
//
// function handlePageLoad() {
//     replaceText(document.querySelector(".feed-shared-update-v2.feed-shared-update-v2--minimal-padding.full-height.relative.artdeco-card"));
// }
//
// if (document.readyState !== "loading") {
//     handlePageLoad();
// } else {
//     document.addEventListener("DOMContentLoaded", handlePageLoad);
// }
console.log("Hello world")