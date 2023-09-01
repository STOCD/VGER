export async function GET({url}) {
    const p_image = url.searchParams.get('image');
    const p_type = url.searchParams.get('type');
    let params = '';
    if (p_image !== null) {
        params = `?image=${p_image}`;
        if (p_type !== null) {
            params = params + `&type=${p_type}`;
        }
    }
    else if (p_type !== null) {
        params = `?type=${p_type}`;
    }
    const r1 = await fetch(`http://localhost:5173/api/images/${params}`, {method: 'PUT'});
    const r2 = await r1.text();
    return new Response(r2, {status:r1.status})
}