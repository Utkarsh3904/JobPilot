import {createOAuthClient} from '../config/google';
import {env} from '../config/env';
import {User} from '../models/user.model';
import {ApiError} from '../utils/ApiError';
import jwt from 'jsonwebtoken';

//why this is : the answer is this is for creating a jwt token for the user after successful login
export function getGoogleLoginUrl(state : string){

    return createOAuthClient().generateAuthUrl({
        scope : ["openid", "email", "profile"],
        state : state,
        prompt : "select_account"
    })
}

export async function loginWithGoogleCode(code: string) {
  const client = createOAuthClient();

  const { tokens } = await client.getToken(code);

  if (!tokens.id_token) throw new ApiError(400, "Invalid token");

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

    if(!payload || !payload.email) throw new ApiError(400, "Invalid token payload");

    let user = await User.findOneAndUpdate({
        googleId : payload.sub
    }, {
        $set : {
            email : payload.email, 
            name : payload.name,
            avatarUrl : payload.picture
        }
    },{upsert : true, returnDocument: 'after'})

    return user;
}


export function signToken(userId : string) {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn : 604800})
}


export async function getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(401, "User not found");
    return user;
}

