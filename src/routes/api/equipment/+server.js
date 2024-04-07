/* This API endpoint returns the refined equipment dataset for the VGER app. The parameters
'query' and 'override' change the returned data:
- query=data -> returns the refined dataset from cache and updates the cache if the data is older
than one day (same behavior if no parameter is supplied)
- query=source -> returns the three cargo query urls used to create the data
- override=fresh -> forces cache update and returns newly created dataset
- override=cached -> returns the cached dataset without taking any other actions */


import { 
    data_iteration,  fetch_cache, fetch_json, fresh_data_handler
} from '$lib/fetch/masterfetch'
import {
    compensate_url, compensate_wiki_description, equipment_types_ground,
    equipment_types_space, image_path, image_suffix, wikihttp
} from '$lib/fetch/constants'


const data_folder_path = import.meta.env.VITE_DATA_FOLDER_PATH;
const equip_file_path = data_folder_path + '/equipment.json';


const item_query =
    wikihttp
    + 'Special:CargoExport?'
    + 'tables=Infobox&'
    + 'fields=_pageName=Page,'
    + 'name,'
    + 'rarity,'
    + 'type,'
    + 'boundto,'
    + 'boundwhen,'
    + 'who,'
    + 'head1,head2,head3,head4,head5,head6,head7,head8,head9,'
    + 'subhead1,subhead2,subhead3,subhead4,subhead5,subhead6,subhead7,subhead8,subhead9,'
    + 'text1,text2,text3,text4,text5,text6,text7,text8,text9&'
    + 'limit=5000&'
    + 'format=json';


export async function GET({url}) {
    const param_query = url.searchParams.get('query');
    const param_override = url.searchParams.get('override');
    const timestamp = Date.now();

    if (param_query == null || param_query == 'data') {

        if (param_override == 'fresh') {
            return await fresh_data_handler(timestamp, create_data, equip_file_path)
        }

        else if (param_override == 'cached') {
            const data = fetch_cache(equip_file_path);
            if (data !== null) {
                return new Response(
                    data,
                    {status: 200, headers: {'Content-Type': 'application/json'}}
                );
            }
            return new Response(
                'Cache empty or cache error!',
                {status: 503, headers: {'Content-Type': 'text/plain'}}
            );
        }

        else {
            const cached_data = fetch_cache(equip_file_path, true);
            if (cached_data === null) {
                return await fresh_data_handler(timestamp, create_data, equip_file_path)
            }
            else if ('version' in cached_data && cached_data.version > 0) {
                // 86,400,000 ms = 24 h
                if (cached_data.version + 86400000 < timestamp) {
                    data_iteration(timestamp, create_data, equip_file_path, true);
                }
                return new Response(
                    JSON.stringify(cached_data),
                    {status: 200, headers: {'Content-Type': 'application/json'}}
                );
            }
            return new Response(
                'Cache empty or cache error!',
                {status: 503, headers: {'Content-Type': 'text/plain'}}
            );
        }

    }
    else if (param_query == 'source') {
        const r_obj = {
            'equipment': item_query,
        };
        return new Response(
            JSON.stringify(r_obj),
            {status: 200, headers: {'Content-Type': 'application/json'}}
        );
    }  
}


async function create_data(version) {    
    // requests and saves cargo tables
    const equipment_json = await fetch_json(item_query)
    if (equipment_json === null) {
        return null;
    }

    let temp_data = {
        version: version,
        space_equipment: [],
        ground_equipment: [],
    };

    for (let i3 = 0; i3 < equipment_json.length; i3++) {
        const current_item = equipment_json[i3];
        if (!current_item.name == ''
            && (equipment_types_space.includes(current_item.type)
                || equipment_types_ground.includes(current_item.type))
            && current_item.name.indexOf('Hangar - Advanced') == -1
            && current_item.name.indexOf('Hangar - Elite') == -1)
        {

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

            let display_type;
            switch (current_item.type) {
                case 'Hangar Bay':
                    display_type = 'Hangar Pet';
                    break;
                case 'Warp Engine':
                    display_type = 'Warp Core';
                    break;
                case 'Singularity Engine':
                    display_type = 'Singularity Core';
                    break;
                default:
                    display_type = current_item.type.replaceAll('Ship ','');
                    break;
            }

            const description = {'head':{},'subhead':{},'text':{}};
            let description2 = '';
            for (let i = 1; i<10; i++) {
                description.head[i] = compensate_wiki_description(current_item['head' + i.toString()]);
                description.subhead[i] = compensate_wiki_description(current_item['subhead' + i.toString()]);
                description.text[i] = current_item['text' + i.toString()];
                description2 += description.head[i] + description.subhead[i] + description.text[i]
            }

            const current_obj = {
                'name': compensate_wiki_description(current_name.replaceAll(':','')), 
                'url': wikihttp + compensate_url(current_item.Page) + '#' + compensate_url(current_name), 
                'type': current_item.type, 
                'display_type': display_type,
                'desc': description,
                'desc2': description2,
                'rarity': current_item.rarity == null ? '' : current_item.rarity.toLowerCase(),
                'image': image_path + compensate_url(current_name) + image_suffix
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
