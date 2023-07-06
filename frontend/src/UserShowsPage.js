import React, { useState, useEffect } from 'react'
import ItemList from './components/ItemList';
import { fetchInfo } from "./ShowsFetch";
import { getUserShows } from "./ApiRequest"

export default function UserShowsPage() {

    const [showsJson, setShowsJson] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getShows() {
            let dbShows = await getUserShows();
            let shows = await Promise.all(dbShows.map((show) => {
                return fetchInfo(show.show);
            }));
            setShowsJson(shows);
            setIsLoading(false);
        }
        getShows();
    }, []);


    return (
        <div>
            <ItemList isLoading={isLoading} showsJson={showsJson} />
        </div>
    )
}