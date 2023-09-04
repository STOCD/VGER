/*This API endpoint returns the refined dataset for the VGER app. The parameters 'query' and 'override' change the 
returned data:

- query=data -> returns the refined dataset from cache and updates the cache if the data is older than one day
(same behavior if no parameter is supplied)
- query=source -> returns the three cargo query urls used to create the data
- override=fresh -> forces cache update and returns newly created dataset
- override=cached -> returns the cached dataset without taking any other actions*/

const repo_name = import.meta.env.VITE_GITHUB_REPO;
const owner_name = import.meta.env.VITE_GITHUB_OWNER;

const wikihttp = 'https://www.stowiki.net/wiki/';
const filepath = 'Special:FilePath/';
const image_suffix = '_icon.png';
const git_image_path = `https://raw.githubusercontent.com/${owner_name}/${repo_name}/main/images/`;

const item_query = wikihttp + 'Special:CargoExport?tables=Infobox&&fields=_pageName%3DPage%2Cname%3Dname%2Crarity%3Drarity%2Ctype%3Dtype%2Cboundto%3Dboundto%2Cboundwhen%3Dboundwhen%2Cwho%3Dwho%2Chead1%3Dhead1%2Chead2%3Dhead2%2Chead3%3Dhead3%2Chead4%3Dhead4%2Chead5%3Dhead5%2Chead6%3Dhead6%2Chead7%3Dhead7%2Chead8%3Dhead8%2Chead9%3Dhead9%2Csubhead1%3Dsubhead1%2Csubhead2%3Dsubhead2%2Csubhead3%3Dsubhead3%2Csubhead4%3Dsubhead4%2Csubhead5%3Dsubhead5%2Csubhead6%3Dsubhead6%2Csubhead7%3Dsubhead7%2Csubhead8%3Dsubhead8%2Csubhead9%3Dsubhead9%2Ctext1%3Dtext1%2Ctext2%3Dtext2%2Ctext3%3Dtext3%2Ctext4%3Dtext4%2Ctext5%3Dtext5%2Ctext6%3Dtext6%2Ctext7%3Dtext7%2Ctext8%3Dtext8%2Ctext9%3Dtext9&limit=5000&format=json';
const trait_query = wikihttp + "Special:CargoExport?tables=Traits&fields=Traits._pageName%3DPage,Traits.name,Traits.chartype,Traits.environment,Traits.type,Traits.required,Traits.possible,Traits.description&limit=2500&format=json";
const starship_trait_query_stowiki = wikihttp + "Special:CargoExport?tables=StarshipTraits&fields=StarshipTraits._pageName,StarshipTraits.name,StarshipTraits.short,StarshipTraits.type,StarshipTraits.detailed,StarshipTraits.obtained,StarshipTraits.basic&limit=2500&format=json";

const vger_data_url = `https://raw.githubusercontent.com/${owner_name}/${repo_name}/main/vger_data.json`;
const vger_data_put_url = `https://api.github.com/repos/${owner_name}/${repo_name}/contents/vger_data.json`;

const equipment_types_space = [
    'Ship Fore Weapon', 'Ship Aft Weapon', 'Ship Device', 'Hangar Bay', 'Experimental Weapon',
    'Ship Deflector Dish', 'Ship Secondary Deflector', 'Impulse Engine', 'Warp Engine', 'Singularity Engine', 'Ship Shields',
    'Ship Tactical Console', 'Ship Science Console', 'Ship Engineering Console','Ship Weapon', 'Universal Console'
];
const equipment_types_ground = [
    'Kit', 'Body Armor', 'EV Suit', 'Personal Shield', 'Ground Weapon', 'Ground Device', 'Kit Module'
];

export async function GET({url}) {
    const param_query = url.searchParams.get('query');
    const param_override = url.searchParams.get('override');
    const now = Date.now();

    if (param_override == 'fresh') {
        const [data, store_status] = await data_iteration(now, false);
        return new Response(JSON.stringify(data), {status:store_status});
    }
    else if (param_override == 'cached') {
        const [data, fetch_status] = await fetch_json(vger_data_url, true);
        return new Response(JSON.stringify(data), {status:fetch_status});
    }

    if (param_query == null || param_query == 'data') {
        const [cached_data, fetch_status]  = await fetch_json(vger_data_url, true);
        if (cached_data == null || Object.keys(cached_data).length != 5) {
            const [data, store_status] = await data_iteration(now, false);
            return new Response(JSON.stringify(data), {status:store_status});
        }
        else if ('version' in cached_data && cached_data.version > 0) {
            if (cached_data.version + 86400000 < now) {
                data_iteration(now);
                return new Response(JSON.stringify(cached_data), {status:fetch_status});
            }
            else {
                return new Response(JSON.stringify(cached_data), {status:fetch_status});
            }
        }
    }
    else if (param_query == 'source') {
        const r_obj = {
            'starship_traits': starship_trait_query_stowiki,
            'personal_traits': trait_query,
            'space_and_ground_equipment': item_query
        };
        return new Response(JSON.stringify(r_obj), {status:200})
    }  
}

// requests and returns a json
async function fetch_json(url, encoded=false) {
    const res = await fetch(url)
    if (!res.ok) return null;
    if (encoded === true) {
        const json_data = JSON.parse(decodeURIComponent(await res.text()));
        return [json_data, res.status];
    }
    else {
        const json_data = await res.json();
        return [json_data, res.status];
    }
}

// stores json file to github
async function store_json(object, url, msg, version) {
    const tk = import.meta.env.VITE_GITHUB_TOKEN_CARGO;
    const stringified_obj = encodeURIComponent(JSON.stringify(object));
    const payload = btoa(stringified_obj);
    const file_req = await fetch(url, {
        method: 'GET',
        headers: {'Authorization': `token ${tk}`}
    });
    const file_info = await file_req.json();
    const resp = await fetch(url, {
        method: 'PUT',
        headers: {'Authorization': `token ${tk}`},
        owner: owner_name,
        repo: repo_name,
        body: JSON.stringify(
            {
                message: `${msg} ${version}`,
                content: payload,
                sha: file_info.sha,
            }
        )
    });
    return resp.status
}

// wrapper for creating and storing data
async function data_iteration(version, silent=true) {
    if (silent == true) {
        create_data(version).then(new_data => store_json(new_data, vger_data_put_url, 'Automated update of vger_data at', version));
        return [null, 200];
    }
    else {
        const new_data = await create_data(version);
        const response_status = await store_json(new_data, vger_data_put_url, 'Automated update of vger_data at', version);
        return [new_data, response_status];
    }
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
    text = text.replaceAll(/\[\[(.*?\|)?(?<display>.*?)\]\]/g, '$<display>');
    text = text.replaceAll('[[','').replaceAll(']]','');
    text = text.replaceAll('&#39;',"'");
    text = text.replaceAll('&#039;',"'");
    text = text.replaceAll('&quot;','"');
    text = text.replaceAll('&#34;','"');
    text = text.replaceAll('\n:', '');
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
    text = text.replaceAll('&#039;', '%27');
    text = text.replaceAll('&','%26');
    text = text.replaceAll(':', '%3A')
    text = text.replaceAll(' ','_');
    return text;
}

function compensate_name(text) {
    text = text.replaceAll('&#039;',"'");
    return text
}

async function create_data(version) {

    let temp_data = {
        version: version
    };

    // requests and saves cargo tables
    const [starship_trait_json,] = await fetch_json(starship_trait_query_stowiki);
    const [trait_json,] = await fetch_json(trait_query);
    const [equipment_json,] = await fetch_json(item_query);

    temp_data.starship_traits = [];
    const pattern = /\[\[(?!File:)(?<source>[a-zA-Z0-9\(\) ':-]*?)(\|.*?)?\]\]/g;
    for (let k = 0; k<starship_trait_json.length; k++) {
        const current_trait = starship_trait_json[k];
        if ('name' in current_trait && current_trait.name != '' && current_trait.name != null) {
            let obtained = [];
            for (const res of current_trait.obtained.matchAll(pattern)) {
                obtained.push(res.groups.source);
            }
            temp_data.starship_traits.push({
                'name': compensate_name(current_trait.name),
                'type': 'Starship Trait',
                'obtained': obtained,
                'desc': compensate_wiki_description(current_trait.detailed),
                'image': git_image_path + compensate_url(current_trait.name) + image_suffix
            });
        }
    }

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
                    temp_data.starship_traits.push({'name': current_page['name'], 'type':'Starship Trait', 'obtained': obtained == null ? '' : obtained, 'desc': compensate_wiki_description(current_page.description), 'image':git_image_path+compensate_url(current_page['name'])+image_suffix});
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
                    if ('required' in current_page && current_page['required'] != null && current_page['required'].length > 0 && current_page['required'][0] !== '') {
                        if (Array.isArray(current_page['required'])) {
                            availability = current_page['required'].join(', ');
                        }
                        else {
                            availability = current_page['required'].replaceAll(', ',',').replaceAll(',', ', ');
                        }
                        availability_type = 'innate';
                    }
                    else if ('possible' in current_page && (current_page['possible'] == null || current_page['possible'].length > 0 && current_page['possible'][0] === '')) {
                        availability_type = 'other';
                    }
                    else if ('possible' in current_page && current_page['possible'] != null && current_page['possible'].length > 0 && current_page['possible'][0] !== '') {
                        if (Array.isArray(current_page['possible'])) {
                            availability = current_page['possible'].join(', ');
                        }
                        else {
                            availability = current_page['possible'].replaceAll(', ',',').replaceAll(',', ', ');
                        }
                        availability_type = 'species';
                    }
                    temp_data.personal_traits.push({'name': compensate_name(current_page['name']), 'type':type, 'environment':environment, 'display_type':display_type, 'desc': compensate_wiki_description(current_page.description), 'availability':availability, 'availability_type':availability_type, 'image':git_image_path+compensate_url(current_page['name'])+image_suffix});
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
                description.text[i] = current_item['text'+i.toString()];
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
                'image':git_image_path+compensate_url(current_name)+image_suffix
            };
            if (equipment_types_space.includes(current_item.type)) {
                temp_data.space_equipment.push(current_obj);
            }
            else if (equipment_types_ground.includes(current_item.type)) {
                temp_data.ground_equipment.push(current_obj);
            }
        }
    }

return temp_data
}
