async function onWindowClose() {
  await Neutralino.app.exit();
}
function onTrayMenuItemClicked(event) {
  console.log("Item do menu da bandeja clicado:", event.detail.id);
}
async function initialize() {
await Neutralino.init();
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);
}
initialize();