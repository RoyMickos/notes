2023-09-04
Tags:

---
# Uploads and downloads with curl

Uploading with curl when you are not using multipart for uploading.

## PUT
`curl --header "Content-Type: image/jpeg" --upload-file drebin.jpg -v <upload-url>`

The upload-file parameter implies PUT. Data is put into the payload, and on the receiving end you need a body
parser for the `raw` type, listing the content-types you expect.

With POST, you cannot use upload-file as this implies PUT, so use this instead:

`curl --header "Content-Type: image/jpeg" --data-binary @drebin.jpg -v <upload-url>`

## GET

This is more straightforward

`curl --output <filename> url`

---
## References
1. 
