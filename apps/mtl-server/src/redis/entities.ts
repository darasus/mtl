import { TPost } from '@mtl/types';
import * as _ from 'lodash';
import { Record } from 'redisgraph.js/types';
import invariant = require('invariant');

export const Comments = function (record: Record) {
  const comments = record.get('Comments') as any;

  return comments.map((c) => _.extend({}, c.properties));
};

export const Comment = function (_node: any) {
  return _.extend({}, _node.properties);
};

export const User = function (record: Record) {
  const author = record.get('author') as any;
  const user = record.get('user') as any;
  const props = author?.properties || user?.properties;

  return _.extend({}, _.omit(props, ['password', 'emailVerified']));
};

export const Post = function (record: Record): TPost {
  const post = record.get('post') as any;
  const tags = record.get('Tags') as any;
  const likesCount = record.get('LikesCount') as any;
  const comments = record.get('Comments') as any;
  const commentsCount = record.get('CommentsCount') as any;

  invariant(post?.properties, 'Post is not defined');

  return _.extend(
    {},
    post.properties,
    {
      author: User(record),
    },
    tags ? { tags: Tags(record) } : {},
    likesCount ? { likesCount } : {},
    commentsCount ? { commentsCount } : {},
    comments ? { comments: Comments(record) } : {}
  );
};

export const Tags = function (record: Record) {
  const tags = record.get('Tags') as any;

  return tags.map((t) => _.extend({}, t.properties));
};

export const Tag = function (record: Record) {
  const tag = record.get('tag') as any;

  return _.extend({}, tag.properties);
};

export const Activity = function (record: Record) {
  const activity = record.get('activity') as any;
  const post = record.get('post') as any;

  return _.extend(
    {},
    activity.properties,
    { author: User(record) },
    post ? { post: Post(record) } : {}
  );
};

export const Follow = function (_node: any) {
  return _.extend({}, _node.properties);
};
