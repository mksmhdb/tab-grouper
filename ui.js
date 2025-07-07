// Defensive check: Ensure this script is running in the Chrome extension context
if (!chrome || !chrome.storage || !chrome.storage.sync) {
  alert('Please open this page from the Chrome Extensions toolbar icon or from the Chrome Extensions options page. chrome.storage.sync is not available.');
  throw new Error('chrome.storage.sync is not available.');
}

// Get references to the form and rules list elements
const ruleForm = document.getElementById('rule-form');
const rulesList = document.getElementById('rules-list');
const submitBtn = ruleForm.querySelector('button[type="submit"]');

let editIndex = null; // Track which rule is being edited

// Render the list of rules in the UI
function renderRules(rules) {
  rulesList.innerHTML = '';
  rules.forEach((rule, idx) => {
    const div = document.createElement('div');
    div.className = 'rule';
    div.innerHTML = `
      <span class="rule-title">${rule.type.replace('_', ' ')}: <b>${rule.value}</b></span>
      <span class="delete-btn" data-idx="${idx}">Delete</span>
      <span class="edit-btn" data-idx="${idx}">Edit</span><br>
      Group: <b>${rule.groupName || '(no name)'}</b> (<span style="color:${rule.groupColor}">${rule.groupColor}</span>)
    `;
    // Delete button handler
    div.querySelector('.delete-btn').onclick = (e) => {
      rules.splice(idx, 1);
      saveRules(rules);
    };
    // Edit button handler
    div.querySelector('.edit-btn').onclick = (e) => {
      document.getElementById('rule-type').value = rule.type;
      document.getElementById('rule-value').value = rule.value;
      document.getElementById('rule-group-name').value = rule.groupName;
      document.getElementById('rule-group-color').value = rule.groupColor;
      editIndex = idx;
      submitBtn.textContent = 'Save';
    };
    rulesList.appendChild(div);
  });
}

// Save the rules array to chrome.storage.sync
function saveRules(rules) {
  chrome.storage.sync.set({ rules }, () => {
    renderRules(rules);
    // Reset form after save
    ruleForm.reset();
    submitBtn.textContent = 'Add Rule';
    editIndex = null;
  });
}

// Load rules from chrome.storage.sync and render them
function loadRules() {
  chrome.storage.sync.get({ rules: [] }, (data) => {
    renderRules(data.rules || []);
  });
}

// Handle form submission to add or edit a rule
ruleForm.onsubmit = (e) => {
  e.preventDefault();
  const type = document.getElementById('rule-type').value;
  const value = document.getElementById('rule-value').value.trim();
  const groupName = document.getElementById('rule-group-name').value.trim();
  const groupColor = document.getElementById('rule-group-color').value;
  if (!value) { return; }
  chrome.storage.sync.get({ rules: [] }, (data) => {
    const rules = data.rules || [];
    if (editIndex !== null) {
      // Edit existing rule
      rules[editIndex] = { type, value, groupName, groupColor };
    } else {
      // Add new rule
      rules.push({ type, value, groupName, groupColor });
    }
    saveRules(rules);
  });
};

// Initial load of rules when the page is opened
loadRules(); 