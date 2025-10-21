import React from "react";
import Sidebar from "../Sidebar/Sidebar"; // import your existing sidebar

const NBPChallan = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar with fixed 20% width */}
      <div className="w-[20%] bg-white border-r border-gray-300">
        <Sidebar />
      </div>

      {/* Main content area with fixed 80% width */}
      <div className="w-[80%] overflow-x-auto">
        <div className="font-[times] p-6 max-w-4xl mx-auto border-b border-black text-sm">
          {/* Top Header */}
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-2">
  <label className="font-bold">FORM NO.</label>
  <input
    type="text"
    placeholder="32-A"
    className="outline-none border-none placeholder-black text-black"
  />
</div>

              <p>Challan of Cash paid into:</p>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase">TREASURY/SUB-TREASURY</p>
              <p className="font-bold uppercase">NATIONAL BANK OF PAKISTAN</p>
              <p className="font-bold uppercase">STATE BANK OF PAKISTAN</p>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 border border-black">
            <div className="grid grid-cols-[25%_20%_15%_40%] divide-x divide-black">
              {/* Column 1 */}
              <div className="flex flex-col text-left border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  BY WHOM TENDER
                </div>
               <div className="flex flex-col justify-start p-1 overflow-hidden text-sm leading-tight transform -rotate-90 break-words min-h-[200px]">
  <p className="font-bold text-center">Emigrant Name:</p>
  <input
    type="text"
    placeholder="MR. IMTIAZ KHAN"
    className="border-none outline-none placeholder-black mt-2 ml-3 text-black bg-transparent font-bold"
  />
  <div className="flex items-center gap-1 mt-1 ml-3">
    <p className="font-bold">P.PNo.</p>
    <input
      type="text"
      placeholder="Error"
      className="border-none outline-none placeholder-black text-black bg-transparent"
    />
  </div>
  <p className="mt-2 font-bold ml-2 ">
    MergeField was not found in header record of data source.
  </p>
  <p className="font-semibold mt-2 ml-2 text-left">
    Mr.QURESHI BROTHERS OEP LICENCE #:
  </p>
  <input
    type="text"
    placeholder=""
    className="border-none outline-none placeholder-black text-black bg-transparent"
  />
</div>

              </div>

              {/* Column 2 */}
              <div className="flex flex-col text-start border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  TO BE FILLED BY REMITTER
                </div>
                <div className="flex flex-1 min-h-24">
                  <div className="w-[65%] flex items-center justify-center text-center border-r border-black p-1 overflow-hidden">
                    <p className="transform -rotate-90 break-words">
                      Director General, Bureau of Emigration and Overseas Employment
                    </p>
                  </div>
                  <div className="w-[35%] flex items-center justify-center text-center p-1 overflow-hidden">
                  <input
  type="text"
  placeholder="REGISTRATION FEE"
  className="font-bold text-black placeholder-black placeholder:underline transform -rotate-90 break-words border-none outline-none bg-transparent"
/>

                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col text-left justify-start border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  AMOUNT
                </div>
 <div className="flex flex-col justify-center items-center overflow-hidden leading-tight transform -rotate-90 h-full w-full">
  <input
    type="text"
    placeholder="REGISTRATION FEE"
    className="font-bold text-black placeholder-black placeholder:font-bold border-none outline-none bg-transparent text-center w-full"
  />

  <div className="flex items-center gap-2 w-full">
    <input
      type="text"
      placeholder="Rs: 500/-"
      className="text-lg font-bold text-black placeholder-black placeholder:font-bold border-none outline-none bg-transparent w-auto"
    />
    <div className="border-b border-black flex-1"></div>
  </div>
</div>


              </div>

              {/* Column 4 */}
              <div className="flex flex-col">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center px-2">
                  TO BE FILLED BY THE DEPARTMENT OFFICER OF THE TREASURY
                </div>
                <div className="grid grid-cols-[55%_45%] flex-1 min-h-[200px]">
                 <div className="flex flex-col justify-start p-1 mt-6 pl-3 transform -rotate-90 overflow-hidden text-xs leading-tight break-words">
  <p>Manpower Management</p>

  <input
    type="text"
    placeholder="Coa 0139109-029-"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <input
    type="text"
    placeholder="0000191"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <p>Registration fee</p>

  <input
    type="text"
    placeholder="Miscellaneous C02906-"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <input
    type="text"
    placeholder="code 130"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <p>Registration fee from Pakistan</p>
  <p>working abroad</p>
</div>

                  <div className="pl-2 border-l border-black flex items-start p-2 overflow-hidden text-xs">
                    <p className="break-words">
                      Date Correct Received and Grant Receipt Signature and Full Designation
                      of the Officer ordering the money to be paid in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Total Row */}
          <div className="grid grid-cols-2 text-[11px]">
            <div className="bg-white p-2 flex items-center">
              <span className="font-bold mr-2"></span>
              <div className="flex-1 h-[1.5rem] bg-white border-none"></div>
            </div>
          <div className="p-2 font-bold border-l border-t border-r border-b border-black">
  <span>
    Total Rs.&nbsp;
    <input
      type="text"
      placeholder="Rs: 500/-"
      className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold"
    />
  </span>
  <p>
    in word Rs.&nbsp;
    <input
      type="text"
      placeholder="(Five Hundred Rupees Only)"
      className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold"
    />
  </p>
</div>

          </div>

          {/* Footer */}
          <div className="mt-4 text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">Signature:</span>
                <span className="border-b border-black w-48 inline-block"></span>
              </div>
              <p className="text-right w-[320px]">
                To be used only in case of remittances to Bank through in Officer of
                Government. Treasury/Officer/Agent/Manager.
              </p>
            </div>
            <div className="flex items-center mt-2">
              <span className="mr-2">Received Payment:-</span>
              <span className="border-b border-black w-48 inline-block mr-4"></span>
              <span className="mr-2">Date:</span>
              <span className="border-b border-black w-32 inline-block"></span>
            </div>
          </div>
        </div>
               <div className="font-[times] p-6 max-w-4xl mx-auto border-b border-black text-sm">
          {/* Top Header */}
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-2">
  <label className="font-bold">FORM NO.</label>
  <input
    type="text"
    placeholder="32-A"
    className="outline-none border-none placeholder-black text-black"
  />
</div>

              <p>Challan of Cash paid into:</p>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase">TREASURY/SUB-TREASURY</p>
              <p className="font-bold uppercase">NATIONAL BANK OF PAKISTAN</p>
              <p className="font-bold uppercase">STATE BANK OF PAKISTAN</p>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 border border-black">
            <div className="grid grid-cols-[25%_20%_15%_40%] divide-x divide-black">
              {/* Column 1 */}
              <div className="flex flex-col text-left border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  BY WHOM TENDER
                </div>
                          <div className="flex flex-col justify-start p-1 overflow-hidden text-sm leading-tight transform -rotate-90 break-words min-h-[200px]">
  <p className="font-bold text-center">Emigrant Name:</p>
  <input
    type="text"
    placeholder="MR. IMTIAZ KHAN"
    className="border-none outline-none placeholder-black mt-2 ml-3 text-black bg-transparent font-bold"
  />
  <div className="flex items-center gap-1 mt-1 ml-3">
    <p className="font-bold">P.PNo.</p>
    <input
      type="text"
      placeholder="Error"
      className="border-none outline-none placeholder-black text-black bg-transparent"
    />
  </div>
  <p className="mt-2 font-bold ml-2 ">
    MergeField was not found in header record of data source.
  </p>
  <p className="font-semibold mt-2 ml-2 text-left">
    Mr.QURESHI BROTHERS OEP LICENCE #:
  </p>
  <input
    type="text"
    placeholder=""
    className="border-none outline-none placeholder-black text-black bg-transparent"
  />
</div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col text-start border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  TO BE FILLED BY REMITTER
                </div>
                <div className="flex flex-1 min-h-24">
                  <div className="w-[65%] flex items-center justify-center text-center border-r border-black p-1 overflow-hidden">
                    <p className="transform -rotate-90 break-words">
                      Director General, Bureau of Emigration and Overseas Employment
                    </p>
                  </div>
                   <div className="w-[35%] flex items-center justify-center text-center p-1 overflow-hidden">
                  <input
  type="text"
  placeholder="REGISTRATION FEE"
  className="font-bold text-black placeholder-black placeholder:underline transform -rotate-90 break-words border-none outline-none bg-transparent"
/>

                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col text-left justify-start border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  AMOUNT
                </div>
  <div className="flex flex-col justify-center items-center overflow-hidden leading-tight transform -rotate-90 h-full w-full">
  <input
    type="text"
    placeholder="REGISTRATION FEE"
    className="font-bold text-black placeholder-black placeholder:font-bold border-none outline-none bg-transparent text-center w-full"
  />

  <div className="flex items-center gap-2 w-full">
    <input
      type="text"
      placeholder="Rs: 500/-"
      className="text-lg font-bold text-black placeholder-black placeholder:font-bold border-none outline-none bg-transparent w-auto"
    />
    <div className="border-b border-black flex-1"></div>
  </div>
</div>


              </div>

              {/* Column 4 */}
              <div className="flex flex-col">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center px-2">
                  TO BE FILLED BY THE DEPARTMENT OFFICER OF THE TREASURY
                </div>
                <div className="grid grid-cols-[55%_45%] flex-1 min-h-[200px]">
                           <div className="flex flex-col justify-start p-1 mt-6 pl-3 transform -rotate-90 overflow-hidden text-xs leading-tight break-words">
  <p>Manpower Management</p>

  <input
    type="text"
    placeholder="Coa 0139109-029-"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <input
    type="text"
    placeholder="0000191"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <p>Registration fee</p>

  <input
    type="text"
    placeholder="Miscellaneous C02906-"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <input
    type="text"
    placeholder="code 130"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <p>Registration fee from Pakistan</p>
  <p>working abroad</p>
</div>
                  <div className="pl-2 border-l border-black flex items-start p-2 overflow-hidden text-xs">
                    <p className="break-words">
                      Date Correct Received and Grant Receipt Signature and Full Designation
                      of the Officer ordering the money to be paid in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Total Row */}
          <div className="grid grid-cols-2 text-[11px]">
            <div className="bg-white p-2 flex items-center">
              <span className="font-bold mr-2"></span>
              <div className="flex-1 h-[1.5rem] bg-white border-none"></div>
            </div>
                 <div className="p-2 font-bold border-l border-t border-r border-b border-black">
  <span>
    Total Rs.&nbsp;
    <input
      type="text"
      placeholder="Rs: 500/-"
      className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold"
    />
  </span>
  <p>
    in word Rs.&nbsp;
    <input
      type="text"
      placeholder="(Five Hundred Rupees Only)"
      className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold"
    />
  </p>
</div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">Signature:</span>
                <span className="border-b border-black w-48 inline-block"></span>
              </div>
              <p className="text-right w-[320px]">
                To be used only in case of remittances to Bank through in Officer of
                Government. Treasury/Officer/Agent/Manager.
              </p>
            </div>
            <div className="flex items-center mt-2">
              <span className="mr-2">Received Payment:-</span>
              <span className="border-b border-black w-48 inline-block mr-4"></span>
              <span className="mr-2">Date:</span>
              <span className="border-b border-black w-32 inline-block"></span>
            </div>
          </div>
        </div>
               <div className="font-[times] p-6 max-w-4xl mx-auto text-sm">
          {/* Top Header */}
          <div className="flex justify-between">
            <div>
           <div className="flex items-center gap-2">
  <label className="font-bold">FORM NO.</label>
  <input
    type="text"
    placeholder="32-A"
    className="outline-none border-none placeholder-black text-black"
  />
</div>

              <p>Challan of Cash paid into:</p>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase">TREASURY/SUB-TREASURY</p>
              <p className="font-bold uppercase">NATIONAL BANK OF PAKISTAN</p>
              <p className="font-bold uppercase">STATE BANK OF PAKISTAN</p>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 border border-black">
            <div className="grid grid-cols-[25%_20%_15%_40%] divide-x divide-black">
              {/* Column 1 */}
              <div className="flex flex-col text-left border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  BY WHOM TENDER
                </div>
                         <div className="flex flex-col justify-start p-1 overflow-hidden text-sm leading-tight transform -rotate-90 break-words min-h-[200px]">
  <p className="font-bold text-center">Emigrant Name:</p>
  <input
    type="text"
    placeholder="MR. IMTIAZ KHAN"
    className="border-none outline-none placeholder-black mt-2 ml-3 text-black bg-transparent font-bold"
  />
  <div className="flex items-center gap-1 mt-1 ml-3">
    <p className="font-bold">P.PNo.</p>
    <input
      type="text"
      placeholder="Error"
      className="border-none outline-none placeholder-black text-black bg-transparent"
    />
  </div>
  <p className="mt-2 font-bold ml-2 ">
    MergeField was not found in header record of data source.
  </p>
  <p className="font-semibold mt-2 ml-2 text-left">
    Mr.QURESHI BROTHERS OEP LICENCE #:
  </p>
  <input
    type="text"
    placeholder=""
    className="border-none outline-none placeholder-black text-black bg-transparent"
  />
</div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col text-start border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  TO BE FILLED BY REMITTER
                </div>
                <div className="flex flex-1 min-h-24">
                  <div className="w-[65%] flex items-center justify-center text-center border-r border-black p-1 overflow-hidden">
                    <p className="transform -rotate-90 break-words">
                      Director General, Bureau of Emigration and Overseas Employment
                    </p>
                  </div>
                 <div className="w-[35%] flex items-center justify-center text-center p-1 overflow-hidden">
                  <input
  type="text"
  placeholder="REGISTRATION FEE"
  className="font-bold text-black placeholder-black placeholder:underline transform -rotate-90 break-words border-none outline-none bg-transparent"
/>

                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col text-left justify-start border-r border-black">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
                  AMOUNT
                </div>
              <div className="flex flex-col justify-center items-center overflow-hidden leading-tight transform -rotate-90 h-full w-full">
  <input
    type="text"
    placeholder="REGISTRATION FEE"
    className="font-bold text-black placeholder-black placeholder:font-bold border-none outline-none bg-transparent text-center w-full"
  />

  <div className="flex items-center gap-2 w-full">
    <input
      type="text"
      placeholder="Rs: 500/-"
      className="text-lg font-bold text-black placeholder-black placeholder:font-bold border-none outline-none bg-transparent w-auto"
    />
    <div className="border-b border-black flex-1"></div>
  </div>
</div>

              </div>

              {/* Column 4 */}
              <div className="flex flex-col">
                <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center px-2">
                  TO BE FILLED BY THE DEPARTMENT OFFICER OF THE TREASURY
                </div>
                <div className="grid grid-cols-[55%_45%] flex-1 min-h-[200px]">
                            <div className="flex flex-col justify-start p-1 mt-6 pl-3 transform -rotate-90 overflow-hidden text-xs leading-tight break-words">
  <p>Manpower Management</p>

  <input
    type="text"
    placeholder="Coa 0139109-029-"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <input
    type="text"
    placeholder="0000191"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <p>Registration fee</p>

  <input
    type="text"
    placeholder="Miscellaneous C02906-"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <input
    type="text"
    placeholder="code 130"
    className="border-none outline-none bg-transparent text-black placeholder-black"
  />

  <p>Registration fee from Pakistan</p>
  <p>working abroad</p>
</div>
                  <div className="pl-2 border-l border-black flex items-start p-2 overflow-hidden text-xs">
                    <p className="break-words">
                      Date Correct Received and Grant Receipt Signature and Full Designation
                      of the Officer ordering the money to be paid in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Total Row */}
          <div className="grid grid-cols-2 text-[11px]">
            <div className="bg-white p-2 flex items-center">
              <span className="font-bold mr-2"></span>
              <div className="flex-1 h-[1.5rem] bg-white border-none"></div>
            </div>
                 <div className="p-2 font-bold border-l border-t border-r border-b border-black">
  <span>
    Total Rs.&nbsp;
    <input
      type="text"
      placeholder="Rs: 500/-"
      className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold"
    />
  </span>
  <p>
    in word Rs.&nbsp;
    <input
      type="text"
      placeholder="(Five Hundred Rupees Only)"
      className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold"
    />
  </p>
</div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">Signature:</span>
                <span className="border-b border-black w-48 inline-block"></span>
              </div>
              <p className="text-right w-[320px]">
                To be used only in case of remittances to Bank through in Officer of
                Government. Treasury/Officer/Agent/Manager.
              </p>
            </div>
            <div className="flex items-center mt-2">
              <span className="mr-2">Received Payment:-</span>
              <span className="border-b border-black w-48 inline-block mr-4"></span>
              <span className="mr-2">Date:</span>
              <span className="border-b border-black w-32 inline-block"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NBPChallan;