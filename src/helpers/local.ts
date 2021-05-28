// Local clientSided storage for caching
export let local: Storage;
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
  local = window.localStorage;
}
export function setLocal(key: string, data: any) {
  const jsonData = JSON.stringify(data);
  if (!local) return;

  local.setItem(key, jsonData);
}
export function getLocal(key: string) {
  if (!local) return;

  const raw = local.getItem(key);
  if (!raw) return;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function removeLocal(key: string) {
  if (!local) return;

  local.removeItem(key);
}

export function updateLocal(key: string, data: any) {
  const localData = getLocal(key) || {};
  const mergedData = { ...localData, ...data };
  setLocal(key, mergedData);
}
