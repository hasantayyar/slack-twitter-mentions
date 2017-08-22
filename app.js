const twitter = require('twitter');
const config = require('config');
const request = require('request');

const options = {
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
};

const client = new twitter(options);

const postSlack = (text) => request({
  url: config.slackHookUrl,
  method: 'post',
  json: true,
  body: {
    channel: '#mentions',
    text,
    username: 'slack-bot',
    icon_emoji: ':robot_face:'
  }
});

var stream = client.stream('statuses/filter', {
  track: 'anyKeywordThatYouWantToTrack'
});
stream.on('data', (event) => {
  if (!event || !event.user) return;
  console.log(event.text)
  postSlack('\nhttps://twitter.com/' + event.user.screen_name + '/status/' + event.id_str);
});

stream.on('error', function(error) {
  throw error;
});