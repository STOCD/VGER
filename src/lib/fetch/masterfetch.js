/* Fetching helper functions */
import { writeFile, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { image_path_direct } from './constants';


// creates fresh data and returns it
export async function fresh_data_handler(version, data_factory, cache_path) {
    const fresh_data = await data_iteration(version, data_factory, cache_path, false);
    if (fresh_data !== null) {
        return new Response(
            JSON.stringify(fresh_data),
            {status: 200, headers: {'Content-Type': 'application/json'}}
        );
    }
    return new Response(
        'One or more cargo queries failed.',
        {status: 503, headers: {'Content-Type': 'text/plain'}}
    )
}


// requests and returns a json
export async function fetch_json(url) {
    const res = await fetch(
        url,
        {headers: {method: 'GET', headers: {'Accept': 'application/json'}}}
    );
    if (res.ok) {
        const json_data = await res.json();
        return json_data;
    }
    return null;
}


// get cached data
export function fetch_cache(file_path, json_return=false) {
    try {
        const data_string = readFileSync(file_path, {encoding: 'utf-8'});
        if (data_string != null && data_string.length > 0) {
            if (json_return === false) {
                return data_string;
            }
            else {
                try {
                    return JSON.parse(data_string);
                }
                catch {
                    return null;
                }
            }
        }
        return null;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}


// stores json file to server
function store_json(object, file_path) {
    try {
        writeFile(file_path, JSON.stringify(object), {encoding: 'utf-8'}, (x) => x)
    }
    catch (error) {
        console.log(error)
    }
}


// wrapper for creating and storing data
export async function data_iteration(version, data_factory, cache_path, silent=true) {
    if (silent == true) {
        data_factory(version).then(new_data => store_json(new_data, cache_path));
        return null;
    }
    else {
        const new_data = await data_factory(version);
        if (new_data === null) {
            return null;
        }
        store_json(new_data, cache_path);
        return new_data;
    }
}


// obtain filepath from filename (https://mediawiki.org/wiki/Manual:$wgHashedUploadDirectory)
export function get_filepath(file_name) {
    const hash = createHash('md5').update(file_name).digest('hex');
    return `${image_path_direct}${hash.charAt(0)}/${hash.substring(0, 2)}/${file_name}`;
}
