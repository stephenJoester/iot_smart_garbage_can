import React, { useEffect, useState } from "react";
import Swipe from "../Swipe";
import Overview from "../Overview";
import History from "../History";
import API from "../../api";

const MainContent = ({ refreshFlag }) => {
    const [trashData, setTrashData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await API.get("/trash/all");
            if (response.status === 200) {
                setTrashData(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(); 
    }, [refreshFlag]);
    return (
        <Swipe>
            <Overview trashData={trashData} />
            <History trashData={trashData} />
        </Swipe>
    );
};

export default MainContent;
