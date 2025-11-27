/**
 * Formats a date to DD-MM-YYYY string
 * @param date - Date object, ISO string, or undefined
 * @returns Formatted date string (DD-MM-YYYY) or empty string if invalid
 */
export const formatToDDMMYYYY = (date: Date | string | undefined): string => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * Converts between date formats (DD-MM-YYYY ↔ YYYY-MM-DD)
 * @param dateString - Date string to convert
 * @param fromFormat - Source format ('DD-MM-YYYY' or 'YYYY-MM-DD')
 * @param toFormat - Target format ('DD-MM-YYYY' or 'YYYY-MM-DD')
 * @returns Converted date string or empty string if invalid
 */
export const convertDateFormat = (
  dateString: string,
  fromFormat: "DD-MM-YYYY" | "YYYY-MM-DD",
  toFormat: "DD-MM-YYYY" | "YYYY-MM-DD"
): string => {
  if (!dateString) return "";

  const parts = dateString.split("-");

  if (
    fromFormat === "DD-MM-YYYY" &&
    (parts.length !== 3 ||
      parts[0].length !== 2 ||
      parts[1].length !== 2 ||
      parts[2].length !== 4)
  ) {
    return "";
  }

  if (
    fromFormat === "YYYY-MM-DD" &&
    (parts.length !== 3 ||
      parts[0].length !== 4 ||
      parts[1].length !== 2 ||
      parts[2].length !== 2)
  ) {
    return "";
  }

  if (fromFormat === toFormat) return dateString;

  return fromFormat === "DD-MM-YYYY"
    ? `${parts[2]}-${parts[1]}-${parts[0]}` // DD-MM-YYYY → YYYY-MM-DD
    : `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD → DD-MM-YYYY
};

/**
 * Formats date to locale-specific string (Indonesian format)
 * @param date - Date object or string
 * @returns Locale-formatted date string or original string if invalid
 */
export const formatToLocaleDate = (date: Date | string): string => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return typeof date === "string" ? date : "";

    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return typeof date === "string" ? date : "";
  }
};

/**
 * Converts ISO date string to YYYY-MM-DD format for date inputs
 * @param isoString - Date in ISO format (from database)
 * @returns Date in YYYY-MM-DD format or empty string if invalid
 */
export const formatDateForInput = (isoString: string | undefined): string => {
  if (!isoString) return "";
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};