// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Create a status bar item (button)
    const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarButton.text = "$(zap) Clean SVG IDs";
    statusBarButton.tooltip = "Click to clean SVG IDs";
    statusBarButton.command = 'svg-cleaner.cleanSVGIds';

    // Add the button to the status bar
    statusBarButton.show();

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "svg-cleaner" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('svg-cleaner.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('SVG Cleaner is now active!');
    });

    context.subscriptions.push(disposable);

    try {
        const assignUniqueIdsCommand = vscode.commands.registerCommand('svg-cleaner.cleanSVGIds', () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'html') {
                return; // Only run in HTML files
            }

            const document = editor.document;
            const text = document.getText();

            let uniqueIdCounter = 0;

            // Function to generate unique IDs with alphanumeric characters (base 36)
            function generateUniqueID(): string {
                const prefix = `svg-id-${uniqueIdCounter++}-`;
                let randomString = ''; // Declare randomString as an empty string
                for (let i = 0; i < 5; i++) {
                    randomString += Math.floor(Math.random() * 36).toString(36); // Use random integer and convert to base 36
                }
                return prefix + randomString;
            }

            // Use a regular expression to find SVG elements and replace IDs
            const updatedText = text.replace(/<svg(\s+[^>]*?)>([\s\S]*?)<\/svg>/g, (match, attributes, content) => {
                // Generate a unique ID for the SVG element
                const svgId = generateUniqueID();
                // Replace IDs in the content of the SVG element
                const updatedContent = content.replace(/\b(?:id=["']([^"']+)["'])/g, (subMatch: string, id: string) => {
                    // Generate a unique ID for each nested element
                    const newId = generateUniqueID();
                    return subMatch.replace(id, newId);
					
                });
                // Replace opening tag with new ID, removing existing id attribute
                return `<svg id="${svgId}" ${attributes.replace(/id="[^"]*"/, "").trim()}>${updatedContent}</svg>`;

            });

            // Update the document with unique IDs
            editor.edit(editBuilder => {
                editBuilder.replace(new vscode.Range(document.positionAt(0), document.positionAt(text.length)), updatedText);
            });

            vscode.window.showInformationMessage('Unique IDs assigned to SVG elements');
        });

        context.subscriptions.push(assignUniqueIdsCommand);
    } catch (error) {
        console.error('Error activating extension:', error);
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
