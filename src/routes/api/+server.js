// redirects to new api
export function GET({url, setHeaders}) {
    let new_url = url;
    new_url.pathname = '/api/cargo';
    setHeaders({
        'location': new_url.toString()
    })
    return new Response(301, {status: 301})
}

// ------------------------------------------------------------------------------------------------
// Deprecated content ahead!
// This is only kept for legacy purposes and has been replaced by the api availabe at "/api/cargo"
// ------------------------------------------------------------------------------------------------

/* This file implements the api that fetches the cargo tables from the wiki, extracts the required data and refines it. 
If this api receives a GET request it returns the saved date or debug information: ?t=1 returns the date the data was 
fetched, ?t=2 returns the cargo query links, every other GET request returns the refined data.
If this api receives a POST request it will fetch and save the data if the last fetch happened more than 24 h ago.
*/
/*
// variable that stores the refined data
let vger_data = {}

// variable that stores the date of the last successful fetch
let date = {'date':{}, 'milliseconds':0}

// stores status of fetch
let active = false

// handles GET request
export async function GET({url}) {
    if (url.searchParams.get('t') !== null && url.searchParams.get('t')[0] == '1') {
        return new Response(JSON.stringify(date), {status:200})
    }
    if (url.searchParams.get('t') !== null && url.searchParams.get('t')[0] == '2') {
        let r_obj = {
            'starship_traits': starship_trait_query,
            'personal_traits': trait_query,
            'space_and_ground_equipment': item_query
        };
        return new Response(JSON.stringify(r_obj), {status:200})
    }

    if (Object.keys(vger_data).length === 0) {
        await create_data()
        date.milliseconds = Date.now()
        date.date = new Date(date.milliseconds)
    }

    return new Response(JSON.stringify(vger_data), {status:200})
}

// handles POST request
export async function POST() {

    if (Date.now() > 1000*60*60*24 + date.milliseconds && active === false) {
        active = true
        try {
            await create_data()
            date.milliseconds = Date.now()
            date.date = new Date(date.milliseconds)
        }
        catch{}
        active = false
    }
    
    return new Response(JSON.stringify({message:'Success'}), {status:201})
}




const equipment_types_space = [
    'Ship Fore Weapon', 'Ship Aft Weapon', 'Ship Device', 'Hangar Bay', 'Experimental Weapon',
    'Ship Deflector Dish', 'Ship Secondary Deflector', 'Impulse Engine', 'Warp Engine', 'Singularity Engine', 'Ship Shields',
    'Ship Tactical Console', 'Ship Science Console', 'Ship Engineering Console','Ship Weapon', 'Universal Console'
];
const equipment_types_ground = [
    'Kit', 'Body Armor', 'EV Suit', 'Personal Shield', 'Ground Weapon', 'Ground Device', 'Kit Module'
];

const wikihttp = 'https://www.stowiki.net/wiki/';
const filepath = 'Special:FilePath/';
const image_suffix = '_icon.png';

const item_query = wikihttp + 'Special:CargoExport?tables=Infobox&&fields=_pageName%3DPage%2Cname%3Dname%2Crarity%3Drarity%2Ctype%3Dtype%2Cboundto%3Dboundto%2Cboundwhen%3Dboundwhen%2Cwho%3Dwho%2Chead1%3Dhead1%2Chead2%3Dhead2%2Chead3%3Dhead3%2Chead4%3Dhead4%2Chead5%3Dhead5%2Chead6%3Dhead6%2Chead7%3Dhead7%2Chead8%3Dhead8%2Chead9%3Dhead9%2Csubhead1%3Dsubhead1%2Csubhead2%3Dsubhead2%2Csubhead3%3Dsubhead3%2Csubhead4%3Dsubhead4%2Csubhead5%3Dsubhead5%2Csubhead6%3Dsubhead6%2Csubhead7%3Dsubhead7%2Csubhead8%3Dsubhead8%2Csubhead9%3Dsubhead9%2Ctext1%3Dtext1%2Ctext2%3Dtext2%2Ctext3%3Dtext3%2Ctext4%3Dtext4%2Ctext5%3Dtext5%2Ctext6%3Dtext6%2Ctext7%3Dtext7%2Ctext8%3Dtext8%2Ctext9%3Dtext9&limit=5000&format=json';
const starship_trait_query = wikihttp + "Special:CargoExport?tables=Mastery&fields=Mastery._pageName,Mastery.trait,Mastery.traitdesc,Mastery.trait2,Mastery.traitdesc2,Mastery.trait3,Mastery.traitdesc3,Mastery.acctrait,Mastery.acctraitdesc&limit=1000&offset=0&format=json";
const trait_query = wikihttp + "Special:CargoExport?tables=Traits&fields=Traits._pageName%3DPage,Traits.name,Traits.chartype,Traits.environment,Traits.type,Traits.isunique,Traits.master,Traits.description&limit=2500&format=json";
const starship_trait_query_stowiki = wikihttp + "Special:CargoExport?tables=StarshipTraits&fields=StarshipTraits._pageName,StarshipTraits.name,StarshipTraits.short,StarshipTraits.type,StarshipTraits.detailed,StarshipTraits.obtained,StarshipTraits.basic&limit=2500&format=json"

// requests and returns the cargo table
async function get_cargo_table(url) {
    const res = await fetch(url)
    const json_data = await res.json()
    if (res.ok) {
        return json_data
    }
    else return {}
}

//cleans item descriptions from wiki-specific format tags and replaces html tags
function compensate_wiki_description(text) {
    if (text == '') {return text}
    else if (text == null) {return ''}
    text = text.replaceAll('&lt;', '<').replaceAll('&gt;','>');
    text = text.replaceAll('{{ucfirst: ','').replaceAll('{{ucfirst:','');
    text = text.replaceAll('{{lc: ','').replaceAll('{{lc:','');
    text = text.replaceAll('{{','').replaceAll('}}','');
    text = text.replaceAll('&amp;','&').replaceAll('&#42;','*');
    text = text.replace(/^\*(?<line>.+?)(?=(\n)|$)/, '<ul><li>$<line></li></ul>');
    text = text.replaceAll(/(?<=(\n\*\*\*))(?<line>.+?)(?=(\n)|$)/g, '<ul><ul><ul><li>$<line></li></ul></ul></ul>');
    text = text.replaceAll('\n***', '');
    text = text.replaceAll(/(?<=(\n\*\*))(?<line>.+?)(?=(\n)|$)/g, '<ul><ul><li>$<line></li></ul></ul>');
    text = text.replaceAll('\n**', '');
    text = text.replaceAll(/(?<=(\n\*))(?<line>.+?)(?=(\n)|$)/g, '<ul><li>$<line></li></ul>');
    text = text.replaceAll('\n*', '');

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
    text = text.replaceAll('\n', '<br>');
    return text;
}

//replaces non url-safe characters with their url equivalents
function compensate_url(text) {
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
    text = text.replaceAll('&','%26');
    text = text.replaceAll(' ','_');
    return text;
}


async function create_data() {

    let temp_data = {};

    // requests and saves cargo tables
    let starship_trait_json = await get_cargo_table(starship_trait_query_stowiki);
    let trait_json = await get_cargo_table(trait_query);
    let equipment_json = await get_cargo_table(item_query);

    temp_data.starship_traits = [];
    const pattern = /\[\[(?<source>[a-zA-Z ']*?)(\|.*?)?\]\]/g;
    for (let k = 0; k<starship_trait_json.length; k++) {
        const current_trait = starship_trait_json[k];
        if ('name' in current_trait && current_trait.name != '' && current_trait.name != null) {
            let obtained = [];
            for (const res of current_trait.obtained.matchAll(pattern)) {
                obtained.push(res.groups.source);
            }
            temp_data.starship_traits.push({
                'name': current_trait.name,
                'type': 'Starship Trait',
                'obtained': obtained,
                'desc': compensate_wiki_description(current_trait.detailed),
                'image': wikihttp + filepath + compensate_url(current_trait.name) + image_suffix
            });
        }
    }
    
    // cache starship traits
    /* Specialty here is that traits can come from different ships, so it first creates a list indexed by trait names, adding further obtain information as it goes. 
    After that it creates an unsorted list with an object for each trait.*/
    /*let starship_trait_object = {};
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
    temp_data.starship_traits = [];
    for (let j = 0; j<starship_trait_list.length; j++) {
        let current_trait = starship_trait_object[starship_trait_list[j]]
        temp_data.starship_traits.push({'name': starship_trait_list[j], 'type':'Starship Trait', 'obtained': current_trait.obtained, 'desc': compensate_wiki_description(current_trait.desc), 'image':wikihttp+filepath+compensate_url(starship_trait_list[j])+image_suffix});
    }*/

    /*
    //cache personal traits
    temp_data.personal_traits = [];
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
                    temp_data.starship_traits.push({'name': current_page['name'], 'type':'Starship Trait', 'obtained': obtained == null ? '' : obtained, 'desc': compensate_wiki_description(current_page.description), 'image':wikihttp+filepath+compensate_url(current_page['name'])+image_suffix});
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
                    temp_data.personal_traits.push({'name': current_page['name'], 'type':type, 'environment':environment, 'display_type':display_type, 'desc': compensate_wiki_description(current_page.description), 'availability':availability, 'availability_type':availability_type, 'image':wikihttp+filepath+compensate_url(current_page['name'])+image_suffix});
                }
            }
        }
    }


    //cache equipment
    temp_data.space_equipment = [];
    temp_data.ground_equipment = [];
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
                'image':wikihttp+filepath+compensate_url(current_name)+image_suffix
            };
            if (equipment_types_space.includes(current_item.type)) {
                temp_data.space_equipment.push(current_obj);
            }
            else if (equipment_types_ground.includes(current_item.type)) {
                temp_data.ground_equipment.push(current_obj);
            }
        }
    }

vger_data = temp_data;

//console.log({'Starship Traits':data.starship_traits.length, 'Personal Traits':data.personal_traits.length, 'Ground Equipment': data.ground_equipment.length, 'Space Equipment': data.space_equipment.length})
}
*/