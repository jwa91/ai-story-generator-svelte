import { writable } from 'svelte/store';
import type { ChildData } from '$lib/types/story';
import {
	getFromLocalStorage,
	setToLocalStorage,
	removeFromLocalStorage
} from '$lib/utils/localStorageHelper';

const initialChildData: ChildData = {
	childName: '',
	childAge: 7,
	childInterests: '',
	childChapters: 6,
	childTensionLevel: 5,
	childAgreement: false
};

const initialSettingId = '';

function createStoryStore() {
	const storedChildData = getFromLocalStorage('childData', initialChildData);
	const storedSettingId = getFromLocalStorage('settingId', initialSettingId);

	const childDataStore = writable<ChildData>(storedChildData);
	const settingIdStore = writable<string>(storedSettingId);

	return {
		subscribeChildData: childDataStore.subscribe,
		subscribeSettingId: settingIdStore.subscribe,
		updateChildData: (data: Partial<ChildData>) => {
			childDataStore.update((store) => {
				const newStore = { ...store, ...data };
				setToLocalStorage('childData', newStore);
				return newStore;
			});
		},
		updateSettingId: (id: string) => {
			settingIdStore.set(id);
			setToLocalStorage('settingId', id);
		},
		reset: () => {
			childDataStore.set(initialChildData);
			settingIdStore.set(initialSettingId);
			removeFromLocalStorage('childData');
			removeFromLocalStorage('settingId');
		}
	};
}

export const storyStore = createStoryStore();

export function updateChildData(data: Partial<ChildData>) {
	storyStore.updateChildData(data);
}

export function updateSettingId(id: string) {
	storyStore.updateSettingId(id);
}
