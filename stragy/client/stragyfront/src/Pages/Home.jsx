import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import theme from "../theme.js";
// import {getTrendingCLans} from "../services.clanService";
import {getClans, getPublicClans} from "../services/clanService";
// import {getFeed} from "../services/postService";

const Home () => {
    const [trending, setTrending] = useState([]);
    const [myClans, setMyClans] = useState([]) 
}