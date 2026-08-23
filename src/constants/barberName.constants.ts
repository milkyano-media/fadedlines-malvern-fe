// Barbers whose Square profile name differs from the name they go by publicly.
// Keys are matched against the uppercased Square name (display_name or full name).
export const BARBER_NAME_OVERRIDES: { [key: string]: string } = {
  "ABDULLAH ANSARI": "Ansari",
};

/**
 * Applies a public-name override if the barber has one, otherwise returns the
 * name untouched.
 */
export const applyBarberNameOverride = (fullName: string): string => {
  const upperName = fullName.toUpperCase();
  for (const [key, value] of Object.entries(BARBER_NAME_OVERRIDES)) {
    if (upperName.includes(key)) return value;
  }
  return fullName;
};

/**
 * Short public-facing barber name. Square display names carry extra noise
 * ("Humza (Available Now)", "JOSH IG@josh_blendz_(AvailableNow)"), so the first
 * word is the default - overrides win for barbers who go by a different name.
 *
 * Also used as the Square catalog search keyword, since services are named
 * "Haircut by <public name>".
 */
export const getBarberDisplayName = (fullName: string): string => {
  const overridden = applyBarberNameOverride(fullName);
  return overridden === fullName ? fullName.split(" ")[0] : overridden;
};
