import * as _ from 'lodash';

export const Comment = function (_node) {
  _.extend(this, _node.properties);
};

export const User = function (_node) {
  _.extend(this, _.omit(_node.properties, ['password']));
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

export const Activity = function (_node) {
  _.extend(this, _node.properties);
};

export const Follow = function (_node) {
  _.extend(this, _node.properties);
};
