# Better Light Theme for VS Code

A modern, highly customizable light theme for Visual Studio Code that lets you personalize your coding environment with custom colors.

## Features

### 🎨 Default Color Scheme

#### UI Elements
- Clean white editor background (`#ffffff`) with dark text (`#2d2b55`)
- Light gray activity bar (`#f9f9f9`) with dark text (`#2d2b55`)
- Light gray sidebar (`#f3f3f3`) with dark text (`#2d2b55`)
- Green title bar (`#27ae60`) with white text (`#ffffff`)
- Green status bar (`#27ae60`) with white text (`#ffffff`)

#### Syntax Highlighting
- 💜 Keywords: Purple (`#8e44ad`)
- 💚 Strings: Teal (`#16a085`)
- 🔵 Functions: Blue (`#2980b9`)
- ❤️ Variables: Red (`#c0392b`)
- 🧡 Constants: Orange (`#e67e22`)
- 💚 Classes: Green (`#27ae60`)
- ⚫ Punctuation: Dark Gray (`#34495e`)
- 🔘 Comments: Light Gray (`#a0a1a7`)

## Installation

1. Install the theme from the VS Code Marketplace
2. Select the theme:
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type "Preferences: Color Theme"
   - Select "Better Light Theme"

## Color Customization

You can customize any color in the theme using the built-in color update command:

1. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "Better Light Theme: Update Colors"
3. Select the element you want to customize from the list
4. Enter the new color in hex format (e.g., #ffffff)
5. The window will automatically reload to apply your changes

### What You Can Customize

#### UI Elements
- Editor
  - Background color
  - Text color
- Activity Bar
  - Background color
  - Text color
- Side Bar
  - Background color
  - Text color
- Title Bar
  - Background color
  - Text color
- Status Bar
  - Background color
  - Text color

#### Syntax Colors
- Comments
- Strings
- Keywords
- Functions
- Variables
- Constants
- Classes
- Punctuation

### Color Format

Colors must be specified in hex format:
- Start with # symbol
- Followed by 6 characters (0-9 or a-f)
- Examples: 
  - `#ffffff` (white)
  - `#000000` (black)
  - `#ff0000` (red)
  - `#00ff00` (green)
  - `#0000ff` (blue)
  - `#27ae60` (theme green)

## Tips

- Use high contrast colors for better readability
- Match UI element colors for a cohesive look (like the green title and status bars)
- Consider using your company or project colors for a personalized theme
- Test your color choices with different file types to ensure good visibility
- After each color change, VS Code will automatically reload to apply the changes

## Troubleshooting

If colors are not updating:
1. Make sure you're entering valid hex color codes (e.g., #ffffff)
2. Wait for the window to reload after making changes
3. If changes still don't appear, try:
   - Selecting a different theme and then selecting "Better Light Theme" again
   - Running the "Developer: Reload Window" command from the Command Palette