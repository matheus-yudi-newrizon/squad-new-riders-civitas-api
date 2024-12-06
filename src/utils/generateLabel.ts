export function generateLabel(date: Date): string {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const [{ value: day }, , { value: month }, , { value: year }, , { value: hours }, , { value: minutes }] = formatter.formatToParts(date);

  return `ADI${day}_${month}_${year}_${hours}h${minutes}`;
}
