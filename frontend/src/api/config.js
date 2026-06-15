const BASE =
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  '';

export const API_BASE = BASE;
