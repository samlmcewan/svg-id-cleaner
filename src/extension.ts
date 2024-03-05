// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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
	  
		  let confirm = vscode.commands.registerCommand('svg-cleaner.confirm', () => {
		
			vscode.window.showInformationMessage('Command "cleanSVGIds" invoked!');
		});
	
		context.subscriptions.push(confirm);
	
		  const editor = vscode.window.activeTextEditor;
		  if (!editor || editor.document.languageId !== 'html') {
			return; // Only run in HTML files
		  }
	
		  const document = editor.document;
		  const text = document.getText();
	
		  let uniqueIdCounter = 0;
	
		  // Function to generate unique IDs
		  function generateUniqueID(): string {
			const prefix = `svg-id-${uniqueIdCounter++}-${Date.now().toString(36)}`;
			let randomString = '';
			for (let i = 0; i < 5; i++) {
			  randomString += Math.random().toString(36).substring(2); // Use random part of base 36 conversion
			}
			return prefix + randomString;
		  }
	
		 // Use a regular expression to find SVG elements and replace IDs
		const updatedText = text.replace(/<svg(\s+[^>]*?)>/g, (match, attributes) => {
			// Check for existing id attribute using regex
			const existingIdMatch = attributes.match(/id="([^"]*)"/);
			let id;

			if (existingIdMatch) {
			// Use existing ID if unique (within the current replacement)
			const existingId = existingIdMatch[1];
			// Check if the existing ID appears elsewhere in the updated text (using negative lookahead)
			if (!text.match(new RegExp(`<svg[^>]*?id="${existingId}"(?<!${existingId})`, 'g'))) {
				id = existingId; // Unique within current replacement
			} else {
				// If existing ID is not unique, generate a new one
				id = generateUniqueID();
			}
			} else {
			// If no existing ID, generate a new one
			id = generateUniqueID();
			}

			// Replace opening tag with new ID, removing existing id attribute
			return `<svg id="${id}" ${attributes.replace(/id="[^"]*"/, "")}>`;
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
