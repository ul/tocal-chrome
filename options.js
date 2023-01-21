chrome.storage.sync.get(["command"], ({ command = "tocal" }) => {
  document.getElementById("command").value = command;
});
document.getElementById("submit").addEventListener("click", (e) => {
  let input = document.getElementById("command");
  chrome.storage.sync.set({
    command: input.value,
  });
});
