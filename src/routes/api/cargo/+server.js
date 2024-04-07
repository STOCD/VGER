// redirects to new api
export function GET() {
    return new Response(
        'API Deprecated! Use "/api/equipment", "/api/starshiptraits" and "/api/traits" instead',
        {status: 410, headers: {'Content-Type': 'text/plain'}}
    );
}