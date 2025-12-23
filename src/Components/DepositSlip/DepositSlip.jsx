import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../Sidebar/Sidebar";
import {} from "../../utils/barcodeGenerator";

const NBPLogo = "/depositslip_nbp_logo.png";

const DepositSlip = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [editing, setEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // show candidate visaId and eNo instead of generated barcodes

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
        } catch (e) {
          // fallback to fetching single candidate
        }

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
        console.error("Failed to load depositCandidates", e);
      }
    };

    load();
  }, []);

  // Keep candidate in-sync and generate IDs when currentIndex changes
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
          check(c.profession).includes(q) ||
          check(c.companyNameEnglish).includes(q) ||
          check(c.fatherName).includes(q) ||
          check(c.contact).includes(q)
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

  // Keep candidate in-sync when currentIndex or candidates change
  useEffect(() => {
    if (Array.isArray(candidates) && candidates.length > 0) {
      if (currentIndex >= 0 && currentIndex < candidates.length) {
        setCandidate(candidates[currentIndex]);
      }
    }
  }, [currentIndex, candidates]);

  const setCandidateField = (field, value) => {
    setCandidate((prev) => {
      const updated = { ...(prev || {}), [field]: value };
      const copy = [...candidates];
      if (copy && copy.length > 0 && currentIndex < copy.length) {
        copy[currentIndex] = { ...copy[currentIndex], ...updated };
        setCandidates(copy);
        try {
          localStorage.setItem("depositCandidates", JSON.stringify(copy));
        } catch (e) {
          console.error("Could not persist depositCandidates", e);
        }
      }
      return updated;
    });
  };

  const saveCandidate = async () => {
    if (!candidate || !candidate._id) {
      toast.error("No candidate selected to save");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { ...candidate };
      delete payload._id;
      const res = await axios.put(`/api/candidates/${candidate._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res?.data?.message || "Candidate saved");
      const saved = res?.data?.candidate || candidate;
      setCandidate(saved);
      const copy = [...candidates];
      if (copy && copy.length > 0 && currentIndex < copy.length) {
        copy[currentIndex] = saved;
        setCandidates(copy);
        try {
          localStorage.setItem("depositCandidates", JSON.stringify(copy));
        } catch (e) {}
      }
    } catch (err) {
      console.error("Failed to save candidate", err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const { data: list } = await axios.get(`/api/candidates`);
      if (!Array.isArray(list) || list.length === 0) {
        toast("No more candidates in the list");
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
        toast("No more candidates in the list");
        return;
      }

      setCandidates(list);
      setCurrentIndex(nextIndex);
      setCandidate(list[nextIndex]);
      localStorage.setItem("depositCandidates", JSON.stringify(list));
      localStorage.setItem("depositCandidateIndex", String(nextIndex));
      setEditing(true);
    } catch (e) {
      console.error("Failed to fetch next candidate", e);
      toast("Could not load next candidate");
    } finally {
      setIsFetching(false);
    }
    setEditing(true);
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
      setEditing(true);
    } catch (e) {
      console.error("Failed to fetch previous candidate", e);
      toast("Could not load previous candidate");
    } finally {
      setIsFetching(false);
    }
  };

  const printSlip = () => window.print();

  // Helper component to render a single form copy
  const DepositSlipForm = ({ copyLabel }) => (
    <div className="max-w-5xl mx-auto border-black deposit-printable mb-12 page-break">
      <div className="flex justify-between items-start p-2">
        <div>
          <img src={NBPLogo} alt="NBP Logo" className="w-24" />
        </div>
        <div className="text-center flex-1 -ml-20">
          <h1 className="text-base font-bold">SPECIALIZED DEPOSIT SLIP</h1>
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
          <p className="font-semibold">{copyLabel}</p>
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
              value={candidate?.name || ""}
              readOnly={!editing}
              onChange={(e) => setCandidateField("name", e.target.value)}
              className="col-span-4 p-1 font-bold text-[11px] border-black bg-gray-300 border-r"
            />
          </div>
          <div className="grid grid-cols-6">
            <label className="col-span-1 p-1 text-[11px]">CNIC</label>
            <input
              type="text"
              value={candidate?.cnic || ""}
              readOnly={!editing}
              onChange={(e) => setCandidateField("cnic", e.target.value)}
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
              value={candidate?.contact || ""}
              readOnly={!editing}
              onChange={(e) => setCandidateField("contact", e.target.value)}
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
              value={candidate?.residence || ""}
              readOnly={!editing}
              onChange={(e) => setCandidateField("residence", e.target.value)}
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
            CREDIT TO BE MADE THROUGH TRANSACTION CODE "ZBOEOP"
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
            <span className="font-bold mr-2 border-r">Amount in Words:</span>
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
            Depositor's Signature
          </div>
        </div>

        {/* Signature Rows */}
        <div className="grid grid-cols-3 text-left border-b border-black">
          {/* Column 1 */}
          <div className="p-2 border-r border-black border-l">
            <p className="mt-16 text-center">Cashier's Stamp & Signature</p>
          </div>

          {/* Column 2 */}
          <div className="p-2 border-r border-black">
            <p className="mt-16 text-center">Authorized Officer's Signature</p>
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
  );

  // Main return
  return (
    <div className="flex min-h-screen">
      <div className="w-[20%] bg-white border-r border-gray-200 no-print">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 bg-white text-xs font-sans">
        <style>{`@media print{ .no-print{display:none !important} .page-break{page-break-after:always} }`}</style>

        {/* Header - Search and Controls */}
        <div className="flex justify-between gap-2 mb-6 no-print items-center">
          <div className="flex items-center gap-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search name / passport / eNo / profession"
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
              onClick={saveCandidate}
              disabled={isFetching || saving}
              className="px-2 py-1 bg-green-600 text-white rounded text-xs"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={printSlip}
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



        {/* Three Forms Container */}
        <div className="space-y-0">
          <DepositSlipForm copyLabel="Bank Copy" />
          <DepositSlipForm copyLabel="OPF Copy" />
          <DepositSlipForm copyLabel="BE&OE Copy" />
        </div>
      </div>
    </div>
  );
};

export default DepositSlip;
