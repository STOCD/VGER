import { writable } from 'svelte/store';

import acr from '../data/acronyms.json';

export const acronyms = acr.content;

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

export const mobile_auto = writable(false);

export const mobile_override = writable('auto');

export const mobile = writable(false);

export const mobile_menu_active = writable(false);

export const mobile_sidebar_active = writable(false);

export const mobile_description = writable('');

//export const image_path = '/images/'; // for build

//export const icon_path = '/icons/';     // for build

export const image_path = '/src/images/'; // for dev

export const icon_path = '/src/icons/';     // for dev

export const wiki_url = 'https://sto.fandom.com/wiki/';