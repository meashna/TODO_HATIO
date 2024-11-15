// services/githubService.js
const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ensure this is set in your .env file

/**
 * Creates a GitHub Gist.
 * @param {string} description - Description of the gist.
 * @param {object} files - Files to include in the gist.
 * @param {boolean} isPublic - Whether the gist is public.
 * @returns {object} - The created gist data.
 */
const createGist = async (description, files, isPublic = false) => {
    try {
        const response = await axios.post(
            'https://api.github.com/gists',
            {
                description,
                public: isPublic,
                files,
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Failed to create gist');
    }
};

module.exports = { createGist };
