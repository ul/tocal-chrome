const initControl = ({ id, label }) => {
  const changeControl = document.getElementById(id);
  const controlLabel = document.getElementById(`${id}-label`);

  const updateControlLabel = (control) => {
    controlLabel.innerText = label(control);
  };

  changeControl.addEventListener("change", (e) => {
    const value = parseInt(e.target.value, 10);
    chrome.storage.sync.set(
      {
        [id]: value,
      },
      () => updateControlLabel(value)
    );
  });

  chrome.storage.sync.get([id], ({ [id]: value }) => {
    changeControl.value = value;
    updateControlLabel(value);
  });
};

initControl({ id: "duration", label: (x) => `${x} minutes` });
initControl({ id: "offset", label: (x) => `+${x} day${x === 1 ? "s" : ""}` });

document.getElementById("submit").addEventListener("click", (e) => {
  chrome.storage.sync.get(
    ["duration", "offset", "command"],
    async ({ duration = 30, offset = 1, command = "tocal" }) => {
      const tabs = await chrome.tabs.query({ active: true });
      const tab = tabs[0];
      if (tab && tab.url) {
        const result = await chrome.runtime.sendNativeMessage("shell", {
          command,
          args: [`/${duration}`, `+${offset}`, `${tab.title} - ${tab.url}`],
          output: true,
        });
        const notificationOptions = {
          type: "basic",
          iconUrl: "images/get_started48.png",
          title: "ToCal",
        };
        if (result.status === 0) {
          const message = result.output;
          chrome.runtime.sendMessage({ ...notificationOptions, message });
          chrome.tabs.remove(tab.id);
        } else {
          chrome.runtime.sendMessage({
            ...notificationOptions,
            message: "ToCal failed.",
          });
        }
      }
    }
  );
});
