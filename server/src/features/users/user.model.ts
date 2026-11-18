import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        avatarUrl: {
            type: String,
        },
        // Gmail sync karne ke liye refresh token save karna padega (future use)
        // googleRefreshToken: { type: String }
    }, 
    {
        timestamps: true 
    }
)

export const User = mongoose.model('User', userSchema);
