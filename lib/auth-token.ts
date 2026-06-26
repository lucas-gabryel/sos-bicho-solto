const TOKEN_STORAGE_KEY = 'sos-bicho-solto:token';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getAuthToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string | null) {
  if (!isBrowser()) {
    return;
  }

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}
