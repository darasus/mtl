import * as _ from 'lodash';

export const Comment = function (_node) {
  _.extend(this, _node.properties);
};

export const User = function (_node) {
  const { nickname, name, email, id, createdAt, updatedAt, emailVerified } =
    _node.properties;

  _.extend(this, {
    nickname,
    name,
    email,
    id,
    createdAt,
    updatedAt,
    emailVerified,
  });
};

export const Post = function (_node) {
  _.extend(this, _node.properties);
};

export const Like = function (_node) {
  _.extend(this, _node.properties);
};

export const Tag = function (_node) {
  _.extend(this, _node.properties);
};
