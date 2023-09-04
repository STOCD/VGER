// this loads the data from the api, deserializes it and passes it on to +page.svelte where it stands by for distribution
export async function load({fetch}) {
    let start = performance.now();
    const res = await fetch('/api/cargo');
    const data = await res.json();
    const res2 = await fetch('acronyms.json'); //#~# 'src/data/acronyms.json' for dev | 'acronyms.json' for build
    const data2 = await res2.json();
    console.log(performance.now()-start);
    return [data, data2];
  }
