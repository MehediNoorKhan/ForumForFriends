import React from 'react';
import TagSection from './TagSection';
import ShowPosts from './ShowPosts';

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto space-y-1.5'>
            <TagSection></TagSection>
            <ShowPosts></ShowPosts>
        </div>
    );
};

export default Home;