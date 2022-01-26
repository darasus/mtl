import { graph } from '../redis/redis.graph';
import { generateTags } from './generateTags';
import { generateUsers } from './generateUsers';
import { generateFollows } from './generateFollows';
import { generatePosts } from './generatePosts';
import { generateComments } from './generateComments';
import { generateLikes } from './generateLikes';
import { generateActivities } from './generateActivities';

async function main() {
  try {
    await graph.deleteGraph();
    const tags = await generateTags();
    const { me, users } = await generateUsers();
    await generateFollows({ me, users });
    const posts = await generatePosts({ me, tags, users });
    await generateComments({ me, users, posts });
    await generateLikes({ me, users, posts });
    await generateActivities({ me, users, posts });

    graph.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  console.log('done');
  process.exit(0);
}

main();
