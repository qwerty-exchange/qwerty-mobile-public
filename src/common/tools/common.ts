export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const range = (n: number) => [...Array.from({ length: n }).keys()];

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const makeUnique = (values: string[]) => {
  const newValues = [...new Set(values)];
  return newValues;
};

export const keyToUrl = (args: any): string => args.filter(Boolean).join('/');

export const parseJSONToObject = (data?: string | null) => {
  try {
    if (!data) {
      return;
    }
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const convertJSONFormDataToFormData = (data: { _parts: string[][] }) => {
  const formData = new FormData();

  const { _parts } = data;

  for (const [key, value] of _parts) {
    formData.append(key, value);
  }

  return formData;
};
