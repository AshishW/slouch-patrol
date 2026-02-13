chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.interval) {
    chrome.alarms.clear("slouch-check", () => {
      chrome.alarms.create("slouch-check", {
        periodInMinutes: changes.interval.newValue,
      });
      console.log("New alarm set for:", changes.interval.newValue);
    });
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Slouch-Patrol reporting for duty 👮🚨");
  chrome.alarms.create("slouch-check", {
    periodInMinutes: 20,
  });
  if (details.reason === "install") {
    // first install
    console.log("Slouch-Patrol is installed!");
  }
  if (details.reason === "update") {
    console.log("updated extension🔄️");
  }
});

const MESSAGES = [
  "Posture check. You’re a human, not a prawn:p. Also, drink some water.",
  "Sit straight. Your back is not a laptop. And yes, drink some water now.",
  "Quick check: you’re neither a shrimp nor a cactus, So sit straight and stay hydrated! :p",
  "Not a shrimp. Not a cactus. Sit straight and stay hydrated.",
  "Your spine wants better posture. stretch a bit",
  "Straighten up a bit. Take a sip of water. You’ll thank yourself later.",
  "Your future self says: sit straight and hydrate.",
  "Stretch break. Roll your shoulders. Your neck will appreciate it.",
  "Time to stretch. Your body has been buffering for too long.",
  "Stand up and stretch for 30 seconds. Yes, now.",
  "Neck stiff? Shoulder tight? Stretch it out.",
  "Quick stretch check. Move your body before it files a bug report.",
  "Stretch a little. Your muscles are not meant to be static.",
  "Stand up, stretch, breathe. Then get back to being awesome.",
  "Your body wants movement. A quick stretch will do.",
  "Stretch reminder. You are not a statue.",
];

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "slouch-check") {
    console.log("sit straight human, time to stretch");
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    chrome.idle.queryState(300, (state) => {
      // 300 sec => 5 min
      if (state === "active") {
        chrome.notifications.create("", {
          type: "basic",
          iconUrl: "icons/slouch-police.png",
          title: "🚨Slouch-Patrol🚨",
          message: randomMessage,
          priority: 2,
        });
        chrome.tabs.query({ active: true }, (tabs) => {
          //tab that is in a 'normal' window and has a valid URL
          const activeTab = tabs.find((t) => t.url?.startsWith("http"));

          if (activeTab) {
            console.log("Found valid tab:", activeTab.id, " - ", activeTab.url);
            console.log("peek animation code");

            chrome.tabs
              .sendMessage(activeTab.id, {
                action: "peek",
                message: randomMessage,
              })
              .catch((err) =>
                console.log(
                  "Message failed (tab might be sleeping): ",
                  err.message,
                ),
              );
          } else {
            console.log("❌ No active HTTP tabs found in any window.");
          }
        });
      }
    });
  }
});

chrome.notifications.onClicked.addListener((id) => {
  if (id === "slouch-remainder") {
    // could add switching to some yt link for neck and back exercises
    chrome.notifications.clear(id);
  }
});

// --- DEBUGGING TOOLS ---
// This function logs the status of your alarm every 10 seconds
function debugAlarmStatus() {
  chrome.alarms.get("slouch-check", (alarm) => {
    if (alarm) {
      const timeRemaining = Math.round(
        (alarm.scheduledTime - Date.now()) / 1000,
      );
      if (timeRemaining > 0) {
        console.log(
          `⏱️ Alarm 'slouch-check' will fire in ${timeRemaining} seconds.`,
        );
      } else {
        console.log("🔔 Alarm is firing NOW!");
      }
    } else {
      console.log("❌ No alarm found with name 'slouch-check'.");
    }
  });
}

// Start the debug logger (runs every 10 seconds)
setInterval(debugAlarmStatus, 10000);

// Also log immediately when the service worker starts
console.log("🛠️ Debugger initialized: Checking alarm status...");
debugAlarmStatus();
