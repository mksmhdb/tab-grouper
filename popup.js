if (!chrome || !chrome.storage || !chrome.storage.sync) {
  alert('Please open this popup from the Chrome Extensions toolbar icon. chrome.storage.sync is not available.');
  throw new Error('chrome.storage.sync is not available.');
}

const ruleForm = document.getElementById('rule-form');
const rulesList = document.getElementById('rules-list');

function renderRules(rules) {
  console.log('Rendering rules:', rules);
  rulesList.innerHTML = '';
  rules.forEach((rule, idx) => {
    const div = document.createElement('div');
    div.className = 'rule';
    div.innerHTML = `
      <span class="rule-title">${rule.type.replace('_', ' ')}: <b>${rule.value}</b></span>
      <span class="delete-btn" data-idx="${idx}">Delete</span><br>
      Group: <b>${rule.groupName ? rule.groupName : '(no name)'}</b> (<span style="color:${rule.groupColor}">${rule.groupColor}</span>)
    `;
    div.querySelector('.delete-btn').onclick = (e) => {
      rules.splice(idx, 1);
      saveRules(rules);
    };
    rulesList.appendChild(div);
  });
}

function saveRules(rules) {
  chrome.storage.sync.set({ rules }, () => {
    if (chrome.runtime.lastError) {
      alert('Failed to save rules: ' + chrome.runtime.lastError.message);
      console.error('Failed to save rules:', chrome.runtime.lastError);
    } else {
      console.log('Rules saved:', rules);
      renderRules(rules);
    }
  });
}

function loadRules() {
  chrome.storage.sync.get({ rules: [] }, (data) => {
    if (chrome.runtime.lastError) {
      alert('Failed to load rules: ' + chrome.runtime.lastError.message);
      console.error('Failed to load rules:', chrome.runtime.lastError);
    } else {
      console.log('Rules loaded:', data.rules);
      renderRules(data.rules || []);
    }
  });
}

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
    console.log('Adding rule:', { type, value, groupName, groupColor });
    saveRules(rules);
    ruleForm.reset();
  });
};

loadRules(); 