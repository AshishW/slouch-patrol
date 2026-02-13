console.log("👮 Slouch-Patrol Content Script Loaded!");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "peek") {
    // Clean up  existing patrol (to prevents stacking)
    const existing = document.getElementById("slouch-patrol-wrap");
    if (existing) existing.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "slouch-patrol-wrap";

    // 3. Randomize Position
    const isTopRight = Math.random() > 0.5;
    wrapper.className = isTopRight ? "patrol-top-right" : "patrol-bottom-left";

    //  Cloud/Bubble
    const bubble = document.createElement("div");
    bubble.className = "patrol-bubble";
    bubble.innerText = request.message;

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/slouch-police-transparent.png");
    img.className = "patrol-officer";

    wrapper.appendChild(bubble);
    wrapper.appendChild(img);
    document.body.appendChild(wrapper);

    //  Auto-remove (7 seconds total)
    setTimeout(() => {
      wrapper.classList.add("patrol-exit");
      setTimeout(() => wrapper.remove(), 500);
    }, 6500);
  }
});
