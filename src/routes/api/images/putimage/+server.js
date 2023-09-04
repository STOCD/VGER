// converts a GET request into a PUT request to "/api/images"
// returns the result as text
export async function GET({url}) {
    const r1 = await fetch(`${url.protocol}//${url.host}/api/images${url.search}`, {method: 'PUT'});
    const r2 = await r1.text();
    return new Response(r2, {status:r1.status})
}