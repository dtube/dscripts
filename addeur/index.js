const { spawn, exec } = require('child_process')
var fs = require('fs')

if (process.argv.length <= 2) {
    console.log("Needs a path");
    process.exit(-1);
}

var path = process.argv[2]

fs.readdir(path, function(err, items) {
  //console.log(items)
  
  if (items && items.length > 0) {
    var hash = items[0]
    var file = path+'/'+hash
    var cmd = 'ipfs'
    const args = ['add', '-t', file];

    const proc = spawn(cmd, args)
    var first = true
    proc.stderr.on('data', function(data) {
      if (data.toString().indexOf('100.00%') > -1) {
        console.log(data.toString())
      }
      else if (data.toString().indexOf('%') > -1) {
        process.stdout.write(data.toString())
      }
    })
    proc.stdout.on('data', function(data) {
      if (data.toString().split(' ')[1] == hash
      && data.toString().split(' ')[2].replace('\n', '') == hash
      && data.toString().split(' ')[0] == 'added') {
	proc.kill()
        console.log('Pinned: '+hash)
	const delProc = spawn('rm', [file])
        proc.on('exit', function (exitCode) {
          console.log("RM: " + exitCode);
        });
      } else if (data.toString().length > 10) {
        console.log('Non-matching: '+hash+' vs '+data.toString().split(' ')[1])
	exec('mv ~/videos/'+hash+' ~/videosnonmatching/', (err, stdout, stderr) => {
          //console.log(`${stdout}`)
        })
        proc.kill()
      }
    })
    proc.on('exit', function (exitCode) {
      console.log("IPFS: " + exitCode);
    });
  } else {
    setTimeout(function() { process.exit() }, 1000)
  }
});
