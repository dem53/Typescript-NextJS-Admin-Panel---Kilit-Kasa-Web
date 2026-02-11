export const getJwtSecret = () : string => {
    const secret = process.env.JWT_SECRET;
    if (!secret){
        throw new Error('JWT_SECRET Key mevcut değil!');
    }
    return secret;
}