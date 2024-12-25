/**
 * This handles "/" in image names (eg: Majority / Minority)
 */

import fs from 'node:fs';
import path from 'node:path';
import { redirect } from '@sveltejs/kit';
import { image_path, image_suffix } from '$lib/fetch/constants';
import { cache_image } from '$lib/fetch/images';

const IMG_DIR = import.meta.env.VITE_IMAGE_FOLDER_PATH;

export async function GET({ params }) {
    const name = params.name + '-' + params.slug;
    const file_path = path.normalize(path.join(IMG_DIR, encodeURIComponent(name) + '.webp'));

    const headers = {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=2678400, immutable'
    };

    try {
        return new Response(fs.readFileSync(file_path), {status: 200, headers})
    }
    catch {
        cache_image(name);
        redirect(302, image_path + name.replaceAll(' ', '_') + image_suffix)
    }
}
