export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
) => {
  if (!data || !data.length) return;

  const replacer = (_key: string, value: unknown) =>
    value === null ? '' : value;
  const header = Object.keys(data[0]);
  const csv = [
    header.join(','), // header
    ...data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(','),
    ),
  ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
