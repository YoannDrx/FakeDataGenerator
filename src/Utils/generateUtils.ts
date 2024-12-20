import { bankDetails } from "../data/bank";
import { lastNamesDatabase } from "../data/lastNames";
import { namesDatabase } from "../data/names";

// Random generation of names with gender
export function getRandomName(): { name: string; gender: "male" | "female" } {
  const gender = Math.random() < 0.5 ? "male" : "female"; // Equal probability for male/female
  const firstNames = namesDatabase[gender];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNamesDatabase[Math.floor(Math.random() * lastNamesDatabase.length)];
  return { name: `${firstName} ${lastName}`, gender };
}

// Generate a random date of birth based on minor/adult
export function generateRandomDOB(isMinor: boolean): string {
  const currentYear = new Date().getFullYear();
  const minYear = isMinor ? currentYear - 18 : currentYear - 99;
  const maxYear = isMinor ? currentYear : currentYear - 18;

  const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;

  return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
}

// Generate a random SSN based on gender
export function generateRandomSSN(dob?: string, gender?: "male" | "female", isMinor?: boolean): string {
  const currentYear = new Date().getFullYear();
  let year: string | undefined;
  let month: string | undefined;

  if (dob) {
    const parts = dob.split("/");
    if (parts.length === 3) {
      const parsedYear = parseInt(parts[2], 10);
      const parsedMonth = parseInt(parts[1], 10);

      if (!isNaN(parsedYear) && !isNaN(parsedMonth)) {
        year = (parsedYear % 100).toString().padStart(2, "0");
        month = parsedMonth.toString().padStart(2, "0");
      }
    }
  }

  if (!year || !month) {
    // If no date is given, or if parsing fails, generate a random date
    const maxYear = isMinor ? currentYear : currentYear - 18; // Minor: this year, otherwise 18 years
    const minYear = isMinor ? currentYear - 18 : maxYear - 81; // Minor: max 18 years, otherwise 99 years
    const randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;

    year = (randomYear % 100).toString().padStart(2, "0");
    month = Math.floor(Math.random() * 12 + 1)
      .toString()
      .padStart(2, "0");
  }

  const department = Math.floor(Math.random() * 95 + 1)
    .toString()
    .padStart(2, "0");
  const commune = Math.floor(Math.random() * 999 + 1)
    .toString()
    .padStart(3, "0");
  const order = Math.floor(Math.random() * 999 + 1)
    .toString()
    .padStart(3, "0");

  const prefix = gender === "male" ? "1" : "2"; // Prefix based on gender
  const baseSSN = `${prefix}${year}${month}${department}${commune}${order}`;
  const key = (97 - (parseInt(baseSSN, 10) % 97)).toString().padStart(2, "0");

  return `${baseSSN}${key}`;
}

// Random generation of IBAN and BIC
export function getRandomBankDetails() {
  const randomIndex = Math.floor(Math.random() * bankDetails.length);
  return bankDetails[randomIndex];
}
