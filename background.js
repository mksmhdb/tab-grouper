// Sample rule for testing (will be managed by UI later)
const DEFAULT_RULES = [
  {
    type: 'title_contains',
    value: 'Docs',
    groupName: 'Documentation',
    groupColor: 'blue'
  }
];

function groupTabWithRule(tabId, groupName, groupColor) {
  chrome.tabs.group({ tabIds: [tabId] }, (groupId) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    chrome.tabGroups.update(groupId, {
      title: groupName,
      color: groupColor
    });
  });
}

function checkAndGroupTab(tab) {
  if (!tab || !tab.id || !tab.title) return;
  chrome.storage.sync.get({ rules: DEFAULT_RULES }, (data) => {
    const rules = data.rules || [];
    for (const rule of rules) {
      if (rule.type === 'title_contains' && tab.title.includes(rule.value)) {
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