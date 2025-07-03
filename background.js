function groupTab(tabId) {
  chrome.tabs.group({ tabIds: [tabId] }, (groupId) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    const colors = [
      'grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    chrome.tabGroups.update(groupId, {
      title: '',
      color
    });
  });
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    groupTab(tab.id);
  }
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'group-tab' && tab && tab.id) {
    groupTab(tab.id);
  }
}); 