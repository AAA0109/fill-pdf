
export const convertToBase64 = async (file) => {
  return new Promise(resolve => {
    let base64;
    let fileReader = new FileReader()
    fileReader.onload = (loadEvent => {
      base64 = loadEvent.target.result
      resolve(base64.substring(28));
    })
    fileReader.readAsDataURL(file)
  })
}

export const convertBase64ToBlob = (base64str) => {
  var binary = window.atob(base64str.replace(/\s/g, ''));
  var len = binary.length;
  var buffer = new ArrayBuffer(len);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
  }

  // create the blob object with content-type "application/pdf"               
  var blob = new Blob( [view], { type: "application/pdf" });
  var url = URL.createObjectURL(blob);
  return { 
    blob, url
  }
}