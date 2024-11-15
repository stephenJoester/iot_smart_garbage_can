import React, { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Gauge } from 'react-circular-gauge'
import CustomSwitch from '../Switch';
import {Divider} from "antd"
import { Alert } from "@mui/material";
import { supabase } from "../../config/supabaseClient";

const Overview = ({trashData}) => {
    const [percentage, setPercentage] = useState(0)
    const [notification, setNotification] = useState(false)
    useEffect(() => {
        const calculatePercentage = () => {
            const uncollectedCount = trashData.filter(item => !item.is_collected).length;
            // console.log(`Uncollected trash count: ${uncollectedCount}`);
            setPercentage((uncollectedCount / 100) * 100);
        }
        calculatePercentage()
    }, [trashData])

    useEffect(() => {
      const trashFullChannel = supabase
      .channel('trash-full-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'trash_full_notifications' },
        payload => {
          console.log('Trash full notification:', payload.new)
          setNotification(payload.new)
        }
      )
      .subscribe()

      return () => {
        supabase.removeChannel(trashFullChannel)
      }
    }, [])
  return (
    <div className="flex flex-col px-4 h-full mb-10">
      <div className="border border-gray-300 rounded-xl my-4 flex p-4">
        <div className="py-2">
          <p className="text-xs text-gray-600">
            App is connected with the bin. Now you can monitor the bin status.
          </p>
        </div>
        <div className="flex items-center">
          <FaRegCircleCheck className="text-2xl text-green-400" />
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl flex flex-col p-4 mb-4 grow">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Connection</p>
          <div>
            {/* <Switch defaultChecked  /> */}
            <CustomSwitch />
          </div>
        </div>
        <div className="flex justify-center items-center my-10">
          <Gauge
            value={percentage}
            minValue={0}
            maxValue={100}
            startAngle={180}
            endAngle={180}
            renderBottomLabel="filled"
            arcColor="#49b2f4"
            trackColor="#e5e7eb"
            renderValue={({ value }) => `${value}%`}
            style={{ width: "200px", height: "200px" }}
            valueStyle={{ fontSize: "36px" }}
            bottomLabelStyle={{ fontSize: "24px" }}
          />
        </div>
        {notification && notification.is_full ? (
          <Alert severity="warning">{notification.message}</Alert>
        ) : notification && !notification.is_full ? (
          <Alert severity="success">{notification.message}</Alert>
        ) : (<></>)}
        <Divider className="border-2 border-gray-200" />
        <div className="flex w-full justify-between h-full overflow-auto">
          {/* <div className='w-full h-full max-w-full max-h-full'>
                    <Swipe/>
                </div> */}
          <div className="w-1/2">
            <p>Amount of detected trash : {trashData.length}</p>
          </div>
          <Divider type="vertical" className="border-2 border-gray-200 h-1/2" />
          <div className="w-1/2">
            Calculated from 1/10/2024 to {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
