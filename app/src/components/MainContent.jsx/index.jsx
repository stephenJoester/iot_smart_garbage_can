import React, { useEffect, useState } from 'react'
import { FaRegCircleCheck } from "react-icons/fa6";
import Swipe from '../Swipe';
import Overview from '../Overview';
import History from '../History';
import API from '../../api';

const MainContent = () => {
    const [trashData, setTrashData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await API.get("/trash/all");
            if (response.status === 200) {
              // console.log(response)
              setTrashData(response.data);
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
      }, []);
  return (
    <Swipe>
        <Overview trashData={trashData}/>
        <History trashData={trashData} />
    </Swipe>
  )
}

export default MainContent