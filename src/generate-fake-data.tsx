import { useState } from "react";
import { List, ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { generateRandomDOB, generateRandomSSN, getRandomBankDetails, getRandomName } from "./Utils/generateUtils";

export default function Command() {
  const [dob, setDob] = useState<string | undefined>(); // Date of birth
  const [isMinor, setIsMinor] = useState(false); // State for minor/adult
  const [name, setName] = useState(getRandomName()); // Name and gender
  const [ssn, setSsn] = useState<string>(generateRandomSSN(undefined, name.gender, isMinor)); // Generated SSN
  const [bankDetails, setBankDetails] = useState(getRandomBankDetails()); // IBAN and BIC
  const [isEditing, setIsEditing] = useState(false);

  // Function to regenerate data
  const regenerateData = (newDob?: string) => {
    const finalDob = newDob || dob || generateRandomDOB(isMinor);
    setDob(finalDob);
    setName(getRandomName());
    setSsn(generateRandomSSN(finalDob, name.gender, isMinor));
    setBankDetails(getRandomBankDetails());
    showToast({ style: Toast.Style.Success, title: "Data regenerated!" });
  };

  // If the user is in edit mode, display the form
  if (isEditing) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action
              title="Valider"
              onAction={() => {
                regenerateData(); // Use the updated date of birth
                setIsEditing(false); // Return to the main screen
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
            setDob(generateRandomDOB(newValue)); // Automatically generate a date
          }}
        />
        <Form.TextField
          id="dob"
          title="Date de naissance"
          placeholder="DD/MM/YYYY"
          value={dob}
          onChange={(newDob) => setDob(newDob)} // Allow manual date entry
        />
      </Form>
    );
  }

  // Main display
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
