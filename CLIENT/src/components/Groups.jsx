import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import useAxios from "../hooks/useAxios";
import {Link } from 'react-router-dom'

const Groups = () => {
    const { user, isLoggedIn } = useContext(UserContext);
    const [groups, setGroups] = useState([]);
    const axiosInstance = useAxios();

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
        </div>
    );
};

export default Groups;
