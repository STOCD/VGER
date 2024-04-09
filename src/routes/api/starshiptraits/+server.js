/* This API endpoint returns the refined starship traits dataset for the VGER app. The parameters
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
    compensate_name, compensate_url, compensate_wiki_description, image_path, image_suffix, wikihttp
} from '$lib/fetch/constants'


const data_folder_path = import.meta.env.VITE_DATA_FOLDER_PATH;
const trait_file_path = data_folder_path + '/starship_traits.json';


const starship_trait_query =
    wikihttp
    + 'Special:CargoExport?'
    + 'tables=StarshipTraits&'
    + 'fields=StarshipTraits._pageName,'
    + 'StarshipTraits.name,'
    + 'StarshipTraits.short,'
    + 'StarshipTraits.type,'
    + 'StarshipTraits.detailed,'
    + 'StarshipTraits.obtained,'
    + 'StarshipTraits.basic&'
    + 'limit=2500&'
    + 'format=json';


const starship_query =
    wikihttp
    + 'Special:CargoExport?'
    + 'tables=Ships&'
    + 'fields=Ships._pageName,'
    + 'Ships.cost&'
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
                    {status: 200, headers: {'Content-Type': 'application/json'}}
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
            'starship_traits': starship_trait_query,
            'ships': starship_query
        };
        return new Response(
            JSON.stringify(r_obj),
            {status: 200, headers: {'Content-Type': 'application/json'}}
        );
    }  
}


async function create_data(version) {    
    // requests and saves cargo tables
    const starship_trait_json = await fetch_json(starship_trait_query)
    const ships_json = await fetch_json(starship_query)
    if (starship_trait_json === null || ships_json === null) {
        return null;
    }

    let temp_data = {
        version: version,
        starship_traits: [],
    };
    let ship_dict = {};
    for (const ship_object of ships_json) {
        ship_dict[compensate_name(ship_object._pageName)] = ship_object.cost;
    }

    const pattern = /\[\[(?!File:)(?<source>[a-zA-Z0-9\(\) ':-]*?)(\|.*?)?\]\]/g;
    const units = ['Zen', 'R&D', 'LB', 'LC', 'APP', 'PPP5', 'Veteran'];
    for (let k = 0; k<starship_trait_json.length; k++) {
        const current_trait = starship_trait_json[k];
        if ('name' in current_trait && current_trait.name != '' && current_trait.name != null) {
            let obtained = [];
            let costs = [];
            let cost_filter = [];
            const obtained_string = compensate_name(current_trait.obtained);
            for (const res of obtained_string.matchAll(pattern)) {
                const ship = res.groups.source;
                obtained.push(ship)
                if (ship in ship_dict) {
                    for (const ship_cost of ship_dict[ship]) {
                        const ship_cost_list = ship_cost.split('/').map(item => item.trim())
                        ship_cost_list.map(item => {
                            item = item.replaceAll('&amp;', '&')
                            if (!costs.includes(item)) {
                                costs.push(item);
                            }
                            const [amount, unit] = item.split(';')
                            if (unit === 'Zen') {
                                if (amount === '3000') {
                                    if (!cost_filter.includes('3k Zen')) {
                                        cost_filter.push('3k Zen');
                                    }
                                }
                                else if (!cost_filter.includes("Zen Bundle / Mudd's Market")) {
                                    cost_filter.push("Zen Bundle / Mudd's Market");
                                }
                            }
                            else if (unit === 'R&D' && !cost_filter.includes('Promo')) {
                                cost_filter.push('Promo');
                            }
                            else if (unit === 'LB' && !cost_filter.includes('Lockbox Ship')) {
                                cost_filter.push('Lockbox Ship');
                            }
                            else if (unit === 'LC' && !cost_filter.includes('Lobi Crystal')) {
                                cost_filter.push('Lobi Crystal');
                            }
                            else if (unit === 'APP' && !cost_filter.includes('Event')) {
                                cost_filter.push('Event');
                            }
                            else if (unit === 'PPP5' && !cost_filter.includes('Phoenix')) {
                                cost_filter.push('Phoenix');
                            }
                            else if (unit === 'Veteran' && !cost_filter.includes('Lifetime')) {
                                cost_filter.push('Lifetime')
                            }
                            else if (!units.includes(unit)){
                                cost_filter.push('Mission / Exchange / Specialization')
                            }
                        });
                    }
                }
                else if (!cost_filter.includes('Mission / Exchange / Specialization')){
                    cost_filter.push('Mission / Exchange / Specialization')
                }
            }
            temp_data.starship_traits.push({
                'name': compensate_name(current_trait.name),
                'type': 'Starship Trait',
                'obtained': obtained,
                'cost': costs,
                'cost_filter': cost_filter,
                'desc': compensate_wiki_description(current_trait.detailed),
                'image': image_path + compensate_url(current_trait.name) + image_suffix
            });
        }
    }

    return temp_data
}
