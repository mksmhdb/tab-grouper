# Tab Grouper (Chrome Extension)

A simple Chrome extension that automatically groups your tabs based on custom rules, or lets you group the current tab with a single click or keyboard shortcut.

## Features
- **Automatic tab grouping:** Define rules (e.g., "Title contains ...") to group tabs as soon as they open or update.
- **Manual grouping:** Click the extension icon or use a keyboard shortcut (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Y</kbd> by default) to group the current tab into a new group.
- **Flexible rules:**
  - Match by page title (more match types coming soon)
  - Group name and color are optional (leave name blank to always create a new group; choose "Random" for color)
- **Easy rule management:**
  - Manage rules from the popup (click the extension icon) or the options page (`chrome://extensions > Details > Extension options`)
- **Modern UI:** Clean, simple popup and options page for rule management.

## How to Install (for Non-Technical Users)

> **Note:** This extension is not available in the Chrome Web Store. You will need to install it manually. No coding is required!

### Step-by-Step Instructions

1. **Download the Extension Files**
   - Click the green **Code** button on this page and choose **Download ZIP**.
   - Unzip the downloaded file to a folder on your computer (for example, your Desktop).

2. **Open Chrome Extensions Page**
   - Open Google Chrome.
   - In the address bar, type `chrome://extensions` and press Enter.

3. **Enable Developer Mode**
   - In the top right corner of the Extensions page, turn on the switch labeled **Developer mode**.

4. **Load the Extension**
   - Click the **Load unpacked** button (top left).
   - In the window that opens, select the folder where you unzipped the extension files, then click **Select** (or **Open**).

5. **Pin the Extension (Optional)**
   - Click the puzzle piece icon (Extensions) in the top right of Chrome.
   - Find "Tab Grouper" and click the pin icon to keep it visible in your toolbar.

6. **Start Using Tab Grouper!**
   - Click the extension icon to open the popup and manage your rules.
   - Open the options page for more settings (click "Details" on the Extensions page, then "Extension options").
   - Try opening new tabs that match your rules to see them grouped automatically.

### Troubleshooting
- If you update the extension files, repeat steps 2–4 to reload the extension.
- If you see any errors, try removing the extension and adding it again.
- Make sure you are using Google Chrome (not another browser).

## Usage
- **Automatic grouping:**
  - Add rules in the popup or options page. When a tab matches a rule, it will be grouped automatically.
- **Manual grouping:**
  - Click the extension icon to group the current tab.
  - Or use the keyboard shortcut (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Y</kbd> by default; change it in `chrome://extensions/shortcuts`).

## Permissions
- `tabs`, `tabGroups`, and `storage` are required to manipulate, group, and persist rules for tabs.

## Contributing
Pull requests and suggestions are welcome!

## License
MIT 