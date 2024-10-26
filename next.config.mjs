/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'devesion.main.jp',
                port: '',
            },
        ],
    },
};

export default nextConfig;
