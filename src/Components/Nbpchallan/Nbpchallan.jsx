import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../Sidebar/Sidebar";
import {} from "../../utils/barcodeGenerator";

const NBPChallan = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // show candidate visaId and eNo instead of generated barcodes
  const [challanData, setChallanData] = useState({
    amount: "500",
    amountWords: "Five Hundred Rupees Only",
  });

  // barcodes removed — show candidate fields instead

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem("depositCandidates");
        const storedIdx = parseInt(
          localStorage.getItem("depositCandidateIndex") || "0",
          10
        );

        if (raw) {
          const list = JSON.parse(raw) || [];
          setCandidates(list);
          if (!isNaN(storedIdx) && storedIdx >= 0 && storedIdx < list.length) {
            setCurrentIndex(storedIdx);
            setCandidate(list[storedIdx]);
          } else if (list.length > 0) {
            setCurrentIndex(0);
            setCandidate(list[0]);
          }
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        try {
          const { data: list } = await axios.get(`/api/candidates`);
          if (Array.isArray(list) && list.length > 0) {
            setCandidates(list);
            let indexToUse = 0;
            if (id) {
              const found = list.findIndex((c) => String(c._id) === String(id));
              if (found !== -1) indexToUse = found;
            }
            setCurrentIndex(indexToUse);
            setCandidate(list[indexToUse]);
            return;
          }
        } catch (e) {}

        if (id) {
          try {
            const { data } = await axios.get(`/api/candidates/${id}`);
            setCandidates([data]);
            setCandidate(data);
            setCurrentIndex(0);
          } catch (err) {
            console.error("Could not load candidate by id", err);
          }
        }
      } catch (e) {
        console.error("Failed to load candidates", e);
      }
    };

    load();
  }, []);

  useEffect(() => {
        if (Array.isArray(candidates) && candidates.length > 0) {
      if (currentIndex >= 0 && currentIndex < candidates.length) {
        setCandidate(candidates[currentIndex]);
      }
    }
  }, [currentIndex, candidates]);

  const clearSearch = () => {
    setSearchTerm("");
    const raw = localStorage.getItem("depositCandidates");
    if (raw) {
      try {
        const s = JSON.parse(raw) || [];
        setCandidates(s);
        setCurrentIndex(0);
        setCandidate(s[0] || null);
        return;
      } catch (e) {}
    }

    (async () => {
      try {
        const { data } = await axios.get("/api/candidates");
        setCandidates(data || []);
        setCurrentIndex(0);
        setCandidate((data && data[0]) || null);
      } catch (e) {
        console.error("Clear search failed", e);
      }
    })();
  };

  const handleSearch = async () => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return clearSearch();
    setIsFetching(true);
    try {
      const { data: list } = await axios.get("/api/candidates");
      const results = (list || []).filter((c) => {
        const check = (v) => (v || "").toString().toLowerCase();
        return (
          check(c.name).includes(q) ||
          check(c.passport).includes(q) ||
          check(c.eNo).includes(q) ||
          check(c.visaNo).includes(q) ||
          check(c.profession).includes(q)
        );
      });
      if (results.length === 0) return toast("No matches");
      setCandidates(results);
      setCurrentIndex(0);
      setCandidate(results[0]);
      localStorage.setItem("depositCandidates", JSON.stringify(results));
      localStorage.setItem("depositCandidateIndex", "0");
    } catch (e) {
      console.error("Search failed", e);
      toast("Search failed");
    } finally {
      setIsFetching(false);
    }
  };

  const goNext = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const { data: list } = await axios.get(`/api/candidates`);
      if (!Array.isArray(list) || list.length === 0) {
        toast("No more candidates");
        return;
      }

      const curId = candidate?._id;
      let idx = list.findIndex((c) => String(c._id) === String(curId));

      if (idx === -1 && Array.isArray(candidates) && candidates.length > 0) {
        idx = list.findIndex((c) =>
          candidates.some((cc) => String(cc._id) === String(c._id))
        );
      }

      let nextIndex;
      if (idx === -1) {
        const firstNew = list.findIndex(
          (c) => !candidates.some((cc) => String(cc._id) === String(c._id))
        );
        nextIndex =
          firstNew !== -1
            ? firstNew
            : Math.min(currentIndex + 1, list.length - 1);
      } else {
        nextIndex = idx + 1;
      }

      if (nextIndex >= list.length) {
        toast("No more candidates");
        return;
      }

      setCandidates(list);
      setCurrentIndex(nextIndex);
      setCandidate(list[nextIndex]);
      localStorage.setItem("depositCandidates", JSON.stringify(list));
      localStorage.setItem("depositCandidateIndex", String(nextIndex));
    } catch (e) {
      console.error("Failed to fetch next candidate", e);
      toast("Could not load next candidate");
    } finally {
      setIsFetching(false);
    }
  };

  const goPrevious = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const { data: list } = await axios.get(`/api/candidates`);
      if (!Array.isArray(list) || list.length === 0) {
        toast("Already at first candidate");
        return;
      }

      const curId = candidate?._id;
      let idx = list.findIndex((c) => String(c._id) === String(curId));

      if (idx === -1 && Array.isArray(candidates) && candidates.length > 0) {
        idx = list.findIndex((c) =>
          candidates.some((cc) => String(cc._id) === String(c._id))
        );
      }

      let prevIndex;
      if (idx === -1) {
        prevIndex = Math.max(0, currentIndex - 1);
      } else {
        prevIndex = idx - 1;
      }

      if (prevIndex < 0) {
        toast("Already at first candidate");
        return;
      }

      setCandidates(list);
      setCurrentIndex(prevIndex);
      setCandidate(list[prevIndex]);
      localStorage.setItem("depositCandidates", JSON.stringify(list));
      localStorage.setItem("depositCandidateIndex", String(prevIndex));
    } catch (e) {
      console.error("Failed to fetch previous candidate", e);
      toast("Could not load previous candidate");
    } finally {
      setIsFetching(false);
    }
  };

  const printChallan = () => window.print();

  const ChallanForm = ({ copyLabel }) => (
    <div className="font-[times] p-6 max-w-4xl mx-auto border-b border-black text-sm page-break">
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
          <p className="font-bold uppercase">{copyLabel}</p>
          <p className="font-bold uppercase">NATIONAL BANK OF PAKISTAN</p>
          <p className="font-bold uppercase">STATE BANK OF PAKISTAN</p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 border border-black">
        <div className="grid grid-cols-[25%_20%_15%_40%] divide-x divide-black">
          {/* Column 1 - BY WHOM TENDER */}
          <div className="flex flex-col text-left border-r border-black">
            <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
              BY WHOM TENDER
            </div>
            <div className="flex flex-col justify-start p-2 text-sm leading-relaxed min-h-[200px]">
              <p className="font-bold">Emigrant Name:</p>
              <input
                type="text"
                value={candidate?.name || ""}
                placeholder="MR. IMTIAZ KHAN"
                className="border-none outline-none placeholder-black mt-1 text-black bg-transparent font-bold w-full"
              />
              <div className="flex items-center gap-1 mt-2">
                <p className="font-bold">P.PNo.:</p>
                <input
                  type="text"
                  value={candidate?.passport || ""}
                  placeholder="00000000"
                  className="border-none outline-none placeholder-black text-black bg-transparent flex-1"
                />
              </div>
              <p className="font-semibold mt-2">
                QURESHI BROTHERS OEP LICENCE #:
              </p>
              <input
                type="text"
                placeholder="OEP-XXXX"
                className="border-none outline-none placeholder-black text-black bg-transparent w-full"
              />
            </div>
          </div>

          {/* Column 2 - TO BE FILLED BY REMITTER */}
          <div className="flex flex-col text-start border-r border-black">
            <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
              TO BE FILLED BY REMITTER
            </div>
            <div className="flex flex-col flex-1 min-h-24 justify-start p-2">
              <p className="font-bold text-sm">
                Director General, Bureau of Emigration and Overseas Employment
              </p>
              <input
                type="text"
                placeholder="REGISTRATION FEE"
                className="font-bold text-black placeholder-black border-b border-black outline-none bg-transparent w-full mt-2"
              />
            </div>
          </div>

          {/* Column 3 - AMOUNT */}
          <div className="flex flex-col text-left justify-start border-r border-black">
            <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center">
              AMOUNT
            </div>
            <div className="flex flex-col justify-center items-center h-full w-full p-2">
              <input
                type="text"
                placeholder="REGISTRATION FEE"
                className="font-bold text-black placeholder-black border-none outline-none bg-transparent text-center w-full"
              />
              <div className="flex items-center gap-2 w-full mt-2">
                <span className="text-lg font-bold">Rs:</span>
                <input
                  type="text"
                  value={challanData.amount}
                  onChange={(e) =>
                    setChallanData({ ...challanData, amount: e.target.value })
                  }
                  placeholder="500"
                  className="text-lg font-bold text-black placeholder-black border-b border-black outline-none bg-transparent w-full"
                />
                <span className="text-lg font-bold">/-</span>
              </div>
            </div>
          </div>

          {/* Column 4 - TO BE FILLED BY OFFICER */}
          <div className="flex flex-col">
            <div className="font-bold border-b border-black flex items-center justify-center h-16 text-center px-2 text-xs">
              TO BE FILLED BY THE DEPARTMENT OFFICER OF THE TREASURY
            </div>
            <div className="grid grid-cols-[55%_45%] flex-1 min-h-[200px]">
              <div className="flex flex-col justify-start p-2 text-xs leading-relaxed">
                <p className="font-bold">Manpower Management</p>
                <input
                  type="text"
                  placeholder="Coa 0139109-029-"
                  className="border-none outline-none bg-transparent text-black placeholder-black mt-1"
                />
                <input
                  type="text"
                  placeholder="0000191"
                  className="border-none outline-none bg-transparent text-black placeholder-black mt-1"
                />
                <p className="font-bold mt-2">Registration fee</p>
                <input
                  type="text"
                  placeholder="Miscellaneous C02906-"
                  className="border-none outline-none bg-transparent text-black placeholder-black mt-1"
                />
                <input
                  type="text"
                  placeholder="code 130"
                  className="border-none outline-none bg-transparent text-black placeholder-black mt-1"
                />
                <p className="font-bold mt-2">
                  Registration fee from Pakistan working abroad
                </p>
              </div>
              <div className="pl-2 border-l border-black flex items-start p-2 overflow-hidden text-xs">
                <p className="break-words">
                  Date Correct Received and Grant Receipt Signature and Full
                  Designation of the Officer ordering the money to be paid in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Total Row */}
      <div className="grid grid-cols-2 text-[11px] mt-4">
        <div className="bg-white p-2 flex items-center">
          <span className="font-bold mr-2"></span>
          <div className="flex-1 h-[1.5rem] bg-white border-none"></div>
        </div>
        <div className="p-2 font-bold border-l border-t border-r border-b border-black">
          <span>
            Total Rs.&nbsp;
            <input
              type="text"
              value={challanData.amount}
              placeholder="500"
              className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold w-16"
            />
            /-
          </span>
          <p className="mt-2">
            in word Rs.&nbsp;
            <input
              type="text"
              value={challanData.amountWords}
              onChange={(e) =>
                setChallanData({ ...challanData, amountWords: e.target.value })
              }
              placeholder="(Five Hundred Rupees Only)"
              className="border-none outline-none bg-transparent text-black placeholder-black placeholder:font-bold w-full"
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
          <p className="text-right w-[320px] text-xs">
            To be used only in case of remittances to Bank through Officer of
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
  );

  return (
    <div className="flex min-h-screen">
      <div className="w-[20%] bg-white border-r border-gray-200 no-print">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 bg-white text-xs font-sans">
        <style>{`@media print{ .no-print{display:none !important} .page-break{page-break-after:always} }`}</style>

        {/* Header - Search and Controls */}
        <div className="flex justify-between gap-2 mb-6 no-print items-center flex-wrap">
          <div className="flex items-center gap-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search candidate..."
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={() => handleSearch()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Search
            </button>
            <button
              onClick={() => clearSearch()}
              className="px-3 py-1 bg-gray-300 text-black rounded text-sm"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={goPrevious}
              disabled={isFetching}
              className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
            >
              ◀ Prev
            </button>
            <button
              onClick={printChallan}
              disabled={isFetching || !candidate}
              className="px-2 py-1 bg-indigo-600 text-white rounded text-xs"
            >
              Print All
            </button>
            <button
              onClick={goNext}
              disabled={isFetching}
              className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
            >
              Next ➜
            </button>
            {isFetching && (
              <div className="px-2 py-1 text-xs text-gray-700 bg-yellow-100 rounded ml-2">
                Loading...
              </div>
            )}
          </div>
        </div>



        {/* Three Challan Forms */}
        <div className="space-y-0">
          <ChallanForm copyLabel="TREASURY/SUB-TREASURY" />
          <ChallanForm copyLabel="NATIONAL BANK OF PAKISTAN" />
          <ChallanForm copyLabel="STATE BANK OF PAKISTAN" />
        </div>
      </div>
    </div>
  );
};

export default NBPChallan;
