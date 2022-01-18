import * as cuid from 'cuid';
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import 'colors';
import { TagActions } from './redis/actions/TagActions';

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
  const tagActions = new TagActions();

  // TODO: reset

  // create tags
  for (const name of tagNames) {
    await tagActions.createTag({ name });
  }

  // create users
  // const user1Id = 'e141ecbf-0857-474b-9fc7-4d3f456135c5';
  // const password = await bcrypt.hash('Password01!', 10);
  // await prisma.user.create({
  //   data: {
  //     id: user1Id,
  //     email: 'idarase@gmail.com',
  //     name: 'Ilya Daraseliya',
  //     nickname: 'darasus',
  //     password,
  //     image:
  //       'https://imagedelivery.net/1Y4KoCbQQUt_e_VWvskl5g/ca74724d-1c39-4cc7-5bb3-237120eeda00/public',
  //   },
  // });

  // const usersData = Array.from({ length: 10000 }).map(() => ({
  //   id: cuid(),
  //   email: `_${faker.random.alphaNumeric(5)}_${faker.internet
  //     .email()
  //     .toLowerCase()}`,
  //   name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  //   nickname: `${faker.internet
  //     .userName()
  //     .toLowerCase()}_${faker.random.alphaNumeric(5)}`,
  //   password,
  //   image: 'https://mytinylibrary.com/user-image.png',
  // }));

  // await prisma.user.createMany({
  //   data: usersData,
  // });

  // // create follows
  // await prisma.follow.createMany({
  //   data: usersData.map((user) => ({
  //     followerId: user.id,
  //     followingId: user1Id,
  //   })),
  // });

  // // create posts
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
