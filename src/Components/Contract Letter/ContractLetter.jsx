// File: ContractLetter.jsx
import React from "react";
import Sidebar from "../Sidebar/Sidebar";

const ContractLetter = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[25%] bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto p-8 bg-white text-black font-sans border border-gray-300">
          {/* DATE */}
          <div className="flex justify-start mb-4">
            <p className="font-bold">
              DATE: <span className="font-bold">10/06/2025</span>
            </p>
          </div>

          {/* TITLE */}
          <h1 className="text-center font-bold underline mb-6">
            CONTRACT LETTER
          </h1>

          {/* FIRST PARTY SECTION */}
          {[
            {
              label: "FIRST PARTY",
              placeholder:
                " ة جᣎ ᡫ  للخدمات الᘘحᗫᖁة ᣃكة الشخص الواحد",
            },
            { label: "VISA No.", placeholder: "1304977335" },
            { label: "VISA ID", placeholder: "7001769202" },
          ].map((item, index) => (
            <div key={index} className="mb-3 flex items-center">
              <label className="w-56">{item.label}</label>
              <input
                type="text"
                placeholder={item.placeholder}
                className="flex-1 border-none bg-transparent pl-10 text-black focus:outline-none placeholder-black"
              />
            </div>
          ))}

          <hr className="border-black my-6" />

          {/* SECOND PARTY SECTION */}
          {[
            {
              label: "SECOND PARTY NAME",
              placeholder: "WAJAHAT MALIK S/O MUNIR AHMED MALIK",
            },
            { label: "PASSPORT No", placeholder: "GW0767311" },
            { label: "TRADE", placeholder: "عامل تنظيف ع" },
            { label: "SALARY", placeholder: "1700 SR" },
          ].map((item, index) => (
            <div key={index} className="mb-3 flex items-center">
              <label className="w-56">{item.label}</label>
              <input
                type="text"
                placeholder={item.placeholder}
                className="flex-1 border-none bg-transparent pl-10 font-bold text-black focus:outline-none placeholder-black"
              />
            </div>
          ))}

          <hr className="border-black my-4" />

          {/* TERMS & CONDITIONS */}
          <h2 className="font-bold mb-4 underline">TERMS & CONDITIONS</h2>
<ol className="list-decimal pl-6 space-y-4 text-justify">
  <li>
    CONTRACT IS FOR ONE YEAR. RECRUITED PERSONNEL WILL BE ON A PROBATION PERIOD OF 90 DAYS. CONFIRMATION WILL BE GRANTED UPON SUCCESSFUL COMPLETION OF THIS PERIOD.
  </li>
  <li>
    WORKING HOURS WILL BE 08 HOURS PER DAY AND 48 HOURS PER WEEK.
  </li>
  <li>
    FOOD WILL BE PROVIDED BY THE COMPANY.
  </li>
  <li>
    FREE ACCOMMODATION AND TRANSPORTATION WILL BE PROVIDED BY THE COMPANY.
  </li>
  <li>
    A FREE ROUND-TRIP TICKET WILL BE PROVIDED UPON COMPLETION OF ONE YEAR OF SERVICE.
  </li>
  <li>
    MEDICAL SERVICES WILL BE AVAILABLE FOR THE EMPLOYEE ONLY, AS PER PRIVATE SECTOR STANDARDS IN KSA.
  </li>
  <li>
    ALL OTHER BENEFITS WILL BE PROVIDED ACCORDING TO SAUDI LABOR LAW.
  </li>
</ol>


          {/* THANKING YOU */}
          <p className="mt-6 ml-6">THANKING YOU</p>

          {/* SIGNATURE SECTION */}
          <div className="flex justify-between mt-12">
            {/* PROMOTER */}
            <div className="ml-12">
              <p className="font-bold">PROMOTER:</p>
              <p className="mt-4 font-bold">QURESHI BROTHERS OEP</p>
              <p className="font-bold">0696/RWP</p>
            </div>

            {/* SECOND PARTY */}
           {/* SECOND PARTY */}
<div className="mr-12">
  <p className="font-bold">SECOND PARTY SIGN & THUMB</p>
  <p className="mt-4 font-bold">WAJAHAT MALIK</p>
  <div className="border-t border-black w-48 mt-8"></div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractLetter;