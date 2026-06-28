import CryptoJS from 'crypto-js';
export const Decrypt = async (phone, SECRET_KEY = process.env.SECRET_KEY)=>{
    return CryptoJS.AES.decrypt(phone.phone , phone.SECRET_KEY).toString(CryptoJS.enc.Utf8)
}