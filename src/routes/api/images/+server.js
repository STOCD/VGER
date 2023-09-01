/* This API endpoint fetches images and uploads them to GitHub. A GET request with the 'image' parameter specifying 
an item on the wiki returns the link to the respective image. A PUT request with the 'image' parameter specifying an
item on the wiki as well as the 'type' parameter specifying the item type will retrieve the image and save it to
Github as well as return a link to the image*/

export async function PUT({url}) {
    const param_image = url.searchParams.get('image');
    const param_type = url.searchParams.get('type');
    if (param_image === null || param_image === '' || param_type === null || param_type === '') {
        return new Response('Invalid parameters!', {status: 400})
    }
    const image_data = await fetch_image(param_image);
    const put_status = await store_image(param_type, image_data, param_image);
    return new Response(`${wiki_images}${param_image}`, {status: put_status})
}

export async function GET({url}) {
    const param_image = url.searchParams.get('image');
    return new Response(`${wiki_images}${param_image}`, {status: 200})
}

const wiki_images = 'https://stowiki.net/wiki/Special:FilePath/';

async function fetch_image(name) {
    const response = await fetch(wiki_images + name);
    const image_data = await response.arrayBuffer();
    return image_data
}

async function store_image(type, image_data, name, force = false) {
    const auth = get_autorization_token(type);
    const url = `https://api.github.com/repos/Shinga13/VGER-test/contents/images/${name}`;
    const encoded_data = Buffer.from(image_data).toString('base64');
    const sha_response = await fetch(url, {
        method: 'GET',
        headers: {'Authorization': `token ${auth}`}
    })
    const sha_obj = await sha_response.json();
    if (sha_obj.message == 'Not Found' || force) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {'Authorization': `token ${auth}`},
            owner: 'Shinga13',
            repo: 'VGER-test',
            path: `images/${name}`,
            body: JSON.stringify(
                {
                    message: 'Automated image upload',
                    content: encoded_data,
                    sha: sha_obj.sha
                }
            )
        });
        const stat = await response.json()
        return stat.status
    }
    return 200
}

function get_autorization_token(type) {
    if (type == 'space_equipment') {
        return import.meta.env.VITE_GITHUB_TOKEN_SPACE_EQUIPMENT;
    }
    else if (type == 'ground_equipment') {
        return import.meta.env.VITE_GITHUB_TOKEN_GROUND_EQUIPMENT;
    }
    else if (type == 'starship_traits') {
        return import.meta.env.VITE_GITHUB_TOKEN_STARSHIP_TRAITS;
    }
    else if (type == 'personal_traits') {
        return import.meta.env.VITE_GITHUB_TOKEN_PERSONAL_TRAITS;
    }
    return null;
}