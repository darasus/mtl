import { TPost } from '@mtl/types';
import * as _ from 'lodash';

export const Comment = function (_node: any) {
  return _.extend({}, _node.properties);
};

export const User = function (_node: any) {
  return _.extend({}, _.omit(_node.properties, ['password']));
};

export const Post = function (_node: any): TPost {
  return _.extend({}, _node.properties);
};

export const Tag = function (_node: any) {
  return _.extend({}, _node.properties);
};

export const Activity = function (
  _activityNode: any,
  _authorNode: any,
  _postNode: any
) {
  return _.extend(
    {},
    _activityNode.properties,
    { author: _authorNode.properties },
    { post: _postNode?.properties || null }
  );
};

export const Follow = function (_node: any) {
  return _.extend({}, _node.properties);
};
