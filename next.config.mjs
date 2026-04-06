/** @type {import('next').NextConfig} */

function generateCSP() {
    // Daftar domain yang diizinkan
    const allowedDomains = [
        process.env.NEXT_PUBLIC_API_URL,
        process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD,
        process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN,
        process.env.NEXT_PUBLIC_API_URL_CSF,
        process.env.NEXT_PUBLIC_API_URL_TAGGING,
        process.env.NEXT_PUBLIC_API_URL_CASCADING_PEMDA,
    ].filter(Boolean);

    const connectSrc = ["'self'", ...allowedDomains].join(' ');

    return `default-src 'self'; connect-src ${connectSrc}; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';`
}

const nextConfig = {
    // async headers() {
    //     return [
    //         {
    //             source: '/(.*)',
    //             headers: [
    //                 {
    //                     key: 'X-DNS-Prefetch-Control',
    //                     value: 'on'
    //                 },
    //                 {
    //                     key: 'Strict-Transport-Security',
    //                     value: 'max-age=63072000; includeSubDomains; preload'
    //                 },
    //                 {
    //                     key: 'X-XSS-Protection',
    //                     value: '1; mode=block'
    //                 },
    //                 {
    //                     key: 'X-Frame-Options',
    //                     value: 'SAMEORIGIN'
    //                 },
    //                 {
    //                     key: 'X-Content-Type-Options',
    //                     value: 'nosniff'
    //                 },
    //                 {
    //                     key: 'Referrer-Policy',
    //                     value: 'origin-when-cross-origin'
    //                 },
    //                 {
    //                     key: 'Content-Security-Policy',
    //                     value: generateCSP()
    //                 }
    //             ],
    //         },
    //     ]
    // },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'logo.kertaskerja.cc',
                pathname: '**'
            }
        ]
    },
    output: "standalone",
};

export default nextConfig;
