// this loads the data from the api, deserializes it and passes it on to +page.svelte where it stands by for distribution
export async function load({fetch}) {
    const res = await fetch('acronyms');
    const data = await res.json();
    return {acronyms: data};
}
