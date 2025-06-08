const download = require("download-git-repo")

function githubDownload({ templateUrl, projectName }) {
  return new Promise((resolve, reject) => {
    download(templateUrl, projectName, function (err) {
      if (err) {
        resolve({
          ret: 1001,
          msg: err
        })
      } else {
        resolve({
          ret: 0,
          msg: 'success'
        })
      }
    })
  })
}

module.exports = {
  githubDownload
}

