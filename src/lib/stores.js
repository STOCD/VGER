import { writable } from "svelte/store";

import acr from '$lib/acronyms/acronyms.json';

export const activeTab = writable('Visual Glossary Educational Repository');

export const activeCard = writable('');

export const srcValue = writable('');

export const filtered = writable([]);

export const item_iterator = writable({});

export const active_settings = writable(false);

export const current_list = writable('');

export const settings_env = writable('');

export const settings_type = writable([]);

export const settings_av = writable([]);

export const settings_space_slot = writable([]);

export const settings_ground_slot = writable([]);

export const settings_rarity = writable([]);

export const settings_boundto = writable([]);

export const settings_boundwhen = writable([]);

//export const image_path = '/images/';   //for build

export const image_path = '/src/images/';   //for dev

export const icon_path = '/src/lib/settings/'; //for dev

//export const icon_path = '/icons/'; // for build

export const wiki_url = 'https://sto.fandom.com/wiki/';

export const acronyms = acr.content;