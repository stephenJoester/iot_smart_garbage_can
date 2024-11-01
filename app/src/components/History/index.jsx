import React, { useEffect, useState } from "react";
import API from "../../api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

const History = ({trashData}) => {
  const [value, setValue] = useState([dayjs().subtract(2, "day"), dayjs()]);
  return (
    <div className="flex flex-col px-4 h-full overflow-auto">
      <div className="h-1/4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateRangePicker", "DateRangePicker"]}>
            <DemoItem label="Select date range" component="DateRangePicker">
              <DateRangePicker
                defaultValue={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div className="mt-4 font-semibold">
        <h2>Trash detection history</h2>
        <div className="bg-white shadow-md rounded-lg overflow-scroll">
          <ul>
            {trashData.map((item, index) => (
              <li
                key={index}
                className="border-b border-gray-200 p-4 flex justify-between"
              >
                <div>
                  <p>{item.label}</p>
                  <p className="text-sm text-gray-500">
                    Detected at:{" "}
                    {dayjs(item.detected_at).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default History;
