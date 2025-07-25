export function transformDateAddOneDay(dateString) {
  const date = new Date(new Date(dateString).getTime() + 86400000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
