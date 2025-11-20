export function serializeParams(paramsObj = {}) {
  const parts = [];

  const append = (key, val) => {
    if (val === undefined || val === null || val === "") return;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
  };

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => append(key, v));
    } else {
      append(key, value);
    }
  });

  return parts.join("&");
}

export default serializeParams;