function imgResize(file, callback,callback1) {
  var fileReader = new FileReader()
  fileReader.onload = function () {
    var IMG = new Image()
    IMG.src = this.result
    callback1(this.result);
    IMG.onload = function () {
      var w = this.naturalWidth
      var h = this.naturalHeight
      var resizeW = 0
      var resizeH = 0
      // maxSize 是压缩的设置，设置图片的最大宽度和最大高度，等比缩放，level是报错的质量，数值越小质量越低
      var maxSize = {
        width: 400,
        height: 400,
        level: 0.7
      }
      if (w > maxSize.width || h > maxSize.height) {
        var multiple = Math.max(w / maxSize.width, h / maxSize.height)
        resizeW = w / multiple
        resizeH = h / multiple
      } else {
        // 如果图片尺寸小于最大限制，则不压缩直接上传
        return callback(file)
      }
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      if (window.navigator.userAgent.indexOf('iPhone') > 0) {
        canvas.width = resizeH
        canvas.height = resizeW
        ctx.rotate(90 * Math.PI / 180)
        ctx.drawImage(IMG, 0, -resizeH, resizeW, resizeH)
      } else {
        canvas.width = resizeW
        canvas.height = resizeH
        ctx.drawImage(IMG, 0, 0, resizeW, resizeH)
      }
      var base64 = canvas.toDataURL('image/jpeg', maxSize.level)
      convertBlob(window.atob(base64.split(',')[1]), callback)
    }
  }
  fileReader.readAsDataURL(file)
}

function convertBlob(base64, callback) {
  var buffer = new ArrayBuffer(base64.length)
  var ubuffer = new Uint8Array(buffer)
  for (var i = 0; i < base64.length; i++) {
    ubuffer[i] = base64.charCodeAt(i)
  }
  var blob
  try {
    blob = new Blob([buffer], {
      type: 'image/jpg'
    })
  } catch (e) {
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
    if (e.name === 'TypeError' && window.BlobBuilder) {
      var blobBuilder = new Blob()
      blobBuilder.append(buffer)
      blob = blobBuilder.getBlob('image/jpg')
    }
  }
  callback(blob)
}

// function callback1(fileResize, callback) {
//   var data = new FormData()
//   data.append('file', fileResize, 'test.jpg')
//   // 回调 数据请求
//   callback(data)
// }
export default imgResize
