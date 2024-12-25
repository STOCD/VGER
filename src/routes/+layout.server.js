// this loads the data from the api, deserializes it and passes it on to +page.svelte where it stands by for distribution
export async function load({ fetch }) {
    return {
        acronyms: fetch('api/acronyms').then(result => result.json()),
        traits: fetch('api/traits').then(result => result.json()),
        starship_traits: fetch('api/starship-traits').then(result => result.json()),
        equipment: fetch('api/equipment').then(result => result.json())
    };
}
