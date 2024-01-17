import crypto from 'crypto';

const SECRET = process.env.AUTH_HASH_SECRET;

if (!SECRET || SECRET.length < 20) {
    throw new Error("Undefined or incorrect authentification hashing secret.");
    
}

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};