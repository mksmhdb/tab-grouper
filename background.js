// List of possible tab group colors
const COLORS = [
  'grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'
];

// Returns a random color from the COLORS array
function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// Groups a single tab into a new group, setting the group name and color as specified
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

// Checks if a tab matches any rule and groups it if so
function checkAndGroupTab(tab) {
  if (!tab || !tab.id || !tab.title) return;
  // Ignore tabs that are already in a group
  if (typeof tab.groupId !== 'undefined' && tab.groupId !== -1) return;
  if (!chrome.storage || !chrome.storage.sync) {
    console.error('chrome.storage.sync is not available in this context.');
    return;
  }
  chrome.storage.sync.get({ rules: [] }, (data) => {
    const rules = data.rules || [];
    for (const rule of rules) {
      if (
        (rule.type === 'title_contains' && tab.title.includes(rule.value)) ||
        (rule.type === 'url_contains' && tab.url && tab.url.includes(rule.value))
      ) {
        // If groupName is empty, always create a new group for this tab
        groupTabWithRule(tab.id, rule.groupName, rule.groupColor);
        break;
      }
      // Future: add more rule types here
    }
  });
}

// Listen for new tabs and check if they should be grouped
chrome.tabs.onCreated.addListener((tab) => {
  // Sometimes title is not available immediately, so listen for update too
  checkAndGroupTab(tab);
});

// Listen for tab updates (e.g., title changes) and check if they should be grouped
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.title) {
    checkAndGroupTab(tab);
  }
});

// Groups a tab into a new group with a random color and no name (used for manual grouping)
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

// Listen for toolbar button clicks to manually group the current tab
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    groupTab(tab.id);
  }
});

// Listen for keyboard shortcut commands to manually group the current tab
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'group-tab' && tab && tab.id) {
    groupTab(tab.id);
  }
}); 