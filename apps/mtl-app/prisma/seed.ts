import { v4 as uuid } from "uuid";
import cuid from "cuid";
import prisma from "../lib/prisma";
import faker from "faker";
import bcrypt from "bcrypt";
import { CodeLanguage } from ".prisma/client";

const tagNames = [
  "React",
  "Vue",
  "Component Toolkit",
  "Testing",
  "Node.js framework",
  "Charting",
  "UI Framework",
  "Learning resource",
  "Angular",
  "GraphQL",
  "Animation",
  "State management",
  "CLI",
  "CSS Toolkit",
  "SVG",
  "Canvas",
  "CSS in JS",
  "Redux",
  "Scrolling",
  "Drag and drop",
  "Cache",
  "Types",
  "3D",
  "React Native",
  "Static site generator",
  "Browser automation",
  "Building tool",
  "Express",
  "Real-time",
  "Video",
  "Web Components",
  "CMS",
  "D3",
  "Markdown",
  "Rich text editor",
  "Image processing",
  "Search",
  "Table",
  "Universal",
  "Autocomplete",
  "Dashboard",
  "Date & time",
  "Game engine",
  "Material design",
  "Compiler",
  "Database",
  "Functional programming",
  "HTTP client / AJAX",
  "Icon set",
  "Machine Learning",
  "Mobile",
  "PDF",
  "Performance",
  "SQL",
  "Scaffolding - generator",
  "Utils",
  "Validation",
  "Virtual DOM",
  "WebGL",
  "Boilerplate",
  "Reactive programming",
  "Slider",
  "Types",
  "Authentication",
  "Desktop app",
  "Form",
  "Full-stack framework",
  "Image viewer",
  "JSON",
  "Layout",
  "Module - bundler",
  "Package - dependency",
  "Plugin / form widget",
  "Accessibility",
  "Audio",
  "Documentation",
  "Drawing",
  "Gesture - Touch",
  "Maps",
  "Math",
  "Microservices",
  "ORM",
  "Web workers",
  "Bootstrap",
  "File system",
  "Fuzzy search",
  "Syntax highlighting",
  "Browser storage",
  "CSS Processor",
  "Colors",
  "Data structure",
  "Diagram / Flow chart",
  "HTML & text parsing",
  "Linter",
  "Middleware",
  "Modal",
  "Notification",
  "Presentation",
  "Routing",
  "Templating",
  "Book",
  "Data fetching",
  "Internationalization i18n",
  "Logging",
  "MongoDB",
  "Offline",
  "Prefetch",
  "Queue",
  "Scraping",
  "Websocket",
  "Runtime",
  "Spreadsheet",
  "Stream",
  "Testing framework",
  "Typography",
  "Web Assembly",
  "Bot",
  "Browser compatibility",
  "Code Editor",
  "Decentralized",
  "Geometry",
  "IDE",
  "Serverless",
  "Svelte",
  "Virtual list",
  "Async flow / Promises",
  "Blockchain",
  "Caching",
  "Email",
  "Format tools",
  "Hook",
  "Input Mask",
  "IoT",
  "Keyboard",
  "Playground",
  "Regular expression",
  "Service Worker",
  "Tooltip",
  "Visual Programming",
  "Blog",
  "Code Parser",
  "Configuration",
  "Debugging",
  "Deno",
  "File upload",
  "Flux",
  "HTML template",
  "Meteor",
  "Money",
  "Monorepo",
  "RPC",
  "Random",
  "State machine",
  "Tour - Guide",
  "Analytics",
  "DOM manipulation",
  "Dev tool",
  "E-commerce",
  "Emoji",
  "Full-text search",
  "Markdown Editor App",
  "Node.js version management",
  "Prerender",
  "Process management",
  "Resource loader",
  "String",
  "Text processing",
  "Virtual Reality",
  "Window management",
  "XML",
  "API wrapper / SDK",
  "Archive",
  "Event sourcing",
  "Font",
  "Menu",
  "Print",
  "Styleguide",
  "Tree / Explorer component",
  "WebRTC",
  "Worker thread",
  "CAD",
  "CSV",
  "Crypto",
  "Crypto-currency",
  "Git",
  "Neural network",
  "Progress bar",
  "Statistics",
  "Workflow automation",
  "Meta",
];

async function main() {
  // reset all
  await prisma.tagsOnPosts.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.tag.createMany({
    data: tagNames.map((t) => ({ name: t })),
    skipDuplicates: true,
  });
  await prisma.activity.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  // create users
  const user1Id = "e141ecbf-0857-474b-9fc7-4d3f456135c5";
  const user2Id = uuid();
  const password = await bcrypt.hash("Marmel899@", 10);
  const user1 = await prisma.user.create({
    data: {
      id: user1Id,
      email: "idarase@gmail.com",
      name: "Ilya Daraseliya",
      nickname: "darasus",
      password,
      image:
        "https://imagedelivery.net/1Y4KoCbQQUt_e_VWvskl5g/ca74724d-1c39-4cc7-5bb3-237120eeda00/public",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: user2Id,
      email: "ilya.daraseliya@gmail.com",
      name: "Ilya Daraseliya",
      nickname: "darasus2",
      password,
      image:
        "https://imagedelivery.net/1Y4KoCbQQUt_e_VWvskl5g/ca74724d-1c39-4cc7-5bb3-237120eeda00/public",
      followers: {
        create: {
          follower: {
            connect: {
              id: user1Id,
            },
          },
        },
      },
    },
  });

  // create posts
  const tags = await prisma.tag.findMany();
  Array.from({ length: 1000 }).forEach(async () => {
    const postId = cuid();
    await prisma.post.create({
      data: {
        codeLanguage: CodeLanguage.JAVASCRIPT,
        id: postId,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        content: faker.lorem.sentence(),
        published: true,
        tags: {
          create: {
            tagId: faker.random.arrayElement(tags).id,
          },
        },
        author: {
          connect: {
            id: user1Id,
          },
        },
      },
    });
  });
}

main();
