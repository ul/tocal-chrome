chrome.runtime.onMessage.addListener((data) =>
  chrome.notifications.create(data)
);
