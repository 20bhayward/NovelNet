import React from 'react';

interface NovelItemProps {
    novel: {
        id: number;
        title: string;
        author: string;
        // Add other necessary properties here
    };
}

const NovelItem: React.FC<NovelItemProps> = ({ novel }) => {
    return (
        <div>
            Test
            <h3>{novel.title}</h3>
            <p>{novel.author}</p>
            {/* Render other novel details */}
        </div>
    );
};

export default NovelItem;
