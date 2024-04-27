import followRedirects from 'follow-redirects-fast';
import { readFileSync, openSync, closeSync, writeFileSync } from 'fs';
import { wikihttp, filepath } from '$lib/fetch/constants.js';

const data_folder_path = import.meta.env.VITE_DATA_FOLDER_PATH;
const redirect_file_path = data_folder_path + '/redirects.json';
const lockfile = data_folder_path + '/lock';

export async function POST({url}) {
    const image = url.searchParams.get('image');
    if (image === null) {
        return new Response(
            '"image" paramater must be specified!',
            {status: 400, headers: {'Content-Type': 'text/plain'}}
        );
    }
    let result;
    try {
        result = await followRedirects({ url: wikihttp + filepath + image });
    }
    catch {
        return new Response(
            `"image" paramater invalid! <${wikihttp + filepath + image}> could not be resolved.`,
            {status: 500, headers: {'Content-Type': 'text/plain'}}
        );
    }
    let file;
    try {
        try {
            file = openSync(lockfile, 'r+');
        }
        catch {
            file = openSync(lockfile, 'w');
        }
        const redirect_string = readFileSync(redirect_file_path, {encoding: 'utf-8'});
        let redirect_object;
        if (redirect_string != null && redirect_string.length > 0) {
            redirect_object = JSON.parse(redirect_string);
        }
        else {
            redirect_object = {};
        }
        redirect_object[image] = result.lastURL;
        writeFileSync(redirect_file_path, JSON.stringify(redirect_object), { encoding: 'utf-8' });
    }
    catch (e) {
        return new Response(
            `Operation Failed:\n\n${e}`,
            {status: 500, headers: {'Content-Type': 'text/plain'}}
        );
    }
    finally {
        if (file !== undefined) {
            try {
                closeSync(file);
            }
            catch (e) {
                return new Response(
                    `Operation Failed:\n\n${e}`,
                    {status: 500, headers: {'Content-Type': 'text/plain'}}
                );
            }
        }
    }
    return new Response(
        'Success!',
        {status: 200, headers: {'Content-Type': 'text/plain'}}
    );
}
