import * as vscode from "vscode";

export class ConsoleLogHighlighter {
    private decorationType: vscode.TextEditorDecorationType;
    private logRegex = /console\s*\.\s*log\s*\([^)]*\)/g;

    constructor() {
        this.decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            border: "1px solid red",
            overviewRulerColor: "red",
            overviewRulerLane: vscode.OverviewRulerLane.Right
        });
    }

    public highlight(editor: vscode.TextEditor) {
        if (!editor || !editor.document) {
            return;
        }

        const text = editor.document.getText();
        const decorations: vscode.DecorationOptions[] = [];

        let match;
        this.logRegex.lastIndex = 0; // Reset regex state
        while ((match = this.logRegex.exec(text)) !== null) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(match.index + match[0].length);
            const decoration = { 
                range: new vscode.Range(startPos, endPos),
                hoverMessage: 'Console.log statement detected'
            };
            decorations.push(decoration);
        }

        editor.setDecorations(this.decorationType, decorations);
    }

    public clearHighlights(editor: vscode.TextEditor) {
        if (editor) {
            editor.setDecorations(this.decorationType, []);
        }
    }

    public dispose() {
        this.decorationType.dispose();
    }
}