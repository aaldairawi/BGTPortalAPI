export const dateObjectOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};

// Create a date helper method that converts the date time from the backend to a yyyy-mm-dd.

export const dateTimeToStringFormatted = (date: string) => {
  const dateConverted = new Date(date);

  const year = dateConverted.getFullYear();
  const month = String(dateConverted.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(dateConverted.getDate()).padStart(2, "0");

  const hours = String(dateConverted.getHours()).padStart(2, "0");
  const minutes = String(dateConverted.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};



export const formatDateParam = (d: Date): string =>
  [
    d.getFullYear(),
    (d.getMonth() + 1).toString().padStart(2, "0"),
    d.getDate().toString().padStart(2, "0"),
  ].join("-");
