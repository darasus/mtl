import dd from 'dd-trace';
import priority = require('dd-trace/ext/priority');
import tags = require('dd-trace/ext/tags');

const createConfig = (env) => ({
  runtimeMetrics: true,
  logInjection: true,
  analytics: true,
  debug: false,
  enabled: true,
  env: 'prod',
  plugins: true,
  reportHostname: true,
  service: 'mtl-server',
  clientToken: 'pub4a9d3b12a4fb4ed1c9e294f8c17b98b4',
  tags: {
    [tags.SAMPLING_PRIORITY]: priority.AUTO_KEEP,
    // Will be a tag name for prod and a release branch name for ACC on release branches
    version: env.CI_COMMIT_REF_NAME,
    source: 'mtl-server',
  },
});

const config = createConfig(process.env);

if (process.env.NODE_ENV === 'production') {
  dd.init(config);
}
