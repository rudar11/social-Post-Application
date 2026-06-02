const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
    privateKey: process.env.IMAGE_PRIVATE_KEY,
});



async function uploadfile(buffer) {
    const response = await client.files.upload({
        file: buffer.toString("base64"),
        fileName: 'image.jpg',
    });
    return response;
}



module.exports = uploadfile