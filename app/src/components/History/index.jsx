import React, { useEffect, useRef, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import IsSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { GoDotFill } from "react-icons/go";
import { Select, Option } from "@material-tailwind/react";
import { MobileDatePicker } from "@mui/x-date-pickers";

dayjs.extend(isSameOrBefore);
dayjs.extend(IsSameOrAfter);

const History = ({ trashData }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [startValue, setStartValue] = useState(dayjs("2024-11-01"));
    const [endValue, setEndValue] = useState(dayjs());
    const [date, setDate] = useState(null);
    const [label, setLabel] = useState("");
    const selectRef1 = useRef(null);
    const selectRef2 = useRef(null);
    const handleOnChange = (e) => {
        setLabel(e);
    };
    useEffect(() => {
        if (trashData.length > 0) {
            setFilteredData(trashData);
        }
    }, [trashData]);
    useEffect(() => {
        if (label !== "all") {
            const filtered = trashData.filter(
                (item) => item.label.toLowerCase() === label
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(trashData);
        }
    }, [label]);

    useEffect(() => {
        if (startValue && endValue) {
            const filtered = trashData.filter(
                (item) =>
                    dayjs(item.detected_at).isSameOrAfter(startValue) &&
                    dayjs(item.detected_at).isSameOrBefore(endValue)
            );
            setFilteredData(filtered);
        }
    }, [startValue, endValue]);

    useEffect(() => {
        if (selectRef1.current) {
            selectRef1.current.classList.remove("min-w-[200px]");
        }
        if (selectRef2.current) {
            selectRef2.current.classList.remove("min-w-[200px]");
        }
    }, []);
    return (
        <div className="flex flex-col px-4 h-full w-full overflow-auto">
            <div className="max-h-[40vh]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                        <div className="flex w-full justify-between space-x-5">
                            <DemoItem
                                className="w-1/2"
                                label="Select start date"
                            >
                                <MobileDatePicker
                                    defaultValue={startValue}
                                    onChange={(newValue) =>
                                        setStartValue(newValue)
                                    }
                                />
                            </DemoItem>
                            <DemoItem className="w-1/2" label="Select end date">
                                <MobileDatePicker
                                    defaultValue={endValue}
                                    onChange={(newValue) =>
                                        setEndValue(newValue)
                                    }
                                />
                            </DemoItem>
                        </div>
                    </DemoContainer>
                </LocalizationProvider>

                <div className="flex flex-col justify-center items-center mt-5 mb-3">
                    <div className="flex w-full justify-between gap-5">
                        <div className="flex-1 !min-w-0">
                            <Select
                                label="Select Label"
                                onChange={handleOnChange}
                                defaultValue="All"
                                className="w-full"
                                ref={selectRef1}
                            >
                                <Option value="all" key="0">
                                    All
                                </Option>
                                <Option value="plastic" key="1">
                                    Plastic
                                </Option>
                                <Option value="metal" key="2">
                                    Metal
                                </Option>
                                <Option value="paper" key="3">
                                    Paper
                                </Option>
                                {/* {types.map((type, index) => (
                                    <Option key={index+1} value={type.toLowerCase()}>{type}</Option>
                                ))} */}
                            </Select>
                        </div>
                        <div className="flex-1 min-w-0">
                            <Select
                                label="Select Status"
                                defaultValue={"Collected"}
                                className="w-full"
                                ref={selectRef2}
                            >
                                <Option value="collected">Collected</Option>
                                <Option value="not_collected">
                                    Not Collected
                                </Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[40px] font-semibold">
                <h2>Trash detection history</h2>
                <div className="bg-white shadow-md rounded-lg overflow-auto">
                    <ul>
                        {filteredData.map((item, index) => (
                            <li
                                key={index}
                                className="border-b border-gray-200 p-4 flex justify-between"
                            >
                                <div>
                                    <p>{item.label}</p>
                                    <p className="text-sm text-gray-500">
                                        Detected at:{" "}
                                        {dayjs(item.detected_at).format(
                                            "YYYY-MM-DD HH:mm:ss"
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <GoDotFill
                                        className={
                                            item.is_collected
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }
                                    />
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
