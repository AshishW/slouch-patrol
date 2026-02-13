document.addEventListener("DOMContentLoaded", async () => {
  const input = document.querySelector("#interval");
  const status = document.querySelector("#status");
  const { interval } = await chrome.storage.sync.get({
    interval: 20,
  });
  input.value = interval;

  const saveBtn = document.querySelector("#save");
  saveBtn.addEventListener("click", async () => {
    const val = Number(input.value);
    if (val < 1 || val > 120) {
      alert("Please enter a value between 1 and 120");
      return;
    }
    await chrome.storage.sync.set({ interval: val });

    status.style.opacity = "1";
    setTimeout(() => {
      status.style.opacity = "0";
    }, 2000);
  });
});
