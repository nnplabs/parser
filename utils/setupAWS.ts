import fs from "fs"

export const setupAWS = async () => {
    try {
        fs.mkdirSync('~/.aws', {recursive: true});
        await fs.promises.writeFile('~/.aws/credentials', `[default]\naws_access_key_id = ${process.env.AWS_KEY_ID}\naws_secret_access_key = ${process.env.AWS_ACCESS_KEY}`)
    } catch(e) {
        console.log(e)
    }
} 