const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const SESSION_COOKIE_VALUE = 'active';

export const SESSION_COOKIE_NAME = 'sos-bicho-solto-session';

function canUseDocument() {
  return typeof document !== 'undefined';
}

export function startClientSession() {
  if (!canUseDocument()) {
    return;
  }

  document.cookie = `${SESSION_COOKIE_NAME}=${SESSION_COOKIE_VALUE}; Path=/; Max-Age=${ONE_DAY_IN_SECONDS}; SameSite=Lax`;
}

export function clearClientSession() {
  if (!canUseDocument()) {
    return;
  }

  document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
