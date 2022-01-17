import RedisGraph = require('redisgraph.js');

// ('redis://default:fJVJ2aOwNEuMGdmOHTdGhvCFgHL13B8k@redis-11391.c55.eu-central-1-1.ec2.cloud.redislabs.com:11391');

const RGraph = RedisGraph.Graph;
export const graph = new RGraph(
  'mtl',
  'redis-11391.c55.eu-central-1-1.ec2.cloud.redislabs.com',
  '11391',
  {
    username: 'default',
    password: 'fJVJ2aOwNEuMGdmOHTdGhvCFgHL13B8k',
  }
);
