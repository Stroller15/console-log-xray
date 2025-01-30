import * as vscode from "vscode";
import { ConsoleLogHighlighter } from "./highlighter";

let highlighter: ConsoleLogHighlighter;
let isHighlightingEnabled = false;

export function activate(context: vscode.ExtensionContext) {
    highlighter = new ConsoleLogHighlighter();

    // Register the command
    let scanCommand = vscode.commands.registerCommand('console-log-xray.scan', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            isHighlightingEnabled = !isHighlightingEnabled;
            if (isHighlightingEnabled) {
                highlighter.highlight(activeEditor);
                vscode.window.showInformationMessage('Console.log scanning enabled');
            } else {
                highlighter.clearHighlights(activeEditor);
                vscode.window.showInformationMessage('Console.log scanning disabled');
            }
        } else {
            vscode.window.showWarningMessage('No active editor found');
        }
    });

    // Listen for document changes
    let changeSubscription = vscode.workspace.onDidChangeTextDocument(event => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && event.document === activeEditor.document && isHighlightingEnabled) {
            highlighter.highlight(activeEditor);
        }
    });

    context.subscriptions.push(scanCommand, changeSubscription);
}

export function deactivate() {
    if (highlighter) {
        highlighter.dispose();
    }
}