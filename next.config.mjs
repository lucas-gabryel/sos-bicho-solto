const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/tutores', destination: '/acolhedores', permanent: true },
      { source: '/tutores/:id', destination: '/acolhedores/:id', permanent: true },
    ];
  },
}

export default nextConfig
