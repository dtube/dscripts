const { exec } = require('child_process');
var steem = require('steem') // for connecting to the steem blockchain
steem.api.setOptions({ url: 'https://api.steemit.com' });
var jsonfile = require('jsonfile')
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'dtube'
});
connection.connect();

var config = jsonfile.readFileSync('./config.json')

var save = jsonfile.readFileSync('./save.json')
var laststamp = new Date(save[1].timestamp)
console.log(laststamp)
console.log(save[0]+' is the last transaction # processed')

setInterval(function() {
  //console.log('history', save[0]+config.limit, config.limit)
  steem.api.getAccountHistory('dtube', save[0]+config.limit, config.limit, function(err, history) {
    if (err) throw err;
    for (var i = 0; i < history.length; i++) {
      //console.log(save[0], history[i][0], history[i][1].timestamp, history[i][1].block, history[i][1].op)
      if (save[0] >= history[i][0]) continue;
      if (history[i][1].op[0] == 'comment_benefactor_reward') {
        var cbr = history[i][1].op[1]
        cbr.stamp = history[i][1].timestamp
        cbr.id = history[i][0]
        cbr.rewardcur = cbr.reward.split(' ')[1]
        cbr.reward = parseFloat(cbr.reward.split(' ')[0])
        cbr.rewardsp = cbr.reward*config["1MVest"]/1000000
        parseCbr(cbr, function(err) {
          //if (err) console.log(err.name);
        })
      } else {
        console.log('ignore', history[i][1].op[0])
      }
    }
    if (history.length > 0)
      saveFile(history[history.length-1])
  });
}, config.refreshTime)

function parseCbr(cbr,cb) {
  steem.api.getContent(cbr.author, cbr.permlink, function(e,r) {
    var video = JSON.parse(r.json_metadata).video
    if (!video) {
      cbr.videohash = null
      cbr.snaphash = null
    } else {
      cbr.snaphash = video.info.snaphash

      if (typeof video.info.spritehash != 'undefined')
        cbr.spritehash = video.info.spritehash
      if (typeof video.content.videohash != 'undefined')
        cbr.videohash = video.content.videohash
      if (typeof video.content.video480hash != 'undefined') {
        cbr.video480hash = video.content.video480hash
        pinOnIpfs(cbr.video480hash)
      }
        
      if (typeof video.content.video720hash != 'undefined')
        cbr.video720hash = video.content.video720hash
      if (typeof video.content.video1080hash != 'undefined')
        cbr.video1080hash = video.content.video1080hash
    }
    console.log(cbr.id+' '+cbr.author+'/'+cbr.permlink+' '+cbr.rewardsp)
    connection.query('INSERT INTO cbr SET ?', cbr, function (error, results, fields) {
      if (error) cb(error)
      else cb(null)
    });
  })
}

function saveFile(history) {
  //console.log(save[0], history[0], history[1].timestamp, history[1].block, history[1].op)
  jsonfile.writeFile('./save.json', history, function (error) {
    if (error) throw error;
    save = history
  })
}

function pinOnIpfs(hash) {
  if (!isValidHash(hash)) return;
  //exec('ipfs pin add '+hash, (err, stdout, stderr) => {
  exec('curl https://ipfs.io/ipfs/'+hash+' > ~/videostmp/'+hash, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      // node couldn't execute the command
      return;
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`${stdout}`);
      if (stderr && stderr.length>0)
        console.log(`e: ${stderr}`);
      exec('mv ~/videostmp/'+hash+' ~/videos/', (err, stdout, stderr) => {
        //console.log(`${stdout}`)
      })
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`${stdout}`);
    if (stderr && stderr.length>0)
      console.log(`e: ${stderr}`);
  });
}

function isValidHash(hash) {
  if (!hash.match(/^[a-zA-Z0-9]+$/))
    return false;
  if (hash.length != 46)
    return false;
  if (!hash.startsWith('Qm'))
    return false;
  return true;
}
