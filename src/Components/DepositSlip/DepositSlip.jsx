import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import NBPLogo from "../DepositSlip/images/NBP logo.png"; // Make sure this logo file exists

const DepositSlip = () => {
  return (
    <div>
    
    
      <div className="flex min-h-screen">
      
        <div className="w-[20%] bg-white border-r border-gray-200">
          <Sidebar />
        </div>

        
        <div className="flex-1 p-4 bg-white text-xs font-sans">
          <div className="max-w-5xl mx-auto  border-black">
         
            <div className="flex justify-between items-start p-2">
              <div>
                <img src={NBPLogo} alt="NBP Logo" className="w-24" />
              </div>
              <div className="text-center flex-1 -ml-20">
                <h1 className="text-base font-bold">
                  SPECIALIZED DEPOSIT SLIP
                </h1>
                <p className="text-[10px]">
                  On behalf of Bureau of Emigration & Overseas Employment
                </p>
                <p className="text-[11px] font-bold mt-1">
                  EMIGRANT THROUGH OVERSEAS EMPLOYMENT PROMOTER
                </p>
                <p className="text-[11px] font-bold">
                  FOR SHORT TERM EMPLOYEMENT / INSURANCE EXEMPT
                </p>
              </div>
              <div className="text-center text-[10px] space-y-1">
                <p className="font-semibold">Bank copy</p>
                <div className="border-b border-black inline-block w-24"></div>
                <p>Deposit slip no.</p>
                <input
                  type="text"
                  className="ml-3 text-center placeholder-black border-b border-black inline-block w-28 bg-transparent focus:outline-none"
                  placeholder="12345"
                />
              </div>
            </div>

            {/* Branch Info */}
            <div className="mt-4 border border-black divide-x divide-black text-[11px] bg-gray-300">
              <div className="grid grid-cols-4">
                <input
                  type="text"
                  className="p-1 bg-gray-300 font-bold text-black"
                  placeholder="Collecting Branch Name"
                />
                <input
                  type="text"
                  className="p-1 bg-gray-300 font-bold text-black"
                  placeholder="Branch Code"
                />
                <div className="p-1 col-span-2 bg-gray-300 flex items-center">
                  <span className="font-bold text-black mr-2">Date:</span>
                  <div className="flex">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <input
                        key={i}
                        maxLength={1}
                        className="border border-black w-6 h-6 text-center bg-white -ml-[1px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emigrant Info */}
            <div className=" border-black border-t-0 bg-gray-300">
              <div className="grid grid-cols-2  border-black">
                <div className="bg-white p-1 font-semibold text-[11px]">
                  Emigrant Information
                </div>
                <div className="bg-white p-1"></div>
              </div>
              <div className="grid grid-cols-2 border-l border-t border-black">
                <div className="grid grid-cols-6">
                  <label className="col-span-2 p-1 text-[11px] font-semibold">
                    Emigrant Name:
                  </label>
                  <input
                    type="text"
                    value="MUHAMMAD FAROOQ"
                    className="col-span-4 p-1 font-bold text-[11px] border-black bg-gray-300 border-r"
                  />
                </div>
                <div className="grid grid-cols-6">
                  <label className="col-span-1 p-1 text-[11px]">CNIC</label>
                  <input
                    type="text"
                    className="col-span-5 p-1  border-l border-r border-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 text-[11px] gap-2 border border-black">
                <div className="bg-gray-300 p-1 flex items-center border-r border-black">
                  <label className="font-bold text-black mr-2 whitespace-nowrap">
                    Telephone (Mobile):
                  </label>
                  <input
                    type="text"
                    placeholder="0301-1234567"
                    className="p-1 font-bold text-black bg-gray-300 w-full "
                  />
                </div>
                <div className="bg-gray-300 p-1 flex items-center">
                  <label className="font-bold text-black mr-2 whitespace-nowrap">
                    Telephone (Residence):
                  </label>
                  <input
                    type="text"
                    placeholder="051-1234567"
                    className="p-1 text-black font-bold bg-gray-300 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Particular of Payments */}
            <div className="text-[11px] ">
              <div className="bg-white p-1  border-black">
                Particular of Payments _{" "}
                <span className="font-semibold">
                  CREDIT TO BE MADE THROUGH TRANSACTION CODE “ZBOEOP”
                </span>
              </div>
              <div className="grid grid-cols-2 bg-gray-300">
                <div className="flex items-center justify-center text-center border border-black">
                  <div>
                    <p>Payments made on behalf of</p>
                    <p className="font-bold text-[12px] leading-snug">
                      Director General <br /> Bureau of Emigration & Overseas
                      Employment
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2  border=l">
                  <div className="border-b border-r border-t border-black p-1">
                    OPF Welfare Fund
                  </div>
                  <div className="border-b border-black border-r border-t p-1 text-right font-bold">
                    2000
                  </div>
                  <div className="border-b border-r border-black p-1">
                    State Life Insurance Premium
                  </div>
                  <div className="border-b border-black border-r p-1 text-right font-bold">
                    2500
                  </div>
                  <div className="border-r border-black p-1">
                    OEC Emigration Promotion FEE
                  </div>
                  <div className="p-1 text-right font-bold border-r border-black">
                    200
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 text-[11px] border-black border-t-0">
                <div className="bg-white p-2 flex items-center">
                  <span className="font-bold mr-2 border-r">
                    Amount in Words:
                  </span>
                  <div className="flex-1 h-[1.5rem] bg-white border-none"></div>
                </div>
                <div className="bg-gray-300 p-2 flex justify-between items-center font-bold border-l border-t border-r border-black">
                  <span>Total:</span>
                  <span>4700</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="text-[11px] border-black border-t-0 bg-gray-300">
              {/* Header Row */}
              <div className="grid grid-cols-3 text-center font-bold border-b border-black">
                <div className="p-1 border-r border-black border-l border-t">
                  Received By
                </div>
                <div className="p-1 border-r border-black border-t">
                  Authorized By
                </div>
                <div className="p-1 border-r border-black border-t">
                  Depositor’s Signature
                </div>
              </div>

              {/* Signature Rows */}
              <div className="grid grid-cols-3 text-left border-b border-black">
                {/* Column 1 */}
                <div className="p-2 border-r border-black border-l">
                  <p className="mt-16 text-center">
                    Cashier’s Stamp & Signature
                  </p>
                </div>

                {/* Column 2 */}
                <div className="p-2 border-r border-black">
                  <p className="mt-16 text-center">
                    Authorized Officer’s Signature
                  </p>
                </div>

                {/* Column 3 */}
               <div className="p-2 border-black border-r">
  <p className="mb-2">
    Name:
    <input
      type="text"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>

  <p className="mb-2">
    Contact Number:
    <input
      type="tel"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>

  <p>
    Signature:
    <input
      type="text"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>
</div>

              </div>
            </div>

            {/* Notes */}
            <div className="flex justify-between text-[10px] border-b border-black px-8 pb-2 mt-1 font-semibold">
              <p>Note: for branch use only</p>
              <p>- Only cash is acceptable</p>
              <p>- Separate slip for every individual</p>
            </div>
          </div>
          <div>
            <div className="flex-1 p-4 bg-white text-xs font-sans">
              <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-start p-2">
                  <div>
                    <img src={NBPLogo} alt="NBP Logo" className="w-24" />
                  </div>
                  <div className="text-center flex-1 -ml-20">
                    <h1 className="text-base font-bold">
                      SPECIALIZED DEPOSIT SLIP
                    </h1>
                    <p className="text-[10px]">
                      On behalf of Bureau of Emigration & Overseas Employment
                    </p>
                    <p className="text-[11px] font-bold mt-1">
                      EMIGRANT THROUGH OVERSEAS EMPLOYMENT PROMOTER
                    </p>
                    <p className="text-[11px] font-bold">
                      FOR SHORT TERM EMPLOYEMENT / INSURANCE EXEMPT
                    </p>
                  </div>
                  <div className="text-center  text-[10px] space-y-1">
                    <p className="font-semibold">Deposite copy</p>
                    <div className="border-b border-black inline-block w-24"></div>

                    <p className="font-semibold">Deposit slip no.</p>
                    <input
                      type="text"
                      className="ml-3 text-center font-semibold placeholder-gray-800 border-b border-black inline-block w-24 bg-transparent focus:outline-none"
                      placeholder="12345"
                    />
                  </div>
                </div>

                {/* Branch Info */}
                <div className="mt-4 border border-black divide-x divide-black text-[11px] bg-gray-300">
                  <div className="grid grid-cols-4">
                    <input
                      type="text"
                      className="p-1 bg-gray-300 font-bold text-black"
                      placeholder="Collecting Branch Name"
                    />
                    <input
                      type="text"
                      className="p-1 bg-gray-300 font-bold text-black"
                      placeholder="Branch Code"
                    />
                    <div className="p-1 col-span-2 bg-gray-300 flex items-center">
                      <span className="font-bold text-black mr-2">Date:</span>
                      <div className="flex">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <input
                            key={i}
                            maxLength={1}
                            className="border border-black w-6 h-6 text-center bg-white -ml-[1px]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emigrant Info */}
                <div className=" bg-gray-300">
                  <div className="grid grid-cols-2  border-black">
                    <div className="bg-white p-1 font-semibold text-[11px]">
                      Emigrant Information
                    </div>
                    <div className="bg-white p-1"></div>
                  </div>
                  <div className="grid grid-cols-2 border border-black">
                    <div className="grid grid-cols-6">
                      <label className="col-span-2 p-1 text-[11px] font-semibold">
                        Emigrant Name:
                      </label>
                      <input
                        type="text"
                        value="MUHAMMAD FAROOQ"
                        className="col-span-4 p-1 font-bold text-[11px] bg-gray-300 border-black"
                      />
                    </div>
                    <div className="grid grid-cols-6">
                      <label className="col-span-1 p-1 text-[11px]">CNIC</label>
                      <input
                        type="text"
                        className="col-span-5 p-1 border-l border-black"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-[11px] gap-2 border-b border-black border-l border-r">
                    <div className="bg-gray-300 p-1 flex items-center">
                      <label className="font-bold text-black mr-2 whitespace-nowrap">
                        Telephone (Mobile):
                      </label>
                      <input
                        type="text"
                        placeholder="0301-1234567"
                        className="p-1 font-bold text-black bg-gray-300 w-full"
                      />
                    </div>
                    <div className="bg-gray-300 p-1 flex items-center">
                      <label className="font-bold text-black mr-2 whitespace-nowrap">
                        Telephone (Residence):
                      </label>
                      <input
                        type="text"
                        placeholder="051-1234567"
                        className="p-1 text-black font-bold bg-gray-300 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Particular of Payments */}
                <div className=" mt-4 text-[11px]">
                  <div className="bg-white p-1 border-b border-black">
                    Particular of Payments _{" "}
                    <span className="font-semibold">
                      CREDIT TO BE MADE THROUGH TRANSACTION CODE “ZBOEOP”
                    </span>
                  </div>
                  <div className="grid grid-cols-2 bg-gray-300">
                    <div className="flex items-center justify-center text-center p-2 border-r border-black">
                      <div>
                        <p>Payments made on behalf of</p>
                        <p className="font-bold text-[12px] leading-snug">
                          Director General <br /> Bureau of Emigration &
                          Overseas Employment
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-r border-black">
                      <div className="border-b border-r border-black p-1">
                        OPF Welfare Fund
                      </div>
                      <div className="border-b border-black p-1 text-right font-bold">
                        2000
                      </div>
                      <div className="border-b border-r border-black p-1">
                        State Life Insurance Premium
                      </div>
                      <div className="border-b border-black p-1 text-right font-bold">
                        2500
                      </div>
                      <div className="border-r border-black p-1">
                        OEC Emigration Promotion FEE
                      </div>
                      <div className="p-1 text-right font-bold">200</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-[11px]  border-t-0">
                    <div className="bg-white p-2 flex items-center">
                      <span className="font-bold mr-2">Amount in Words:</span>
                      <div className="flex-1 h-[1.5rem] bg-white border-none"></div>
                    </div>
                    <div className="bg-gray-300 p-2 flex justify-between items-center font-bold border-l border-t border-r border-black">
                      <span>Total:</span>
                      <span>4700</span>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="text-[11px] border-black border-t-0 bg-gray-300">
                  {/* Header Row */}
                  <div className="grid grid-cols-3 text-center font-bold border-b border-black">
                    <div className="p-1 border-r border-t border-black border-l">
                      Received By
                    </div>
                    <div className="p-1 border-r border-t border-black">
                      Authorized By
                    </div>
                    <div className="p-1 border-r border-t border-black">
                      Depositor’s Signature
                    </div>
                  </div>

                  {/* Signature Rows */}
                  <div className="grid grid-cols-3 text-left border-b border-black">
                    {/* Column 1 */}
                    <div className="p-2 border-r border-black border-l">
                      <p className="mt-16 text-center">
                        Cashier’s Stamp & Signature
                      </p>
                    </div>

                    {/* Column 2 */}
                    <div className="p-2 border-r border-black">
                      <p className="mt-16 text-center">
                        Authorized Officer’s Signature
                      </p>
                    </div>

                    {/* Column 3 */}
                    <div className="p-2 border-black border-r">
  <p className="mb-2">
    Name:
    <input
      type="text"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>

  <p className="mb-2">
    Contact Number:
    <input
      type="tel"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>

  <p>
    Signature:
    <input
      type="text"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>
</div>

                  </div>
                </div>

                {/* Notes */}
                <div className="flex justify-between text-[10px] mt-1 font-semibold">
                  <p>Note: for branch use only</p>
                  <p>- Only cash is acceptable</p>
                  <p>- Separate slip for every individual</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex-1 p-4 bg-white text-xs font-sans">
              <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-start p-2">
                  <div>
                    <img src={NBPLogo} alt="NBP Logo" className="w-24" />
                  </div>
                  <div className="text-center flex-1 -ml-20">
                    <h1 className="text-base font-bold">
                      SPECIALIZED DEPOSIT SLIP
                    </h1>
                    <p className="text-[10px]">
                      On behalf of Bureau of Emigration & Overseas Employment
                    </p>
                    <p className="text-[11px] font-bold mt-1">
                      EMIGRANT THROUGH OVERSEAS EMPLOYMENT PROMOTER
                    </p>
                    <p className="text-[11px] font-bold">
                      FOR SHORT TERM EMPLOYEMENT / INSURANCE EXEMPT
                    </p>
                  </div>
                  <div className="text-center  text-[10px] space-y-1">
                    <p className="font-semibold">Deposite copy</p>
                    <div className="border-b border-black inline-block w-24"></div>

                    <p className="font-semibold">Deposit slip no.</p>
                    <input
                      type="text"
                      className="ml-3 text-center font-semibold placeholder-gray-800 border-b border-black inline-block w-24 bg-transparent focus:outline-none"
                      placeholder="12345"
                    />
                  </div>
                </div>

                {/* Branch Info */}
                <div className="mt-4 border border-black divide-x divide-black text-[11px] bg-gray-300">
                  <div className="grid grid-cols-4">
                    <input
                      type="text"
                      className="p-1 bg-gray-300 font-bold text-black"
                      placeholder="Collecting Branch Name"
                    />
                    <input
                      type="text"
                      className="p-1 bg-gray-300 font-bold text-black"
                      placeholder="Branch Code"
                    />
                    <div className="p-1 col-span-2 bg-gray-300 flex items-center">
                      <span className="font-bold text-black mr-2">Date:</span>
                      <div className="flex">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <input
                            key={i}
                            maxLength={1}
                            className="border border-black w-6 h-6 text-center bg-white -ml-[1px]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emigrant Info */}
                <div className=" bg-gray-300">
                  <div className="grid grid-cols-2  border-black">
                    <div className="bg-white p-1 font-semibold text-[11px]">
                      Emigrant Information
                    </div>
                    <div className="bg-white p-1"></div>
                  </div>
                  <div className="grid grid-cols-2 border border-black">
                    <div className="grid grid-cols-6">
                      <label className="col-span-2 p-1 text-[11px] font-semibold">
                        Emigrant Name:
                      </label>
                      <input
                        type="text"
                        value="MUHAMMAD FAROOQ"
                        className="col-span-4 p-1 font-bold text-[11px] bg-gray-300 border-black"
                      />
                    </div>
                    <div className="grid grid-cols-6">
                      <label className="col-span-1 p-1 text-[11px]">CNIC</label>
                      <input
                        type="text"
                        className="col-span-5 p-1 border-l border-black"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-[11px] gap-2 border-b border-black border-l border-r">
                    <div className="bg-gray-300 p-1 flex items-center">
                      <label className="font-bold text-black mr-2 whitespace-nowrap">
                        Telephone (Mobile):
                      </label>
                      <input
                        type="text"
                        placeholder="0301-1234567"
                        className="p-1 font-bold text-black bg-gray-300 w-full"
                      />
                    </div>
                    <div className="bg-gray-300 p-1 flex items-center">
                      <label className="font-bold text-black mr-2 whitespace-nowrap">
                        Telephone (Residence):
                      </label>
                      <input
                        type="text"
                        placeholder="051-1234567"
                        className="p-1 text-black font-bold bg-gray-300 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Particular of Payments */}
                <div className=" mt-4 text-[11px]">
                  <div className="bg-white p-1 border-b border-black">
                    Particular of Payments _{" "}
                    <span className="font-semibold">
                      CREDIT TO BE MADE THROUGH TRANSACTION CODE “ZBOEOP”
                    </span>
                  </div>
                  <div className="grid grid-cols-2 bg-gray-300">
                    <div className="flex items-center justify-center text-center p-2 border-r border-black">
                      <div>
                        <p>Payments made on behalf of</p>
                        <p className="font-bold text-[12px] leading-snug">
                          Director General <br /> Bureau of Emigration &
                          Overseas Employment
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-r border-black">
                      <div className="border-b border-r border-black p-1">
                        OPF Welfare Fund
                      </div>
                      <div className="border-b border-black p-1 text-right font-bold">
                        2000
                      </div>
                      <div className="border-b border-r border-black p-1">
                        State Life Insurance Premium
                      </div>
                      <div className="border-b border-black p-1 text-right font-bold">
                        2500
                      </div>
                      <div className="border-r border-black p-1">
                        OEC Emigration Promotion FEE
                      </div>
                      <div className="p-1 text-right font-bold">200</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-[11px]  border-t-0">
                    <div className="bg-white p-2 flex items-center">
                      <span className="font-bold mr-2">Amount in Words:</span>
                      <div className="flex-1 h-[1.5rem] bg-white border-none"></div>
                    </div>
                    <div className="bg-gray-300 p-2 flex justify-between items-center font-bold border-l border-t border-r border-black">
                      <span>Total:</span>
                      <span>4700</span>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="text-[11px] border-black border-t-0 bg-gray-300">
                  {/* Header Row */}
                  <div className="grid grid-cols-3 text-center font-bold border-b border-black">
                    <div className="p-1 border-r border-t border-black border-l">
                      Received By
                    </div>
                    <div className="p-1 border-r border-t border-black">
                      Authorized By
                    </div>
                    <div className="p-1 border-r border-t border-black">
                      Depositor’s Signature
                    </div>
                  </div>

                  {/* Signature Rows */}
                  <div className="grid grid-cols-3 text-left border-b border-black">
                    {/* Column 1 */}
                    <div className="p-2 border-r border-black border-l">
                      <p className="mt-16 text-center">
                        Cashier’s Stamp & Signature
                      </p>
                    </div>

                    {/* Column 2 */}
                    <div className="p-2 border-r border-black">
                      <p className="mt-16 text-center">
                        Authorized Officer’s Signature
                      </p>
                    </div>

                    {/* Column 3 */}
                 <div className="p-2 border-black border-r">
  <p className="mb-2">
    Name:
    <input
      type="text"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>

  <p className="mb-2">
    Contact Number:
    <input
      type="tel"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>

  <p>
    Signature:
    <input
      type="text"
      className="ml-2 w-40 border-b border-black outline-none bg-transparent"
    />
  </p>
</div>

                  </div>
                </div>

                {/* Notes */}
                <div className="flex justify-between text-[10px] mt-1 font-semibold">
                  <p>Note: for branch use only</p>
                  <p>- Only cash is acceptable</p>
                  <p>- Separate slip for every individual</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositSlip;