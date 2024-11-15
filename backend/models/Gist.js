// models/Gist.js
const mongoose = require('mongoose');

const GistSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    filePath: {
        type: String // Local file system path where the gist is saved
    }
});

module.exports = mongoose.model('Gist', GistSchema);
