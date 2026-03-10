import path from 'node:path';
import { image_path, image_suffix } from '$lib/fetch/constants';
import { get_requests_env } from '$lib/fetch/masterfetch';
import sharp from 'sharp';

const IMG_DIR = import.meta.env.VITE_IMAGE_FOLDER_PATH;
const request_init = {
    method: 'GET',
    headers: {'Accept': 'image/png'}
};
let headers_cached = null;

function update_headers() {
    const env_vars = get_requests_env();
    if ('CF_CLEARANCE' in env_vars) {
        request_init.headers['cookie'] = `cf_clearance=${env_vars.CF_CLEARANCE};`;
    }
    else {
        delete request_init.headers['cookie'];
    }
    if ('USER_AGENT' in env_vars) {
        request_init.headers['User-Agent'] = env_vars.USER_AGENT;
    }
    else {
        delete request_init.headers['User-Agent'];
    }
    headers_cached = Date.now();
}

export async function cache_image(image_name) {
    if (headers_cached == null || Date.now() - headers_cached > 60000) {
        update_headers()
    }
    const resp = await fetch(
        image_path + image_name.replaceAll(' ', '_') + image_suffix, request_init
    );
    console.log([resp.status, image_path + image_name.replaceAll(' ', '_') + image_suffix]);
    if (resp.ok) {
        const filepath = path.join(IMG_DIR, encodeURIComponent(image_name) + '.webp');
        sharp(await resp.arrayBuffer()).webp().toFile(filepath, log_error);
    }
}

function log_error(error, info) {
    if (error !== null) {
        console.log('Sharp Error:')
        console.log(error)
    }
}
