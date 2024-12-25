import path from 'node:path';
import { image_path, image_suffix } from '$lib/fetch/constants';
import sharp from 'sharp';

const IMG_DIR = import.meta.env.VITE_IMAGE_FOLDER_PATH;

export async function cache_image(image_name) {
    const resp = await fetch(
        image_path + image_name.replaceAll(' ', '_') + image_suffix,
        {headers: {method: 'GET', headers: {'Accept': 'image/png'}}}
    );
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
