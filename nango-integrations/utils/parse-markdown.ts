// Function to extract the "Getting Started" section from the MDX content
export const extractGettingStarted = (mdxContent: string): string | null => {
    const gettingStartedRegex = /## Getting started([^##]+)/i;
    const match = mdxContent.match(gettingStartedRegex);

    if (match && match[1]) {
        return match[1].trim();
    }

    return null;
};

// Function to remove HTML-like tags, including <Tip>...</Tip>
export const removeHtmlLikeTags = (content: string): string => {
    return content.replace(/<[^>]+>.*<\/[^>]+>/g, '').trim();
};

// Function to format markdown links and handle incomplete links
export const formatMarkdownLinks = (content: string): string => {
    // This regex will match both complete and incomplete markdown links
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)\s]+)\)?/g;

    // Replace markdown links with "link text: url", handling missing closing parenthesis
    return content.replace(markdownLinkRegex, (match, linkText, url) => {
        if (!url.endsWith(')')) {
            return `${linkText}: ${url}`;
        } else {
            return `${linkText}: ${url.slice(0, -1)}`; // Remove the closing parenthesis
        }
    });
};
