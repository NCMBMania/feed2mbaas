const FeedMe = require('feedme');
const https = require('https');
const config = require('./config');

const applicationKey = config.applicationKey;
const clientKey = config.clientKey;
const NCMB = require('ncmb');
const ncmb = new NCMB(applicationKey, clientKey);
const News = ncmb.DataStore(config.className);

https.get(config.feedUrl, (res) => {
  if (res.statusCode != 200) {
    console.error(new Error(`status code ${res.statusCode}`));
    return;
  }
  var parser = new FeedMe();
  parser.on('item', (item) => {
    News
      .equalTo(url, item.id)
      .fetch()
      .then((data) => {
        if (Object.keys(data).length > 0) return;
        const acl = new ncmb.Acl;
        acl
          .setPublicReadAccess(true)
          .setRoleWriteAccess(config.roleName, true);
        const article = new News;
        return article
          .set('title', item.title)
          .set('content', item.content.text)
          .set('url', item.id)
          .set('published', new Date(item.published))
          .set('acl', acl)
          .save()
      })
      .then(() => {
        console.log('Saved.')
      })
      .catch((e) => console.error(e))
  });
  res.pipe(parser);
});
