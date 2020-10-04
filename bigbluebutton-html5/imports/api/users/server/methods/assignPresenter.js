import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis';
import Logger from '/imports/startup/server/logger';
import Users from '/imports/api/users';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function assignPresenter(userId) { // TODO-- send username from client side
  console.log('assignPresenter userId original', userId)
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'AssignPresenterReqMsg';

  const { meetingId, requesterUserId } = extractCredentials(this.userId);
  check(userId, String);

  const User = Users.findOne({
    meetingId,
    userId,
  });

  if (!User) {
    throw new Meteor.Error('user-not-found', 'You need a valid user to be able to set presenter');
  }

  const payload = {
    newPresenterId: userId,
    newPresenterName: User.name,
    assignedBy: requesterUserId,
    requesterId: requesterUserId,
  };

  Logger.verbose(`User '${userId}' setted as presenter by '${
    requesterUserId}' from meeting '${meetingId}'`);

  return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}
