/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	async rewrites() {
		const proxyFallback =
			process.env.NEXT_PROXY_FALLBACK || "https://posters.aiml.cgify.com";

		return [
			{
				source: "/api/next/:path*",
				destination: "/api/next/:path*",
			},
			{
				source: "/api/:path*",
				destination: `${proxyFallback}/api/:path*`,
			},
		];
	},
	//   async headers() {
	//     return [
	//       {
	//         source: '/api/:path*',
	//         headers: [
	//           { key: 'Access-Control-Allow-Credentials', value: 'true' },
	//           { key: 'Access-Control-Allow-Origin', value: '*' },
	//           { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
	//           { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
	//         ],
	//       },
	//     ];
	//   },
};

export default nextConfig;
