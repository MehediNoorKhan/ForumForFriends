import React from 'react';
import TagSection from './TagSection';
import ShowPosts from './ShowPosts';
import Announcements from './Announcements';

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto space-y-1.5'>
            <TagSection></TagSection>
            <ShowPosts></ShowPosts>
            <Announcements></Announcements>
        </div>
    );
};

export default Home;