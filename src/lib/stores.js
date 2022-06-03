import { writable } from "svelte/store";

export const activeTab = writable('Visual Glossary Educational Repository');

export const activeCard = writable('');

export const srcValue = writable('');

export const filtered = writable([]);

export const item_iterator = writable({});

export const active_settings = writable(false);

export const image_path = '/images/';   //for build

//export const image_path = '/src/images/';   //for dev

//export const icon_path = '/src/lib/settings/'; //for dev

export const icon_path = '/icons/'; // for build

export const wiki_url = 'https://sto.fandom.com/wiki/';