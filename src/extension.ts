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

        const currentColor = getColorValue(colorToUpdate, context.extensionPath);
        const newColor = await vscode.window.showInputBox({
            prompt: `Enter new color for ${colorToUpdate} (hex format, e.g., #ffffff)`,
            value: currentColor,
            validateInput: (value) => {
                return /^#[0-9a-fA-F]{6}$/.test(value) ? null : 'Please enter a valid hex color (e.g., #ffffff)';
            }
        });

        if (newColor) {
            await updateThemeColor(colorToUpdate, newColor, context.extensionPath);
        }
    });

    context.subscriptions.push(updateColorsCommand);
}

function getColorValue(setting: string, extensionPath: string): string {
    const themePath = path.join(extensionPath, 'themes', 'colorful-light-color-theme.json');
    const themeContent = JSON.parse(fs.readFileSync(themePath, 'utf8'));

    if (setting.startsWith('syntax.')) {
        const tokenName = setting.split('.')[1];
        const token = themeContent.tokenColors.find((t: any) => 
            t.name.toLowerCase() === tokenName.charAt(0).toUpperCase() + tokenName.slice(1).toLowerCase()
        );
        return token ? token.settings.foreground : '#000000';
    } else {
        let key = setting;
        if (setting.includes('titleBar')) {
            key = setting.replace('background', 'activeBackground')
                       .replace('foreground', 'activeForeground');
        }
        return themeContent.colors[key] || '#000000';
    }
}

async function updateThemeColor(setting: string, color: string, extensionPath: string) {
    const themePath = path.join(extensionPath, 'themes', 'colorful-light-color-theme.json');
    
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
            let key = setting;
            if (setting.includes('titleBar')) {
                key = setting.replace('background', 'activeBackground')
                           .replace('foreground', 'activeForeground');
            }
            themeContent.colors[key] = color;
        }

        // Write the updated theme back to disk
        fs.writeFileSync(themePath, JSON.stringify(themeContent, null, 4));
        
        // Show success message and reload window
        vscode.window.showInformationMessage(`Updated ${setting} to ${color}. Reloading window...`);
        
        // Force reload the window after a short delay to ensure the file is written
        setTimeout(() => {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }, 500);
    } catch (error) {
        vscode.window.showErrorMessage('Failed to update theme color: ' + error);
        console.error(error);
    }
}

export function deactivate() {} 