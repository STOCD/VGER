export const equipment_types_space = [
    'Ship Fore Weapon', 'Ship Aft Weapon', 'Ship Device', 'Hangar Bay', 'Experimental Weapon',
    'Ship Deflector Dish', 'Ship Secondary Deflector', 'Impulse Engine', 'Warp Engine', 'Singularity Engine', 'Ship Shields',
    'Ship Tactical Console', 'Ship Science Console', 'Ship Engineering Console','Ship Weapon', 'Universal Console'
];
export const equipment_types_ground = [
    'Kit', 'Body Armor', 'EV Suit', 'Personal Shield', 'Ground Weapon', 'Ground Device', 'Kit Module'
];
export const rarities = ['Epic','Ultra Rare','Very Rare','Rare','Uncommon','Common'];

export const wikihttp = 'https://sto.fandom.com/wiki';
export const filepath = '/Special:FilePath/';
export const image_suffix = '_icon.png';

//cleans item descriptions from wiki-specific format tags and replaces html tags
export function compensate_wiki_description(text) {
    if (text == '') {return text}
    else if (text == null) {return ''}
    if (text[0] == ':') {
        text = text.slice(1);
    }
    if (text[0] == ' ') {
        text = text.slice(1);
    }
    text = text.replaceAll('&lt;', '<').replaceAll('&gt;','>');
    text = text.replaceAll('{{ucfirst: ','').replaceAll('{{ucfirst:','');
    text = text.replaceAll('{{lc: ','').replaceAll('{{lc:','');
    text = text.replaceAll('{{','').replaceAll('}}','');
    text = text.replaceAll('&amp;','&').replaceAll('&#42;','*');
    text = text.replace(/^\*(?<line>.+?)(?=(\n)|$)/, '<ul><li>$<line></li></ul>');
    text = text.replaceAll(/::+?/g, ':');
    text = text.replaceAll('\n:*', '\n*');
    text = text.replaceAll(/(?<=(\n\*\*\*))(?<line>.+?)(?=(\n)|$)/g, '<ul><ul><ul><li>$<line></li></ul></ul></ul>');
    text = text.replaceAll('\n***', '');
    text = text.replaceAll(/(?<=(\n\*\*))(?<line>.+?)(?=(\n)|$)/g, '<ul><ul><li>$<line></li></ul></ul>');
    text = text.replaceAll('\n**', '');
    text = text.replaceAll(/(?<=(\n\*))(?<line>.+?)(?=(\n)|$)/g, '<ul><li>$<line></li></ul>');
    text = text.replaceAll('\n*', '');
    text = text.replaceAll(/\[\[(.*?\|)?(?<display>.*?)\]\]/g, '$<display>');
    text = text.replaceAll('[[','').replaceAll(']]','');
    text = text.replaceAll('&#39;',"'");
    text = text.replaceAll('&#039;',"'");
    text = text.replaceAll(/'''(?<bold>.*?)'''/g, '<b>$<bold></b>');
    text = text.replaceAll(/''(?<italic>.*?)''/g, '<i>$<italic></i>');
    text = text.replaceAll('&quot;','"');
    text = text.replaceAll('&#34;','"');
    text = text.replaceAll('\n:', '<br>');
    text = text.replaceAll('\n', '<br>');
    return text;
}

//replaces non url-safe characters with their url equivalents
export function compensate_url(text) {
    text = text.replaceAll(' ','_');
    text = text.replaceAll('/','_');
    text = text.replaceAll('&amp;','&');
    text = text.replaceAll('&#38;','&');
    text = text.replaceAll('%C2%A0','_');
    text = text.replaceAll('%26%2339%3B','%27');
    text = text.replaceAll('%26%2334%3B','%22');
    text = text.replaceAll('"','%22');
    text = text.replaceAll('&quot;','%22');
    text = text.replaceAll('&#34;','%22');
    text = text.replaceAll("'",'%27');
    text = text.replaceAll('&#39;','%27');
    text = text.replaceAll('&#039;', '%27');
    text = text.replaceAll('&','%26');
    text = text.replaceAll(':', '%3A');
    text = text.replaceAll(' ','_');
    return text;
}


/* Deprecated content ahead! The following code was used before the automization.

import st from '../../data/starship_traits.json';
import t from '../../data/traits.json';
import e from '../../data/infoboxes.json';
let starship_trait_json = st.content;
let trait_json = t.content;
let equipment_json = e.content;
let wikihttp = 'https://sto.fandom.com/wiki/';
export let data = {};
export const equipment_types_space = [
    'Ship Fore Weapon', 'Ship Aft Weapon', 'Ship Device', 'Hangar Bay', 'Experimental Weapon',
    'Ship Deflector Dish', 'Ship Secondary Deflector', 'Impulse Engine', 'Warp Engine', 'Singularity Engine', 'Ship Shields',
    'Ship Tactical Console', 'Ship Science Console', 'Ship Engineering Console','Ship Weapon', 'Universal Console'
];
export const equipment_types_ground = [
    'Kit', 'Body Armor', 'EV Suit', 'Personal Shield', 'Ground Weapon', 'Ground Device', 'Kit Module'
];
export const rarities = ['Epic','Ultra Rare','Very Rare','Rare','Uncommon','Common'];


export function compensate_wiki_description(text) {
    if (text == '') {return text}
    else if (text == null) {return ''}
    text = text.replaceAll('&lt;', '<').replaceAll('&gt;','>');
    text = text.replaceAll('{{ucfirst: ','').replaceAll('{{ucfirst:','');
    text = text.replaceAll('{{lc: ','').replaceAll('{{lc:','');
    text = text.replaceAll('{{','').replaceAll('}}','');
    text = text.replaceAll('&amp;','&').replaceAll('&#42;','*');
    let count = 0;
    while (text.includes('[[') && text.includes('|')) {
      let start = text.indexOf('[[');
      let end = text.indexOf('|');
      text = text.slice(0, start) + text.slice(end+1, text.length-1);
      count = count + 1;
      if (count >= 5) {
        break;
      }
    }  
    text = text.replaceAll('[[','').replaceAll(']]','');
    text = text.replaceAll('&#39;',"'");
    text = text.replaceAll('&quot;','"');
    text = text.replaceAll('&#34;','"');
    return text;
  }

function compensate_url(text) {
    text = text.replaceAll(' ','_');
    text = text.replaceAll('/','_');
    text = text.replaceAll('%C2%A0','_');
    text = text.replaceAll('%26%2339%3B','%27');
    text = text.replaceAll('%26%2334%3B','%22');
    text = text.replaceAll('"','%22');
    text = text.replaceAll('&quot;','%22');
    text = text.replaceAll("'",'%27');
    text = text.replaceAll(' ','_');
    return text;
}
  
// cache starship traits
let starship_trait_object = {};
for (let i = 0; i<starship_trait_json.length; i++) {
    const current_page = starship_trait_json[i];
    if ('trait' in current_page && current_page.trait != '' && current_page.trait != null) {
        if (! Object.keys(starship_trait_object).includes(current_page.trait)) {
            starship_trait_object[current_page.trait] = {'desc':current_page.traitdesc, 'obtained':[current_page._pageName], 'type':'Starship Trait'};
        }
        else {
            starship_trait_object[current_page.trait]['obtained'].push(current_page._pageName);
        }
    }
    if ('trait2' in current_page && current_page.trait2 != '' && current_page.trait2 != null) {
        if (! Object.keys(starship_trait_object).includes(current_page.trait2)) {
            starship_trait_object[current_page.trait2] = {'desc':current_page.traitdesc2, 'obtained':[current_page._pageName], 'type':'Starship Trait'};
        }
        else {
            starship_trait_object[current_page.trait2]['obtained'].push(current_page._pageName);
        }
    }
    if ('trait3' in current_page && current_page.trait3 != '' && current_page.trait3 != null) {
        if (! Object.keys(starship_trait_object).includes(current_page.trait3)) {
            starship_trait_object[current_page.trait3] = {'desc':current_page.traitdesc3, 'obtained':[current_page._pageName], 'type':'Starship Trait'};
        }
        else {
            starship_trait_object[current_page.trait3]['obtained'].push(current_page._pageName);
        }
    }
    if ('acctrait' in current_page && current_page.acctrait != '' && current_page.acctrait != null) {
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


//cache personal traits
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
        if ('name' in current_page && current_page['name'] != '' && current_page['name'] != null) {
            if ('type' in current_page && current_page['type'] != null && current_page['type'].toLowerCase() == 'starship') {
                let obtained = ['Infinity Prize Pack: Starship Trait'];
                if (current_page['name'] in specialization_traits) {
                    obtained = [specialization_traits[current_page['name']]];
                }
                data.starship_traits.push({'name': current_page['name'], 'type':'Starship Trait', 'obtained': obtained == null ? '' : obtained, 'desc': compensate_wiki_description(current_page.description)});
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
                if ('type' in current_page && current_page['type'] != null && current_page['type'].toLowerCase() == 'reputation')  {
                    type = 'reputation';
                    display_type = environment.substring(0,1).toUpperCase()+environment.substring(1)+' Reputation Trait';
                }
                else if ('type' in current_page && current_page['type'] != null && current_page['type'].toLowerCase() == 'activereputation') {
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


//cache equipment
data.space_equipment = [];
data.ground_equipment = [];
for (let i3 = 0; i3< equipment_json.length; i3++) {
    let current_item = equipment_json[i3];
    if (!current_item.name == '' && (equipment_types_space.includes(current_item.type) || equipment_types_ground.includes(current_item.type)) && current_item.name.indexOf('Hangar - Advanced') == -1 && current_item.name.indexOf('Hangar - Elite') == -1) {
        let current_name = current_item.name;
        if (current_name.includes(' mk')) {
            current_name = current_name.substring(0, current_name.indexOf(' mk'));
        }
        if (current_name.includes(' Mk')) {
            current_name = current_name.substring(0, current_name.indexOf(' Mk'));
        }
        if (current_name.includes(' MK')) {
            current_name = current_name.substring(0, current_name.indexOf(' MK'));
        }
        if (current_name.includes(' ∞')) {
            current_name = current_name.substring(0, current_name.indexOf(' ∞'));
        }
        if (current_name.includes(' [')) {
            current_name = current_name.substring(0, current_name.indexOf(' ['));
        }
        if (current_name.includes(' &#91;')) {
            current_name = current_name.substring(0, current_name.indexOf(' &#91;'));
        }
        if (current_name.includes(' %5B')) {
            current_name = current_name.substring(0, current_name.indexOf(' %5B'));
        }
        let display_type = current_item.type == 'Hangar Bay' ? 'Hangar Pet' : current_item.type == 'Warp Engine' ? 'Warp Core' : current_item.type == 'Singularity Engine' ? 'Singularity Core' : current_item.type.replaceAll('Ship ','');
        let description = {'head':{},'subhead':{},'text':{}};
        let description2 = '';
        for (let i = 1; i<10; i++) {
            description.head[i] = compensate_wiki_description(current_item['head'+i.toString()]);
            description.subhead[i] = compensate_wiki_description(current_item['subhead'+i.toString()]);
            description.text[i] = compensate_wiki_description(current_item['text'+i.toString()]);
            description2 = description2 + description.head[i] + description.subhead[i] + description.text[i]
        }
        let current_obj = {
            'name':compensate_wiki_description(current_name.replaceAll('"',"''").replaceAll('&amp;','&').replaceAll('&#34;',"''").replaceAll('&quot;',"''").replaceAll(':','')), 
            'url':wikihttp+compensate_url(current_item.Page)+'#'+compensate_url(current_name), 
            'type':current_item.type, 
            'display_type':display_type,
            'desc':description,
            'desc2':description2,
            'rarity':current_item.rarity == null ? '' : current_item.rarity.toLowerCase(),
        };
        if (equipment_types_space.includes(current_item.type)) {
            data.space_equipment.push(current_obj);
        }
        else if (equipment_types_ground.includes(current_item.type)) {
            data.ground_equipment.push(current_obj);
        }
    }
}

console.log({'Starship Traits':data.starship_traits.length, 'Personal Traits':data.personal_traits.length, 'Ground Equipment': data.ground_equipment.length, 'Space Equipment': data.space_equipment.length})
*/