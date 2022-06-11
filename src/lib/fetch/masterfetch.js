import st from '$lib/fetch/starship_traits.json';
import t from '$lib/fetch/traits.json';
let starship_trait_json = st.content;
let trait_json = t.content;
export let data = {};
let starship_trait_object = {};

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
data.starship_traits = [];
for (let j = 0; j<starship_trait_list.length; j++) {
    let current_trait = starship_trait_object[starship_trait_list[j]]
    data.starship_traits.push({'name': starship_trait_list[j], 'type':'Starship Trait', 'obtained': current_trait.obtained, 'desc': compensate_wiki_description(current_trait.desc)});
}

data.personal_traits = [];
let specialization_traits = {
    'Arrest':'Constable (specialization)','Command Frequency':'Command Officer (specialization)',
    'Demolition Teams':'Commando (specialization)','Going the Extra Mile':'Miracle Worker (specialization)',
    'Predictive Algorithms':'Intelligence Officer (specialization)','Pedal to the Metal':'Pilot (specialization)',
    'Unconventional Tactics':'Strategist (specialization)','Critical Systems':'Temporal Agent Recruitment',
    "Hunter's Instinct":'Klingon Recruitment','Temporal Insight':'Delta Recruitment'
}
for (let i2 = 0; i2 < trait_json.length; i2++) {
    let current_page = trait_json[i2];
    if ('chartype' in current_page && current_page['chartype'] == 'char') {
        if ('name' in current_page && current_page['name'] != '') {
            if ('type' in current_page && current_page['type'].toLowerCase() == 'starship') {
                let obtained = ['Infinity Prize Pack: Starship Trait'];
                if (current_page['name'] in specialization_traits) {
                    obtained = [specialization_traits[current_page['name']]];
                }
                data.starship_traits.push({'name': current_page['name'], 'type':'Starship Trait', 'obtained': obtained, 'desc': compensate_wiki_description(current_page.description)});
            }
            else {
                let type = '';
                let environment = 'space';
                let display_type = '';
                let availability = '';
                let availability_type = '';
                if ('environment' in current_page) {
                    environment = current_page['environment'];
                }
                if ('type' in current_page && current_page['type'].toLowerCase() == 'reputation')  {
                    type = 'reputation';
                    display_type = environment.substring(0,1).toUpperCase()+environment.substring(1)+' Reputation Trait';
                }
                else if ('type' in current_page && current_page['type'].toLowerCase() == 'activereputation') {
                    type = 'activereputation';
                    display_type = 'Active '+environment.substring(0,1).toUpperCase()+environment.substring(1)+' Reputation Trait';
                }
                else {
                    type = 'personal';
                    display_type = 'Personal '+environment.substring(0,1).toUpperCase()+environment.substring(1)+' Trait';
                }
                if ('required' in current_page && current_page['required'].length > 0 && current_page['required'][0] !== '') {
                    availability = current_page['required'].join(', ');
                    availability_type = 'innate';
                }
                else if ('possible' in current_page && current_page['possible'].length > 0 && current_page['possible'][0] === '') {
                    availability_type = 'other';
                }
                else if ('possible' in current_page && current_page['possible'].length > 0 && current_page['possible'][0] !== '') {
                    availability = current_page['possible'].join(', ');
                    availability_type = 'species';
                }
                data.personal_traits.push({'name': current_page['name'], 'type':type, 'environment':environment, 'display_type':display_type, 'desc': compensate_wiki_description(current_page.description), 'availability':availability, 'availability_type':availability_type});
            }
        }
    }
}