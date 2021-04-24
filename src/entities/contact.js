import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';

export const ContactSchema = new Schema(
    {
        //  define the necessary fields for your contact list
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        number: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            required: true
        },
        address: {
            type: String,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            required: true
        },
    },
    { collection: 'contacts' }
)

ContactSchema.plugin(timestamps);
ContactSchema.plugin(mongooseStringQuery);

ContactSchema.index({ number: 1, fullname: 1 });
export default mongoose.model('Contact', ContactSchema);
