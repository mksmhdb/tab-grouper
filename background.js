// Sample rule for testing (will be managed by UI later)
const COLORS = [
  'grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function groupTabWithRule(tabId, groupName, groupColor) {
  chrome.tabs.group({ tabIds: [tabId] }, (groupId) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    let color = groupColor === 'random' ? getRandomColor() : groupColor;
    chrome.tabGroups.update(groupId, {
      title: groupName || '',
      color
    });
  });
}

function checkAndGroupTab(tab) {
  if (!tab || !tab.id || !tab.title) return;
  if (!chrome.storage || !chrome.storage.sync) {
    console.error('chrome.storage.sync is not available in this context.');
    return;
  }
  chrome.storage.sync.get({ rules: [] }, (data) => {
    const rules = data.rules || [];
    for (const rule of rules) {
      if (rule.type === 'title_contains' && tab.title.includes(rule.value)) {
        // If groupName is empty, always create a new group for this tab
        groupTabWithRule(tab.id, rule.groupName, rule.groupColor);
        break;
      }
      // Future: add more rule types here
    }
  });
}

chrome.tabs.onCreated.addListener((tab) => {
  // Sometimes title is not available immediately, so listen for update too
  checkAndGroupTab(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.title) {
    checkAndGroupTab(tab);
  }
});

function groupTab(tabId) {
  chrome.tabs.group({ tabIds: [tabId] }, (groupId) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    const color = getRandomColor();
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