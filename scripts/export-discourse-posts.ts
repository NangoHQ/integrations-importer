import axios from 'axios';
import * as fs from 'fs';
import { Nango } from '@nangohq/node';

const exportDiscoursePosts = async () => {
    const secretKey = process.env['NANGO_SECRET_KEY'];
    const connectionId = process.env['NANGO_CONNECTION_ID'] || 'global';

    const nango = new Nango({ secretKey });

    const filePath = 'discourse_posts.json';

    // Load existing posts if file exists, else start with empty array
    let existingPosts: any[] = [];
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        try {
            existingPosts = JSON.parse(content);
        } catch (err) {
            console.error('Invalid JSON in file. Overwriting with fresh array.');
            existingPosts = [];
        }
    }

    // Get all requests and paginate using the `before` query param
    let before: string | undefined = undefined;

    while (true) {
        const response = await nango.get({
            connectionId,
            providerConfigKey: 'discourse',
            endpoint: '/posts.json',
            params: {
                before,
                limit: 100,
            },
        });

        const posts = response.data.latest_posts;
        if (!posts || posts.length === 0) break;

        const filteredPosts = posts.filter((post: any) => {
            return (
                !post.topic_title.includes('Getting Started') &&
                post.username !== 'system' &&
                !post.topic_title.includes('About the ')
            );
        });

        existingPosts.push(...filteredPosts);

        // Update `before` for next iteration
        before = posts[posts.length - 1].id;
    }

    // Write the updated array back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingPosts, null, 2));
};

exportDiscoursePosts();
