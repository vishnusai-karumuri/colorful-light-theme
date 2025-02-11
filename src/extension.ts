import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface ColorSettings {
    background?: string;
    foreground?: string;
}

interface SyntaxColors {
    comments: string;
    strings: string;
    keywords: string;
    functions: string;
    variables: string;
    constants: string;
    classes: string;
    punctuation: string;
}

export function activate(context: vscode.ExtensionContext) {
    // Register the color update command
    let updateColorsCommand = vscode.commands.registerCommand('betterLightTheme.updateColors', async () => {
        const colorOptions = [
            'editor.background',
            'editor.foreground',
            'activityBar.background',
            'activityBar.foreground',
            'sideBar.background',
            'sideBar.foreground',
            'titleBar.background',
            'titleBar.foreground',
            'statusBar.background',
            'statusBar.foreground',
            'syntax.comments',
            'syntax.strings',
            'syntax.keywords',
            'syntax.functions',
            'syntax.variables',
            'syntax.constants',
            'syntax.classes',
            'syntax.punctuation'
        ];

        const colorToUpdate = await vscode.window.showQuickPick(colorOptions, {
            placeHolder: 'Select a color to update'
        });

        if (!colorToUpdate) {
            return;
        }

        const currentColor = getColorValue(colorToUpdate);
        const newColor = await vscode.window.showInputBox({
            prompt: `Enter new color for ${colorToUpdate} (hex format, e.g., #ffffff)`,
            value: currentColor,
            validateInput: (value) => {
                return /^#[0-9a-fA-F]{6}$/.test(value) ? null : 'Please enter a valid hex color (e.g., #ffffff)';
            }
        });

        if (newColor) {
            await updateThemeColor(colorToUpdate, newColor);
        }
    });

    // Watch for configuration changes
    let configChangeDisposable = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('betterLightTheme.colors')) {
            updateThemeFromSettings();
        }
    });

    context.subscriptions.push(updateColorsCommand, configChangeDisposable);
}

function getColorValue(setting: string): string {
    const themePath = path.join(__dirname, '../themes/colorful-light-color-theme.json');
    const themeContent = JSON.parse(fs.readFileSync(themePath, 'utf8'));

    if (setting.startsWith('syntax.')) {
        const tokenName = setting.split('.')[1];
        const token = themeContent.tokenColors.find((t: any) => 
            t.name.toLowerCase() === tokenName.charAt(0).toUpperCase() + tokenName.slice(1).toLowerCase()
        );
        return token ? token.settings.foreground : '#000000';
    } else {
        const key = setting.replace('background', 'Background')
                         .replace('foreground', 'Foreground')
                         .replace('titleBar.', 'titleBar.active');
        return themeContent.colors[key] || '#000000';
    }
}

function updateThemeFromSettings() {
    const config = vscode.workspace.getConfiguration('betterLightTheme.colors');
    const themePath = path.join(__dirname, '../themes/colorful-light-color-theme.json');
    
    try {
        const themeContent = JSON.parse(fs.readFileSync(themePath, 'utf8'));
        let hasChanges = false;

        // Update UI colors
        const uiElements = ['editor', 'activityBar', 'sideBar', 'titleBar', 'statusBar'];
        for (const element of uiElements) {
            const background = config.get(`${element}.background`);
            const foreground = config.get(`${element}.foreground`);
            
            if (background) {
                const key = `${element}.background`.replace('titleBar.', 'titleBar.active');
                if (themeContent.colors[key] !== background) {
                    themeContent.colors[key] = background;
                    hasChanges = true;
                }
            }
            
            if (foreground) {
                const key = `${element}.foreground`.replace('titleBar.', 'titleBar.active');
                if (themeContent.colors[key] !== foreground) {
                    themeContent.colors[key] = foreground;
                    hasChanges = true;
                }
            }
        }

        // Update syntax colors
        const syntaxElements = ['comments', 'strings', 'keywords', 'functions', 'variables', 'constants', 'classes', 'punctuation'];
        for (const element of syntaxElements) {
            const color = config.get(`syntax.${element}`);
            if (color) {
                const token = themeContent.tokenColors.find((t: any) => 
                    t.name.toLowerCase() === element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()
                );
                if (token && token.settings.foreground !== color) {
                    token.settings.foreground = color;
                    hasChanges = true;
                }
            }
        }

        if (hasChanges) {
            fs.writeFileSync(themePath, JSON.stringify(themeContent, null, 4));
            vscode.window.showInformationMessage('Theme colors updated');
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    } catch (error) {
        vscode.window.showErrorMessage('Failed to update theme colors: ' + error);
        console.error(error);
    }
}

async function updateThemeColor(setting: string, color: string) {
    const themePath = path.join(__dirname, '../themes/colorful-light-color-theme.json');
    
    try {
        const themeContent = JSON.parse(fs.readFileSync(themePath, 'utf8'));

        if (setting.startsWith('syntax.')) {
            const tokenName = setting.split('.')[1];
            const token = themeContent.tokenColors.find((t: any) => 
                t.name.toLowerCase() === tokenName.charAt(0).toUpperCase() + tokenName.slice(1).toLowerCase()
            );
            if (token) {
                token.settings.foreground = color;
            }
        } else {
            const key = setting.replace('background', 'Background')
                             .replace('foreground', 'Foreground')
                             .replace('titleBar.', 'titleBar.active');
            themeContent.colors[key] = color;
        }

        // Write the updated theme back to disk
        fs.writeFileSync(themePath, JSON.stringify(themeContent, null, 4));
        
        // Update the corresponding setting
        const settingPath = `betterLightTheme.colors.${setting}`;
        try {
            await vscode.workspace.getConfiguration().update(settingPath, color, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Updated ${setting} to ${color}`);
        } catch (error) {
            // If updating the setting fails, still show the theme changes
            vscode.window.showInformationMessage(`Updated ${setting} to ${color}`);
        }
        
        // Reload window to apply changes
        vscode.commands.executeCommand('workbench.action.reloadWindow');
    } catch (error) {
        vscode.window.showErrorMessage('Failed to update theme color: ' + error);
        console.error(error);
    }
}

export function deactivate() {} 