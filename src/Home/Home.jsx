import React, { useEffect, useState } from "react";
import TagSection from "./TagSection";
import ShowPosts from "./ShowPosts";
import Announcements from "./Announcements";
import axios from "axios";

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get("http://localhost:5000/announcements");
                // ✅ Correctly access announcements array
                setAnnouncements(Array.isArray(res.data.announcements) ? res.data.announcements : []);
            } catch (err) {
                console.error("Error fetching announcements:", err.message);
                setAnnouncements([]);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-1.5">
            <TagSection />
            <ShowPosts />
            {announcements.length > 0 && <Announcements announcements={announcements} />}
        </div>
    );
};

export default Home;
