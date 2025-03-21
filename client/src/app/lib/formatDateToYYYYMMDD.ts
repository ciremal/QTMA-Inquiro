export const formatDateToYYYYMMDD = (dateInput: string | number | Date) => {
  // Ensure the input is a Date object
  const date = new Date(dateInput);

  // Get year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  // Return the formatted date
  return `${year}-${month}-${day}`;
};
