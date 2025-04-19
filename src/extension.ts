import * as vscode from 'vscode';
import axios from 'axios';

// Fonction pour activer l'extension
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension activée !');

    // Enregistrement de la commande
    let disposable = vscode.commands.registerCommand('extension.generateText', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            if (selectedText) {
                // Afficher un message de statut pour informer l'utilisateur
                vscode.window.setStatusBarMessage('Génération du texte en cours...', 5000);

                try {
                    // Appel à l'API pour générer du texte
                    const response = await generateText(selectedText);

                    // Insérer le texte généré dans l'éditeur
                    insertGeneratedText(editor, response);
                    // Afficher une notification de succès
                    vscode.window.showInformationMessage('Réponse générée avec succès.');
                } catch (error) {
                    console.error(error);
                    // Afficher une notification d'erreur en cas de problème
                    vscode.window.showErrorMessage('Erreur lors de la génération du texte. Veuillez réessayer.');
                }
            } else {
                // Avertir l'utilisateur si aucun texte n'est sélectionné
                vscode.window.showWarningMessage('Aucun texte sélectionné. Veuillez sélectionner du texte.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

// Fonction pour générer du texte via l'API Flask
async function generateText(prompt: string): Promise<string> {
    try {++++++++++
        // Remplacez l'URL par celle de votre serveur Flask exposé par ngrok
        const response = await axios.post('https://bc8d-34-143-175-254.ngrok-free.app/generate', { prompt });
        return response.data.response;
    } catch (error) {
        // Si une erreur se produit, on la lance pour qu'elle soit captée dans la fonction appelante
        throw new Error('Erreur lors de l’appel à l’API.');
    }
}

// Fonction pour insérer le texte généré dans l'éditeur
function insertGeneratedText(editor: vscode.TextEditor, generatedText: string) {
    const selection = editor.selection;

    // Créer un format pour l'insertion : un commentaire avec la réponse générée
    const formattedText = `\n// Réponse générée : ${generatedText}\n`;

    // Insertion après le texte sélectionné
    editor.edit(editBuilder => {
        editBuilder.insert(selection.end, formattedText);
    });
}
