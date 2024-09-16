export const isBrowser = typeof localStorage !== 'undefined';

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
	if (isBrowser) {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	}
	return defaultValue;
}

export function setToLocalStorage<T>(key: string, value: T): void {
	if (isBrowser) {
		localStorage.setItem(key, JSON.stringify(value));
	}
}

export function removeFromLocalStorage(key: string): void {
	if (isBrowser) {
		localStorage.removeItem(key);
	}
}
