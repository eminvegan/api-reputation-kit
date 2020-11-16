import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const GoogleSchema = new Schema({
    authorProfileUrl: {
        type: String
    },
    authorName: {
        type: String
    },
    authorReviewCount: {
        type: Number
    },
    publishDate: {
        type: String
    },
    stars: {
        type: Number
    },
    text: {
        type: String
    },
    thumbsUpCount: {
        type: Number
    }
});
