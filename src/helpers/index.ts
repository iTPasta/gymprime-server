import crypto from "crypto";

const SECRET = process.env.AUTH_HASH_SECRET;

if (!SECRET || SECRET.length < 20) {
    throw new Error("Undefined or incorrect authentification hashing secret.");
}

export const random = () => crypto.randomBytes(32).toString("base64");
export const authentication = (salt: string, password: string) => {
    return crypto
        .createHmac("sha256", [salt, password].join("/"))
        .update(SECRET)
        .digest("hex");
};

export const isEmailValid = (email: string) => {
    return (
        email.includes("@") &&
        email.length > 2 &&
        !email.startsWith("@") &&
        !email.endsWith("@")
    );
};

export const checkPasswordSecurity = (password: string) => {
    return (
        password.length > 7 &&
        password.match(/[a-z]+/) &&
        password.match(/[A-Z]+/) &&
        password.match(/[0-9]+/)
    );
};

export const removeOneElementFromArray = (array: any[], element: any) => {
    const index = array.indexOf(element);
    if (index > -1) {
        return array.splice(index, 1);
    } else {
        return array;
    }
};
