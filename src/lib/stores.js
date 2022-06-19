const dev_path = '/src';    // for dev

//const dev_path = '';      // for build

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

export const image_path = dev_path + '/images/';

export const icon_path = dev_path + '/icons/';

export const wiki_url = 'https://sto.fandom.com/wiki/';