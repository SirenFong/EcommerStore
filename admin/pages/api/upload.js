
///code upload ảnh lên aws s3
import multiparty from 'multiparty'
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from 'fs'
import mime from 'mime-types'
const bucketName = 'ecommerstore'
export default async function handle(req, res) {
    ////Câu lệnh thêm vô ở admin security
    await mongooseConnect();

    await isAdminRequest(req, res)


    //tạo form cho tệp tải lên
    const form = new multiparty.Form()
    //tạo hàm Promise thể hiện sự hoàn thành (hoặc thất bại) cuối cùng của một hoạt động không 
    //đồng bộ và giá trị kết quả của nó.Để tìm hiểu về cách chuyên nghiệp
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files })

        })
    });
    console.log('length:', files.file.length);

    const client = new S3Client({
        region: 'ap-southeast-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    })
    //tạo 1 file mới và đẩy ảnh ảnh lên bucket của aws
    const links = []
    for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '-' + '.' + ext
        console.log({ ext, file })
        await client.send(new PutObjectCommand({
            Bucket: bucketName,//tên bucket(folder)
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path)
        }));
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link)
    }


    return res.json({ links })

}
export const config = {
    api: { bodyParser: false },

} 