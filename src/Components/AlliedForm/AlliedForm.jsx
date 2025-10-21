import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import logo from "./Images/banklogo.png";

const AlliedForm = () => {
  return (
    <div>
  
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-[20%] border-r border-gray-300">
          <Sidebar />
        </div>

        {/* Main Form Content */}
        <div className="w-[80%] p-8 m-2 text-sm border border-black">
          {/* Header */}
          <div className="flex justify-between items-center border-black pb-4 mb-6">
            <img src={logo} alt="logo" className="w-24 h-20 object-contain" />
            <div className="text-center flex-1 -ml-24">
              <h2 className="text-lg font-bold uppercase">
                Request for Issuance of Form-7
              </h2>
              <p className="text-xs">(Under Emigration Rules-1979)</p>
            </div>
            <div className="text-right">
              <p>
                Date:{" "}
                <input
                  type="text"
                  className="border-b border-black px-4 bg-transparent outline-none w-28"
                  placeholder="1-1-2025"
                />
              </p>
            </div>
          </div>

          <p className="mb-6 ml-16 font-[times]">
            I/We request for issuance of form-7 (under Emigration Rules 1979) as
            per appended details:
          </p>

          {/* Section A: Depositor Details */}
          <div className="mb-6 font-[times]">
            <div className="px-3 py-1 font-bold">A. Depositor Details</div>

            <div className="grid grid-cols-2 gap-0 border border-black">
              {/* Row 1 */}
              <div className="grid grid-cols-2 border-b border-r border-black">
                <p className="border-r border-black text-center px-2 py-1">
                  Name
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-center px-2 py-1"
                />
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black text-center px-2 py-1">
                  S/O
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-center px-2 py-1"
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 border-r border-black">
                <p className="border-r border-black text-center px-2 py-1">
                  Contact Number
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-center px-2 py-1"
                />
              </div>
              <div className="grid grid-cols-2">
                <p className="border-r border-black text-center px-2 py-1">
                  ID Number*
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-center px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Section B: Intending Emigrant Details */}
          <div className="px-3 py-1 font-normal font-[times]">
            B. Intending Emigrant(s) Details (List attached for more than one
            Intending Emigrant)
          </div>
          <div className="grid grid-cols-4 border border-black mb-6 font-[times]">
            {/* Row 1 */}
            <p className="border-r border-b border-black flex items-center justify-center px-2 py-1">
              Name
            </p>
            <input
              type="text"
              className="border-r border-b border-black bg-transparent outline-none px-2 py-1"
            />
            <p className="border-r border-b border-black flex items-center justify-center px-2 py-1">
              S/O
            </p>
            <input
              type="text"
              className="border-b border-black bg-transparent outline-none px-2 py-1"
            />

            {/* Row 2 */}
            <p className="border-r border-b border-black flex items-center justify-center px-2 py-1">
              Contact Number
            </p>
            <input
              type="text"
              className="border-r border-b border-black bg-transparent outline-none px-2 py-1"
            />
            <p className="border-r border-b border-black flex items-center justify-center px-2 py-1">
              ID Number*
            </p>
            <input
              type="text"
              className="border-b border-black bg-transparent outline-none px-2 py-1"
            />
<p className="border-r border-black flex items-center justify-center px-2 py-1">
 
</p>
<input
  type="text"
  className="col-span-3 bg-transparent outline-none px-2 py-1 w-full"
  style={{ borderBottom: '1px solid black' }} // Optional if you want bottom border
/>

            {/* Row 3 & 4 combined: Address spans two rows (cols 1 and 2), Passport Number on right */}
            <p className="border-r border-black flex items-center justify-center px-2 py-1 row-span-2">
              Address
            </p>
            <input
              type="text"
              className="border-r border-black bg-transparent outline-none px-2 py-1 row-span-2"
            />
            <p className="border-r border-black flex items-center justify-center px-2 py-1">
              Passport Number
            </p>
            <input
              type="text"
              className="bg-transparent outline-none px-2 py-1"
            />
          </div>

        {/* Section C: Overseas Employment Promoter */}
<div className="mb-6 grid-row-3 font-[times]">
  <div className="px-3 grid grid-cols-2 py-1 font-semibold">
    B. Overseas Employment Promoter (O.E.P) Details
  </div>

<div className="font-[times] p-1">
  <div className="grid border border-black">
    {/* Row 1 - Name */}
    <div className="grid grid-cols-2">
      <p className="border-r border-black text-left px-2 font-normal flex items-center h-[28px] leading-none">
        Name
      </p>
      <input
        type="text"
        className="w-full bg-transparent outline-none text-center px-2 h-[28px] leading-none"
      />
    </div>

    {/* Row 2 & 3 - Address & O.E.P License Number */}
    <div className="grid grid-cols-4 border-t border-black">
      {/* Empty row above Address */}
      <p className="border-r border-black flex items-center justify-center px-2 py-1"></p>
      <input
        type="text"
        className="col-span-3 bg-transparent outline-none px-2 w-full border-b border-black flex items-center py-1"
      />

      {/* Address row */}
      <p className="border-r border-black flex items-center justify-center px-2 py-1 row-span-2">
        Address
      </p>
      <input
        type="text"
        className="border-r border-black bg-transparent outline-none px-2 row-span-2 flex items-center py-1"
      />

      {/* O.E.P License Number */}
      <p className="border-r border-black flex items-center justify-center px-2 py-1">
        O.E.P License Number
      </p>
      <input
        type="text"
        className="bg-transparent outline-none px-2 flex items-center py-1"
      />
    </div>
  </div>
</div>

</div>


          {/* Section D: Deposit Details */}
          <div className="mb-6 font-[times]">
            <div className=" px-3 py-1 font-semibold ">D. Deposit Details</div>
            <div className="p-3 px-10 space-y-4 font-[times]">
              {/* Line 1 */}
              <div className="flex items-center gap-2">
                {/* Empty box */}
                <div className="w-8 h-8 border border-black"></div>

                {/* Account # Label */}
                <span className="w-20 font-bold">Account #</span>

                {/* 16 boxes with dash boxes every 4 */}
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <input
                      key={`acc-${i}`}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center outline-none"
                    />
                  ))}
                  <div className="w-3 h-6 flex items-center justify-center">
                    -
                  </div>

                  {[...Array(4)].map((_, i) => (
                    <input
                      key={`acc-${i + 4}`}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center outline-none"
                    />
                  ))}
                  <div className="w-3 h-6 flex items-center justify-center">
                    -
                  </div>

                  {[...Array(4)].map((_, i) => (
                    <input
                      key={`acc-${i + 8}`}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center outline-none"
                    />
                  ))}
                  <div className="w-3 h-6 flex items-center justify-center">
                    -
                  </div>

                  {[...Array(4)].map((_, i) => (
                    <input
                      key={`acc-${i + 12}`}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center outline-none"
                    />
                  ))}
                </div>

                {/* Cheque # Label */}
                <span className="w-20 ml-8 font-bold">Cheque #</span>

                {/* 8 boxes with dash after 5th */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <input
                      key={`cheque-${i}`}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center outline-none"
                    />
                  ))}
                  <div className="w-3 h-6 flex items-center justify-center">
                    -
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <input
                      key={`cheque-${i + 5}`}
                      type="text"
                      maxLength={1}
                      className="w-6 h-6 border border-black text-center outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Line 2 */}
              <div className="flex items-center gap-2">
                {/* Empty box */}
                <div className="w-8 h-8 border border-black"></div>

                <label className="select-none font-bold">Cash</label>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <p className="font-bold font-sans">Amount in Figures</p>
                <p className="text-base font-sans">6000/-</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold font-sans">Amount in Words</p>
                <p className="text-base font-sans">SIX THOUSAND ONLY</p>
              </div>
            </div>
            <div>
              {/* New lines added below */}
              <p className="text-sm font-sans mt-4">
                I/We Understand that this deposit is governed by Emigration
                Rules-1979 and refund against form-7 shall only be made to the
                depositor.
              </p>
              <p className="text-sm font-sans mt-4">
                All Claims against any Form-7 will only be processed after
                endorsement by the concerned Protector of Emigrants, Bureau of
                Emigration & Overseas Employment. (BE&OE), Ministry of Overseas
                Pakistanis & Human Resource Development, Government of Pakistan.
              </p>
            </div>
            {/* Signature and Bank Use Section */}
            <div className="mt-12 font-sans">
              {/* Signature of Depositors */}
              {/* CNIC Note */}
              <div className="text-sm mb-8 px-20">
                <p className="border-t border-black w-48 text-center">
                  (Signature of the Depositors)
                </p>
                <p>* Cop(ies) of CNIC/SNIC/NICOP is mandatory</p>
              </div>

              {/* Bank Use Only Section */}
              <div className=" pt-2">
                <p className="font-bold text-center border p-1 border-black">
                  FOR BANK USE ONLY
                </p>

                <div className="grid grid-cols-1 mt-6 font-sans">
                  <div className="px-20">
                    <p>
                      Form-7 Issued from Serial No. _________________________ to
                      serial No. _________________________
                    </p>
                    <p className="mt-3">
                      Total Form Issued _________________________
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Authorized Signatures at the end */}
          <div className="flex justify-center space-x-60 pr-8 mt-6 font-sans">
            <div className="text-center">
              <p className=" font-bold w-40">Authorized Signatures</p>
            </div>
            <div className="text-center">
              <p className="font-bold w-40">Authorized Signatures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlliedForm;