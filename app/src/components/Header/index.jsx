import { FaArrowLeft } from "react-icons/fa6";
import { VscSettings } from "react-icons/vsc";
import { FaRegBell } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
const Header = ({ onRefresh }) => {
    return (
        <div className="bg-[#49b2f4] h-full flex-col px-4 rounded-b-2xl">
            <div className="flex justify-between pt-6 w-full">
                <div>
                    <FaArrowLeft className="text-white text-2xl font-bold" />
                </div>
                <h1 className="text-white font-semibold">Smart Garbage Bin</h1>
                <VscSettings className="text-white text-3xl font-bold" />
            </div>

            <div className="bg-white rounded-lg w-full p-4 mt-5 flex gap-2 shadow-md">
                <p className="text-sm">
                    Remember to check notifications when the bin is full
                </p>
                <div className="flex items-center relative">
                    <div className="relative p-1 rounded-full active:bg-gray-200 cursor-pointer">
                        <FaRegBell className="text-blue-400 text-2xl" />
                        <span className="absolute top-1 right-0 block h-[6px] w-[6px] rounded-full bg-red-500" />
                    </div>
                    <IoMdRefresh className="text-blue-400 text-2xl ml-3 active:bg-gray-200 rounded-full cursor-pointer" onClick={onRefresh}/>
                </div>
            </div>
        </div>
    );
}

export default Header;
