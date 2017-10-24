import axios from "axios";
import { API_PATHS, API_URL } from "../config/";

export function fileUpload(files, callbackFunc, returnObj = {}) {
  let data = new FormData();
  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    data.append("files[]", file, file.name);
  }

  const config = {
    headers: { "content-type": "multipart/form-data" },
    onUploadProgress: function(progressEvent) {
      var percentCompleted = Math.round(
        progressEvent.loaded * 100 / progressEvent.total
      );
      console.log(percentCompleted);
    }
  };

  return new Promise(function(resolve, reject) {
    axios
      .post(API_URL + API_PATHS["upload"], data, config)
      .then(function(res) {
        console.log(res.data);
        if (res.data.success && res.data.url) {
          resolve(res.data.url);
        } else {
          reject();
        }
      })
      .catch(function(err) {
        // alert('file upload failed');
        reject();
      });
  });
}
