export async function GET() {
    return new Response('Please use /api/i/[image name] to retrieve images.',
        {status: 400, headers: {'Content-type': 'text/plain'}})
}
