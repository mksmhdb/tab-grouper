// Defensive check: Ensure this script is running in the Chrome extension context
if (!chrome || !chrome.storage || !chrome.storage.sync) {
  alert('Please open this page from the Chrome Extensions page (chrome://extensions > Details > Extension options).');
  throw new Error('chrome.storage.sync is not available.');
}

// Get references to the form and rules list elements
const ruleForm = document.getElementById('rule-form');
const rulesList = document.getElementById('rules-list');

// Render the list of rules in the UI
function renderRules(rules) {
  rulesList.innerHTML = '';
  rules.forEach((rule, idx) => {
    const div = document.createElement('div');
    div.className = 'rule';
    div.innerHTML = `
      <span class="rule-title">${rule.type.replace('_', ' ')}: <b>${rule.value}</b></span>
      <span class="delete-btn" data-idx="${idx}">Delete</span><br>
      Group: <b>${rule.groupName ? rule.groupName : '(no name)'}</b> (<span style="color:${rule.groupColor}">${rule.groupColor}</span>)
    `;
    // Delete button handler
    div.querySelector('.delete-btn').onclick = (e) => {
      rules.splice(idx, 1);
      saveRules(rules);
    };
    rulesList.appendChild(div);
  });
}

// Save the rules array to chrome.storage.sync
function saveRules(rules) {
  chrome.storage.sync.set({ rules }, () => {
    renderRules(rules);
  });
}

// Load rules from chrome.storage.sync and render them
function loadRules() {
  chrome.storage.sync.get({ rules: [] }, (data) => {
    renderRules(data.rules || []);
  });
}

// Handle form submission to add a new rule
ruleForm.onsubmit = (e) => {
  e.preventDefault();
  const type = document.getElementById('rule-type').value;
  const value = document.getElementById('rule-value').value.trim();
  const groupName = document.getElementById('rule-group-name').value.trim();
  const groupColor = document.getElementById('rule-group-color').value;
  if (!value) return;
  chrome.storage.sync.get({ rules: [] }, (data) => {
    const rules = data.rules || [];
    rules.push({ type, value, groupName, groupColor });
    saveRules(rules);
    ruleForm.reset();
  });
};

// Initial load of rules when the page is opened
loadRules(); 