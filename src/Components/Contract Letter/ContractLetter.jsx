// File: ContractLetter.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../Sidebar/Sidebar";
import {} from "../../utils/barcodeGenerator";

const ContractLetter = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // show candidate fields instead of generated barcodes

  // barcodes removed — show candidate fields instead

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem("contractCandidates");
        const storedIdx = parseInt(
          localStorage.getItem("contractCandidateIndex") || "0",
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
          // continue to try single candidate
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
        console.error("Failed to load contractCandidates", e);
      }
    };

    load();
  }, []);

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
          localStorage.setItem("contractCandidates", JSON.stringify(copy));
        } catch (e) {}
      }
      return updated;
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    const raw = localStorage.getItem("contractCandidates");
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
      localStorage.setItem("contractCandidates", JSON.stringify(results));
      localStorage.setItem("contractCandidateIndex", "0");
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

      // If current not found in server list, try to anchor using local candidates
      if (idx === -1 && Array.isArray(candidates) && candidates.length > 0) {
        idx = list.findIndex((c) =>
          candidates.some((cc) => String(cc._id) === String(c._id))
        );
      }

      let nextIndex;
      if (idx === -1) {
        // find first server candidate not present in local list (new user)
        const firstNew = list.findIndex(
          (c) => !candidates.some((cc) => String(cc._id) === String(c._id))
        );
        nextIndex = firstNew !== -1 ? firstNew : 0;
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
      localStorage.setItem("contractCandidates", JSON.stringify(list));
      localStorage.setItem("contractCandidateIndex", String(nextIndex));
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
      localStorage.setItem("contractCandidates", JSON.stringify(list));
      localStorage.setItem("contractCandidateIndex", String(prevIndex));
    } catch (e) {
      console.error("Failed to fetch previous candidate", e);
      toast("Could not load previous candidate");
    } finally {
      setIsFetching(false);
    }
  };

  const saveCandidate = async () => {
    if (!candidate || !candidate._id)
      return toast.error("No candidate to save");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { ...candidate };
      delete payload._id;
      const res = await axios.put(`/api/candidates/${candidate._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res?.data?.message || "Saved");
      const saved = res?.data?.candidate || candidate;
      setCandidate(saved);
      const copy = [...candidates];
      if (copy && copy.length > 0 && currentIndex < copy.length) {
        copy[currentIndex] = saved;
        setCandidates(copy);
        try {
          localStorage.setItem("contractCandidates", JSON.stringify(copy));
        } catch (e) {}
      }
    } catch (err) {
      console.error("save failed", err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[25%] bg-white border-r border-gray-200 no-print">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto p-8 bg-white text-black font-sans border border-gray-300 contract-printable">
          {/* print styles so only the contract content prints */}
          <style>{`
            @media print{
              .no-print{display:none !important}
              body *{visibility:hidden}
              .contract-printable, .contract-printable *{visibility:visible}
              .contract-printable{position:static !important; left:unset !important; top:unset !important; width:100% !important; max-width:unset !important; margin:0 !important; padding:0.5in !important; box-sizing:border-box !important;}
              .contract-printable { font-size:12pt !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .contract-printable input, .contract-printable textarea { border:none !important; }
              .no-print, button, input[type=file], label[for] {display:none !important}
            }

            .contract-preview-open .no-print{display:none !important}
            .contract-preview-open .contract-printable{position:fixed !important; left:0 !important; top:0 !important; width:100% !important; height:100% !important; overflow:auto !important; background:#fff !important; z-index:9999 !important; padding:18px !important; box-shadow:0 0 0 9999px rgba(0,0,0,0.4) !important;}
          `}</style>



          {/* print toolbar - not printed (no-print) */}
          <div className="flex justify-end gap-2 no-print mb-4 items-center">
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
            <button
              onClick={goPrevious}
              disabled={isFetching}
              className="px-3 py-1 bg-gray-600 text-white rounded"
            >
              ◀ Prev
            </button>
            <button
              onClick={saveCandidate}
              disabled={isFetching || saving || !candidate}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => window.print()}
              disabled={isFetching || !candidate}
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
              Print
            </button>
            <button
              onClick={goNext}
              disabled={isFetching}
              className="px-3 py-1 bg-gray-600 text-white rounded"
            >
              Next ➜
            </button>
            {isFetching && (
              <div className="px-3 py-1 text-xs text-gray-700 bg-yellow-100 rounded ml-2">
                Loading...
              </div>
            )}
          </div>
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
              placeholder: " ة جᣎ ᡫ  للخدمات الᘘحᗫᖁة ᣃكة الشخص الواحد",
            },
            { label: "VISA No.", placeholder: "1304977335" },
            { label: "VISA ID", placeholder: "7001769202" },
          ].map((item, index) => (
            <div key={index} className="mb-3 flex items-center">
              <label className="w-56">{item.label}</label>
              <input
                type="text"
                placeholder={item.placeholder}
                value={
                  item.label === "VISA No."
                    ? candidate?.visaNo || ""
                    : item.label === "VISA ID"
                    ? candidate?.visaId || ""
                    : candidate?.companyNameEnglish || ""
                }
                onChange={(e) =>
                  setCandidateField(
                    item.label === "VISA No."
                      ? "visaNo"
                      : item.label === "VISA ID"
                      ? "visaId"
                      : "companyNameEnglish",
                    e.target.value
                  )
                }
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
                value={
                  item.label === "SECOND PARTY NAME"
                    ? candidate?.name || ""
                    : item.label === "PASSPORT No"
                    ? candidate?.passport || ""
                    : item.label === "TRADE"
                    ? candidate?.profession || ""
                    : item.label === "SALARY"
                    ? candidate?.salary || ""
                    : ""
                }
                onChange={(e) =>
                  setCandidateField(
                    item.label === "SECOND PARTY NAME"
                      ? "name"
                      : item.label === "PASSPORT No"
                      ? "passport"
                      : item.label === "TRADE"
                      ? "profession"
                      : item.label === "SALARY"
                      ? "salary"
                      : "",
                    e.target.value
                  )
                }
                className="flex-1 border-none bg-transparent pl-10 font-bold text-black focus:outline-none placeholder-black"
              />
            </div>
          ))}

          <hr className="border-black my-4" />

          {/* TERMS & CONDITIONS */}
          <h2 className="font-bold mb-4 underline">TERMS & CONDITIONS</h2>
          <ol className="list-decimal pl-6 space-y-4 text-justify">
            <li>
              CONTRACT IS FOR ONE YEAR. RECRUITED PERSONNEL WILL BE ON A
              PROBATION PERIOD OF 90 DAYS. CONFIRMATION WILL BE GRANTED UPON
              SUCCESSFUL COMPLETION OF THIS PERIOD.
            </li>
            <li>
              WORKING HOURS WILL BE 08 HOURS PER DAY AND 48 HOURS PER WEEK.
            </li>
            <li>FOOD WILL BE PROVIDED BY THE COMPANY.</li>
            <li>
              FREE ACCOMMODATION AND TRANSPORTATION WILL BE PROVIDED BY THE
              COMPANY.
            </li>
            <li>
              A FREE ROUND-TRIP TICKET WILL BE PROVIDED UPON COMPLETION OF ONE
              YEAR OF SERVICE.
            </li>
            <li>
              MEDICAL SERVICES WILL BE AVAILABLE FOR THE EMPLOYEE ONLY, AS PER
              PRIVATE SECTOR STANDARDS IN KSA.
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
              <p className="mt-4 font-bold">
                {candidate?.name || "WAJAHAT MALIK"}
              </p>
              <div className="border-t border-black w-48 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractLetter;
