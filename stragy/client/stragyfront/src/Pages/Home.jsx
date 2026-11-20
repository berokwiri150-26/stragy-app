import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import theme from "../theme.js";
// import {getTrendingCLans} from "../services.clanService";
import {getClans, getPublicClans} from "../services/clanService";
// import {getFeed} from "../services/postService";

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [myClans, setMyClans] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const [loading, setLoading] = useState (true);
    const {user} = useAuth();


useEffect(() => {
    let active = true;

    const clanrequest = user ? getClans(1,50) : getPublicClans(1,6);
    const feedRequest = user ? (1,4) : Promise.resolve(null);

    Promise.allSettled([getTrendingTrips(), clanRequest, feedRequest]).then (([trendingRes, clubsRes, feedRes]) => {
        if (!active) return;

        if (trendingRes.status === "fulfilled") {
            setTrending(trendingRes.value.data?.items || []);
        }

        if (clansRes.status === "fulfilled") {
            const allClans = clansRes.value.data?.items || clansRes.value.data || [];
            setMyClans(user ? allClans.filter((c) => c.is_member) : allClans);
        }

        if (feedRes?.status === "fulfilled" && feedRes.value) {
            setRecentPosts(feedRes.value.data?.items || feedRes.value.data || []);
        }

        setLoading(false);
    });

    return() => {
        active = false;
    };
}, [user]);

useEffect(() => {
    if (trending.length < 2) return;
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % Math.min(trending.length, 3));
    }, 30000);
    return () => clearInterval(interval);
  }, [trending]);

  const heroCandidates = trending.slice(0, 3);
  const featured = heroCandidates[currentFeaturedIndex];

};