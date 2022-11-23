// @ts-ignore
import { FileUpload } from "graphql-upload";

export default async function createBufferFromReadStreamFile(file: FileUpload): Promise<Buffer> {
    const { createReadStream } = file;

    const stream = createReadStream();
    const chunks = [];

    return await new Promise<Buffer>((resolve, reject) => {
        let buffer: Buffer;

        stream.on('data', function (chunk) {
          chunks.push(chunk);
        });

        stream.on('end', function () {
          buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        stream.on('error', reject);
    });
}

export async function createBase64FromBuffer(file: FileUpload): Promise<string> {
    const buffer = await createBufferFromReadStreamFile(file)

    return buffer.toString('base64');
}