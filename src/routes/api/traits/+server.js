/* This API endpoint returns the refined personal traits dataset for the VGER app. The parameters
'query' and 'override' change the returned data:
- query=data -> returns the refined dataset from cache and updates the cache if the data is older
than one day (same behavior if no parameter is supplied)
- query=source -> returns the three cargo query urls used to create the data
- override=fresh -> forces cache update and returns newly created dataset
- override=cached -> returns the cached dataset without taking any other actions */


import { 
    data_iteration, fetch_cache, fetch_json, fresh_data_handler
} from '$lib/fetch/masterfetch'
import {
    compensate_name, compensate_wiki_description, wikihttp
} from '$lib/fetch/constants'


const data_folder_path = import.meta.env.VITE_DATA_FOLDER_PATH;
const trait_file_path = data_folder_path + '/personal_traits.json';
const headers = {
    'Content-Type': 'application/json',
};


const trait_query =
    wikihttp
    + '/Special:CargoExport?'
    + 'tables=Traits&'
    + 'fields=Traits._pageName%3DPage,'
    + 'Traits.name,'
    + 'Traits.chartype,'
    + 'Traits.environment,'
    + 'Traits.type,'
    + 'Traits.required,'
    + 'Traits.possible,'
    + 'Traits.description&'
    + 'limit=2500&'
    + 'format=json';


export async function GET({url}) {
    const param_query = url.searchParams.get('query');
    const param_override = url.searchParams.get('override');
    const timestamp = Date.now();

    if (param_query == null || param_query == 'data') {

        if (param_override == 'fresh') {
            return await fresh_data_handler(timestamp, create_data, trait_file_path)
        }

        else if (param_override == 'cached') {
            const data = fetch_cache(trait_file_path);
            if (data !== null) {
                return new Response(
                    data,
                    {status: 200, headers}
                );
            }
            return new Response(
                'Cache empty or cache error!',
                {status: 503, headers: {'Content-Type': 'text/plain'}}
            );
        }

        else {
            const cached_data = fetch_cache(trait_file_path, true);
            if (cached_data === null) {
                return await fresh_data_handler(timestamp, create_data, trait_file_path)
            }
            else if ('version' in cached_data && cached_data.version > 0) {
                // 86,400,000 ms = 24 h
                if (cached_data.version + 86400000 < timestamp) {
                    data_iteration(timestamp, create_data, trait_file_path, true);
                }
                else {
                    headers['Cache-Control'] = 'public, max-age=86400, immutable';
                }
                return new Response(
                    JSON.stringify(cached_data),
                    {status: 200, headers}
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
            'traits': trait_query,
        };
        return new Response(
            JSON.stringify(r_obj),
            {status: 200, headers}
        );
    }  
}


async function create_data(version) {    
    // requests and saves cargo tables
    const trait_json = await fetch_json(trait_query);
    if (trait_json === null) {
        return null;
    }

    let temp_data = {
        version: version,
        personal_traits: [],
    };

    for (let i2 = 0; i2 < trait_json.length; i2++) {
        let current_page = trait_json[i2];
        if ('chartype' in current_page && current_page['chartype'] == 'char') {
            if ('name' in current_page
                && current_page['name'] !== ''
                && current_page['name'] !== null)
            {
                let type = '';
                let environment = 'space';
                let display_type = '';
                let availability = '';
                let availability_type = '';
                const type_alias = current_page['type'];
                const possible_alias = current_page['possible'];
                const required_alias = current_page['required'];

                if ('environment' in current_page) {
                    environment = current_page['environment'];
                }

                if ('type' in current_page
                    && type_alias != null
                    && type_alias.toLowerCase() == 'reputation')
                {
                    type = 'reputation';
                    display_type = 
                        environment.substring(0,1).toUpperCase()
                        + environment.substring(1)
                        + ' Reputation Trait';
                }
                else if ('type' in current_page
                    && type_alias != null
                    && type_alias.toLowerCase() == 'activereputation')
                {
                    type = 'activereputation';
                    display_type = 
                        'Active '
                        + environment.substring(0,1).toUpperCase()
                        + environment.substring(1)
                        + ' Reputation Trait';
                }
                else {
                    type = 'personal';
                    display_type = 
                        'Personal '
                        + environment.substring(0,1).toUpperCase()
                        + environment.substring(1)
                        + ' Trait';
                }

                if ('required' in current_page
                    && required_alias != null
                    && required_alias.length > 0
                    && required_alias[0] !== '')
                {
                    if (Array.isArray(required_alias)) {
                        availability = required_alias.join(', ');
                    }
                    else {
                        availability = required_alias.replaceAll(', ',',');
                        availability = availability.replaceAll(',', ', ');
                    }
                    availability_type = 'innate';
                }
                else if ('possible' in current_page 
                    && (possible_alias == null
                    || (possible_alias.length > 0 && possible_alias[0] === '')))
                {
                    availability_type = 'other';
                }
                else if ('possible' in current_page
                    && possible_alias != null
                    && possible_alias.length > 0
                    && possible_alias[0] !== '')
                {
                    if (Array.isArray(possible_alias)) {
                        availability = possible_alias.join(', ');
                    }
                    else {
                        availability = possible_alias.replaceAll(', ',',');
                        availability = availability.replaceAll(',', ', ');
                    }
                    availability_type = 'species';
                }

                temp_data.personal_traits.push({
                    'name': compensate_name(current_page['name']),
                    'type': type,
                    'environment': environment,
                    'display_type': display_type,
                    'desc': compensate_wiki_description(current_page.description),
                    'availability': availability,
                    'availability_type': availability_type
                });
            }
        }
    }

    return temp_data
}
