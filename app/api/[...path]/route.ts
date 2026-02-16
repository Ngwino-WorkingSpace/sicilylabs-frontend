import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

async function proxyRequest(req: NextRequest) {
    const url = new URL(req.url);
    // Extract the path after /api/
    const pathSegments = url.pathname.replace(/^\/api\//, '');
    const targetUrl = `${API_BASE}/${pathSegments}${url.search}`;

    const headers: Record<string, string> = {};

    // Forward authorization header securely
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
        headers['Authorization'] = authHeader;
    }

    const contentType = req.headers.get('content-type');

    let body: BodyInit | null = null;

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (contentType && contentType.includes('multipart/form-data')) {
            // For file uploads, forward the raw body — don't set Content-Type 
            // so fetch auto-generates the correct boundary
            body = await req.arrayBuffer();
            headers['Content-Type'] = contentType;
        } else {
            // JSON payloads
            try {
                const json = await req.json();
                body = JSON.stringify(json);
                headers['Content-Type'] = 'application/json';
            } catch {
                // Empty body
            }
        }
    }

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
            },
        });
    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    return proxyRequest(req);
}

export async function POST(req: NextRequest) {
    return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
    return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
    return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
    return proxyRequest(req);
}
