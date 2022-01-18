import * as cuid from 'cuid';
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import 'colors';
import { TagActions } from '../redis/actions/TagActions';
import { UserActions } from '../redis/actions/UserActions';
import { FollowActions } from '../redis/actions/FollowActions';
import { graph } from '../redis/redis.graph';
import { PostActions } from '../redis/actions/PostActions';
import { CodeLanguage } from '@prisma/client';
import { TUser } from '@mtl/types';
import cliProgress = require('cli-progress');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const tagNames = [
  'React',
  'Vue',
  'Component Toolkit',
  'Testing',
  'Node.js framework',
  'Charting',
  'UI Framework',
  'Learning resource',
  'Angular',
  'GraphQL',
  'Animation',
  'State management',
  'CLI',
  'CSS Toolkit',
  'SVG',
  'Canvas',
  'CSS in JS',
  'Redux',
  'Scrolling',
  'Drag and drop',
  'Cache',
  'Types',
  '3D',
  'React Native',
  'Static site generator',
  'Browser automation',
  'Building tool',
  'Express',
  'Real-time',
  'Video',
  'Web Components',
  'CMS',
  'D3',
  'Markdown',
  'Rich text editor',
  'Image processing',
  'Search',
  'Table',
  'Universal',
  'Autocomplete',
  'Dashboard',
  'Date & time',
  'Game engine',
  'Material design',
  'Compiler',
  'Database',
  'Functional programming',
  'HTTP client / AJAX',
  'Icon set',
  'Machine Learning',
  'Mobile',
  'PDF',
  'Performance',
  'SQL',
  'Scaffolding - generator',
  'Utils',
  'Validation',
  'Virtual DOM',
  'WebGL',
  'Boilerplate',
  'Reactive programming',
  'Slider',
  'Types',
  'Authentication',
  'Desktop app',
  'Form',
  'Full-stack framework',
  'Image viewer',
  'JSON',
  'Layout',
  'Module - bundler',
  'Package - dependency',
  'Plugin / form widget',
  'Accessibility',
  'Audio',
  'Documentation',
  'Drawing',
  'Gesture - Touch',
  'Maps',
  'Math',
  'Microservices',
  'ORM',
  'Web workers',
  'Bootstrap',
  'File system',
  'Fuzzy search',
  'Syntax highlighting',
  'Browser storage',
  'CSS Processor',
  'Colors',
  'Data structure',
  'Diagram / Flow chart',
  'HTML & text parsing',
  'Linter',
  'Middleware',
  'Modal',
  'Notification',
  'Presentation',
  'Routing',
  'Templating',
  'Book',
  'Data fetching',
  'Internationalization i18n',
  'Logging',
  'MongoDB',
  'Offline',
  'Prefetch',
  'Queue',
  'Scraping',
  'Websocket',
  'Runtime',
  'Spreadsheet',
  'Stream',
  'Testing framework',
  'Typography',
  'Web Assembly',
  'Bot',
  'Browser compatibility',
  'Code Editor',
  'Decentralized',
  'Geometry',
  'IDE',
  'Serverless',
  'Svelte',
  'Virtual list',
  'Async flow / Promises',
  'Blockchain',
  'Caching',
  'Email',
  'Format tools',
  'Hook',
  'Input Mask',
  'IoT',
  'Keyboard',
  'Playground',
  'Regular expression',
  'Service Worker',
  'Tooltip',
  'Visual Programming',
  'Blog',
  'Code Parser',
  'Configuration',
  'Debugging',
  'Deno',
  'File upload',
  'Flux',
  'HTML template',
  'Meteor',
  'Money',
  'Monorepo',
  'RPC',
  'Random',
  'State machine',
  'Tour - Guide',
  'Analytics',
  'DOM manipulation',
  'Dev tool',
  'E-commerce',
  'Emoji',
  'Full-text search',
  'Markdown Editor App',
  'Node.js version management',
  'Prerender',
  'Process management',
  'Resource loader',
  'String',
  'Text processing',
  'Virtual Reality',
  'Window management',
  'XML',
  'API wrapper / SDK',
  'Archive',
  'Event sourcing',
  'Font',
  'Menu',
  'Print',
  'Styleguide',
  'Tree / Explorer component',
  'WebRTC',
  'Worker thread',
  'CAD',
  'CSV',
  'Crypto',
  'Crypto-currency',
  'Git',
  'Neural network',
  'Progress bar',
  'Statistics',
  'Workflow automation',
  'Meta',
];

async function main() {
  try {
    // await graph.deleteGraph();

    const tagActions = new TagActions();
    const userActions = new UserActions();
    const followActions = new FollowActions();
    const postActions = new PostActions();

    // TODO: reset

    let currIndex = 0;

    // create tags
    console.log('Creating tags...');
    bar.start(tagNames.length, 0);
    for (const name of tagNames) {
      bar.update(currIndex + 1);
      await tagActions.createTag({ name });
      currIndex++;
    }
    bar.stop();

    // create users
    const user = await userActions.register({
      email: 'test@test.com',
      password: 'Password01!',
    });

    const users: TUser[] = [];

    console.log('Creating users...');
    const numOfUsers = 100;
    bar.start(numOfUsers, 0);
    currIndex = 0;
    for (const i in Array.from({ length: numOfUsers })) {
      bar.update(currIndex + 1);
      const user = await userActions.register({
        email: `test-${i}@test.com`,
        password: 'Password01!',
      });
      users.push(user);
      currIndex++;
    }
    bar.stop();

    // create follows
    console.log('Creating follows...');
    const numOfFollows = users.length;
    bar.start(numOfFollows, 0);
    currIndex = 0;
    for (const u of users) {
      bar.update(currIndex + 1);
      await followActions.createFollow({
        followingId: user.id,
        followerId: u.id,
      });
      currIndex++;
    }
    bar.stop();

    // create posts
    console.log('Creating posts...');
    const numOfPosts = 100;
    bar.start(numOfPosts, 0);
    currIndex = 0;
    for (const _ in Array.from({ length: numOfPosts })) {
      bar.update(currIndex + 1);
      await postActions.createPost({
        userId: user.id,
        codeLanguage: CodeLanguage.JAVASCRIPT,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        content: faker.lorem.sentence(),
        isPublished: true,
        tagIds: [],
      });
      currIndex++;
    }
    bar.stop();

    // const tags = await prisma.tag.findMany();
    // const postsData = Array.from({ length: 1000 }).map(() => ({
    //   id: cuid(),
    //   codeLanguage: CodeLanguage.JAVASCRIPT,
    //   title: faker.lorem.sentence(),
    //   description: faker.lorem.sentence(),
    //   content: faker.lorem.sentence(),
    //   published: true,
    //   authorId: user1Id,
    // }));

    // await prisma.post.createMany({
    //   data: postsData,
    // });

    // await prisma.tagsOnPosts.createMany({
    //   data: postsData.map((post) => ({
    //     postId: post.id,
    //     tagId: faker.random.arrayElement(tags).id,
    //   })),
    // });

    // // create likes
    // await prisma.like.createMany({
    //   data: usersData.map((user) => ({
    //     authorId: user.id,
    //     postId: faker.random.arrayElement(postsData).id,
    //   })),
    // });

    // // create comments
    // await prisma.comment.createMany({
    //   data: usersData.map((user) => ({
    //     authorId: user.id,
    //     postId: faker.random.arrayElement(postsData).id,
    //     content: faker.random.words(),
    //   })),
    // });

    // // create activities
    // const comments = await prisma.comment.findMany();
    // const likes = await prisma.like.findMany();
    // const follows = await prisma.follow.findMany();
    // await prisma.activity.createMany({
    //   data: shuffle([
    //     ...likes.map((like) => ({
    //       postId: like.postId,
    //       likeId: like.id,
    //       ownerId: user1Id,
    //       authorId: like.authorId,
    //     })),
    //     ...comments.map((comment) => ({
    //       commentId: comment.id,
    //       ownerId: user1Id,
    //       authorId: comment.authorId,
    //       postId: comment.postId,
    //     })),
    //     ...follows.map((follow) => ({
    //       ownerId: user1Id,
    //       authorId: follow.followerId,
    //       followFollowerId: follow.followerId,
    //       followFollowingId: follow.followingId,
    //     })),
    //   ]),
    // });
    graph.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  console.log('done');
  process.exit(0);
}

main();
