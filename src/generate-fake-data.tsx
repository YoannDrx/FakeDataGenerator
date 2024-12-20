import { useState } from "react";
import { List, ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { generateRandomDOB, generateRandomSSN, getRandomBankDetails, getRandomName } from "./Utils/generateUtils";

export default function Command() {
  const [dob, setDob] = useState<string | undefined>(); // Date de naissance
  const [isMinor, setIsMinor] = useState(false); // État pour mineur/majeur
  const [name, setName] = useState(getRandomName()); // Nom et genre
  const [ssn, setSsn] = useState<string>(generateRandomSSN(undefined, name.gender, isMinor)); // SSN généré
  const [bankDetails, setBankDetails] = useState(getRandomBankDetails()); // IBAN et BIC
  const [isEditing, setIsEditing] = useState(false);

  // Fonction pour régénérer les données
  const regenerateData = (newDob?: string) => {
    const finalDob = newDob || dob || generateRandomDOB(isMinor);
    setDob(finalDob);
    setName(getRandomName());
    setSsn(generateRandomSSN(finalDob, name.gender, isMinor));
    setBankDetails(getRandomBankDetails());
    showToast({ style: Toast.Style.Success, title: "Données régénérées !" });
  };

  // Si l'utilisateur est en mode édition, afficher le formulaire
  if (isEditing) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action
              title="Valider"
              onAction={() => {
                regenerateData(); // Utilise la date de naissance mise à jour
                setIsEditing(false); // Retour à l'écran principal
              }}
            />
            <Action title="Annuler" onAction={() => setIsEditing(false)} />
          </ActionPanel>
        }
      >
        <Form.Checkbox
          id="isMinor"
          label="Générer une personne mineure"
          value={isMinor}
          onChange={(newValue) => {
            setIsMinor(newValue);
            setDob(generateRandomDOB(newValue)); // Génère une date automatiquement
          }}
        />
        <Form.TextField
          id="dob"
          title="Date de naissance"
          placeholder="DD/MM/YYYY"
          value={dob}
          onChange={(newDob) => setDob(newDob)} // Permet de renseigner manuellement une date
        />
        <Form.Description text={`Date actuelle : ${dob || "Non définie"}`} />
      </Form>
    );
  }

  // Affichage principal
  return (
    <List>
      <List.Section title="Informations Générées">
        <List.Item
          title="Nom et Prénom"
          subtitle={name.name}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard content={name.name} title="Copier le nom et prénom" />
            </ActionPanel>
          }
        />
        <List.Item
          title="Numéro de Sécurité Sociale"
          subtitle={ssn}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard content={ssn} title="Copier le SSN" />
            </ActionPanel>
          }
        />
        <List.Item
          title="IBAN"
          subtitle={bankDetails.iban}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard content={bankDetails.iban} title="Copier l'IBAN" />
            </ActionPanel>
          }
        />
        <List.Item
          title="BIC"
          subtitle={bankDetails.bic}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard content={bankDetails.bic} title="Copier le BIC" />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Actions">
        <List.Item
          title="Modifier les paramètres"
          subtitle={`Date : ${dob || "Non définie"} | ${isMinor ? "Mineur" : "Majeur"}`}
          actions={
            <ActionPanel>
              <Action title="Modifier" onAction={() => setIsEditing(true)} />
            </ActionPanel>
          }
        />
        <List.Item
          title="Régénérer les données"
          actions={
            <ActionPanel>
              <Action title="Régénérer" onAction={() => regenerateData()} />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
