export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        localServer: {
          basePath: '/data/uploads', // Store files in persistent volume
          baseUrl: '/uploads', // Public URL path for accessing uploads
        },
      },
    },
  },
});