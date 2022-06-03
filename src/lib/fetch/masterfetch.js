import content from '$lib/fetch/starship_traits.json';
export let starship_traits = [];
let starship_trait_json = content.content;
let starship_trait_object = new Object();

function compensate_wiki_description(text) {
    text = text.replaceAll('&lt;', '<').replaceAll('&gt;','>');
    text = text.replaceAll('{{ucfirst: ','').replaceAll('{{ucfirst:','');
    text = text.replaceAll('{{lc: ','').replaceAll('{{lc:','');
    text = text.replaceAll('{{','').replaceAll('}}','');
    text = text.replaceAll('&amp;','&').replaceAll('&#42;','*');
    while (text.includes('[[') && text.includes('|')) {
      let start = text.indexOf('[[');
      let end = text.indexOf('|');
      text = text.slice(0, start) + text.slice(end+1, text.length-1);
    }
    text = text.replaceAll('[[','').replaceAll(']]','');
    return text;
  }
  
// cache starship traits
for (let i = 0; i<starship_trait_json.length; i++) {
    const current_page = starship_trait_json[i];
    if ('trait' in current_page && current_page.trait != '') {
        if (! Object.keys(starship_trait_object).includes(current_page.trait)) {
            starship_trait_object[current_page.trait] = {'desc':current_page.traitdesc, 'obtained':[current_page._pageName], 'type':'Starship Trait'};
        }
        else {
            starship_trait_object[current_page.trait]['obtained'].push(current_page._pageName);
        }
    }
    if ('trait2' in current_page && current_page.trait2 != '') {
        if (! Object.keys(starship_trait_object).includes(current_page.trait2)) {
            starship_trait_object[current_page.trait2] = {'desc':current_page.traitdesc2, 'obtained':[current_page._pageName], 'type':'Starship Trait'};
        }
        else {
            starship_trait_object[current_page.trait2]['obtained'].push(current_page._pageName);
        }
    }
    if ('trait3' in current_page && current_page.trait3 != '') {
        if (! Object.keys(starship_trait_object).includes(current_page.trait3)) {
            starship_trait_object[current_page.trait3] = {'desc':current_page.traitdesc3, 'obtained':[current_page._pageName], 'type':'Starship Trait'};
        }
        else {
            starship_trait_object[current_page.trait3]['obtained'].push(current_page._pageName);
        }
    }
    if ('acctrait' in current_page && current_page.acctrait != '') {
        if (! Object.keys(starship_trait_object).includes(current_page.acctrait)) {
            starship_trait_object[current_page.acctrait] = {'desc':current_page.acctraitdesc, 'obtained':[current_page._pageName], 'type':'Starship Trait'};
        }
        else {
            starship_trait_object[current_page.acctrait]['obtained'].push(current_page._pageName);
        }
    }
}

let starship_trait_list = Object.keys(starship_trait_object)
for (let j = 0; j<starship_trait_list.length; j++) {
    let current_trait = starship_trait_object[starship_trait_list[j]]
    starship_traits.push({'name': starship_trait_list[j], 'type':'Starship Trait', 'obtained': current_trait.obtained, 'desc': compensate_wiki_description(current_trait.desc)});
}
//console.log(starship_traits);