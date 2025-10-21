// File: UndertakingLetter.jsx
import React from "react";
import Sidebar from "../Sidebar/Sidebar";

const UndertakingLetter = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[25%] bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center p-6">
        <div className="w-[750px] min-h-[1250px] mx-auto p-10 bg-white text-black text-base leading-relaxed space-y-4 shadow-md">
          {/* Header */}
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-bold">THE ROYAL CONSULATE</p>
              <p className="font-bold">Kingdom of Saudi Arabia</p>
              <p className="font-bold">ISLAMABAD</p>
            </div>
            <div className="text-right">
              <label className="font-semibold">
                DATE:{" "}
                <input
                  type="date"
                  defaultValue="2025-06-10"
                  className="outline-none"
                />
              </label>
            </div>
          </div>

          {/* Subject */}
          <p className="font-bold">
            SUBJECT: <span className="font-bold underline">UNDERTAKING</span>

          </p>

          {/* Salutation */}
          <p>Dear Sir,</p>

          {/* Main Paragraph */}
          <p>
            We do hereby undertake{" "}
            <input
              type="text"
              placeholder="WAJAHAT MALIK"
              className="outline-none w-[135px] inline-block placeholder-black font-bold text-black"
            />{" "}
            S/O{" "}
            <input
              type="text"
              placeholder="MUNIR AHMED MALIK"
              className="outline-none w-[180px] inline-block placeholder-black font-bold text-black"
            />{" "}
            Passport No.{" "}
            <input
              type="text"
              placeholder="GW0767311"
              className="outline-none w-[90px] inline-block placeholder-black font-bold text-blac"
            />{" "}
            is proceeding to Saudi Arabia on visa No.{" "}
            <input
              type="text"
              placeholder="1304977335"
              className="foutline-none w-[90px] inline-block placeholder-black font-bold text-blac"
            />{" "}
            under sponsor ID{" "}
            <input
              type="text"
              placeholder="7001769202"
              className="outline-none w-[95px] inline-block placeholder-black font-bold text-black"
            />
            . This candidate has no valid Saudi visa, if he is deported back
            from the Kingdom of Saudi Arabia, we should be held responsible for
            that.
          </p>

          {/* Extra Note */}
          <p>
            IF there is any minor mistake in E- number “profession” due to
            Arabic-English Conversion by system, kindly issue visa as per
            profession mentioned on visa form. Both agency and candidate are
            absolutely agreed upon that.
          </p>

          <p className="font-bold">
            : I Know and Agree All the Terms & Conditions in the Agreement.
          </p>

          {/* Table */}
          <table className="w-full text-left border border-black">
            <thead>
              <tr className="border-b border-black">
                <th className="p-2 border-r border-black">Sr No.</th>
                <th className="p-2 border-r border-black">NAME</th>
                <th className="p-2 border-r border-black">PASSPORT NUMBER</th>
                <th className="p-2">E-NUMBER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-r border-black font-bold">01</td>
                <td className="p-2 border-r border-black font-bold">
                  <input
                    type="text"
                    placeholder="WAJAHAT MALIK"
                    className="outline-none  inline-block placeholder-black font-bold text-black"
                  />
                </td>
                <td className="p-2 border-r border-black font-bold">
                  <input
                    type="text"
                    placeholder="GW0767311"
                    className="font-bold placeholder-black text-black outline-none w-[110px] inline-block"
                  />
                </td>
                <td className="p-2 font-bold">
                  <input
                    type="text"
                    placeholder="E794009519"
                    className="font-bold placeholder-black text-black outline-none w-[120px] inline-block"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <div className="flex justify-between mt-10">
            {/* Left side */}
            <div className="space-y-1">
              <p className="font-bold">TANWEER AHMED</p>
              <p className="font-bold">QURESHI BROTHERS OEP</p>
              <p className="font-bold">0696/RWP</p>
            </div>

            {/* Right side */}
            <div className="text-center">
              <input
                type="text"
                placeholder="WAJAHAT MALIK"
                className="font-bold text-black outline-none w-[135px] inline-block text-center placeholder-black"
              />
              <div className="mt-8 border-t border-black w-40 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UndertakingLetter;
