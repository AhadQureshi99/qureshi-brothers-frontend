import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../Sidebar/Sidebar";
import {
} from "../../utils/barcodeGenerator";

const UndertakingLetter = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // visaId and eNo are shown from candidate initial registration

  // barcodes removed — show candidate fields instead

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem("undertakingCandidates");
        const storedIdx = parseInt(
          localStorage.getItem("undertakingCandidateIndex") || "0",
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

        // Fallback: fetch table-style list from server and try to position to ?id if provided
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
          // ignore and attempt single-candidate fetch below
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
        console.error("Failed to load undertakingCandidates", e);
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
          localStorage.setItem("undertakingCandidates", JSON.stringify(copy));
        } catch (e) {
          /* ignore */
        }
      }
      return updated;
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    // if we had a cached list from localStorage, reload it; otherwise fetch server full list
    const raw = localStorage.getItem("undertakingCandidates");
    if (raw) {
      try {
        const list = JSON.parse(raw) || [];
        setCandidates(list);
        setCurrentIndex(0);
        setCandidate(list[0] || null);
        return;
      } catch (e) {}
    }

    // fallback - fetch server list
    (async () => {
      try {
        const { data: list } = await axios.get(`/api/candidates`);
        setCandidates(list || []);
        setCurrentIndex(0);
        setCandidate((list && list[0]) || null);
      } catch (e) {
        console.error("Search clear fetch failed", e);
      }
    })();
  };

  const handleSearch = async () => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return clearSearch();
    setIsFetching(true);
    try {
      const { data: list } = await axios.get(`/api/candidates`);
      // client side filter across several fields
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

      if (results.length === 0) {
        toast("No matches");
        return;
      }

      setCandidates(results);
      setCurrentIndex(0);
      setCandidate(results[0]);
      localStorage.setItem("undertakingCandidates", JSON.stringify(results));
      localStorage.setItem("undertakingCandidateIndex", "0");
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
      localStorage.setItem("undertakingCandidates", JSON.stringify(list));
      localStorage.setItem("undertakingCandidateIndex", String(nextIndex));
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
      localStorage.setItem("undertakingCandidates", JSON.stringify(list));
      localStorage.setItem("undertakingCandidateIndex", String(prevIndex));
    } catch (e) {
      console.error("Failed to fetch previous candidate", e);
      toast("Could not load previous candidate");
    } finally {
      setIsFetching(false);
    }
  };

  const saveCandidate = async () => {
    if (!candidate || !candidate._id) {
      toast.error("No candidate selected");
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
      toast.success(res?.data?.message || "Saved");
      const saved = res?.data?.candidate || candidate;
      setCandidate(saved);
      const copy = [...candidates];
      if (copy && copy.length > 0 && currentIndex < copy.length) {
        copy[currentIndex] = saved;
        setCandidates(copy);
        try {
          localStorage.setItem("undertakingCandidates", JSON.stringify(copy));
        } catch (e) {}
      }
    } catch (err) {
      console.error("save failed", err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const printDoc = () => window.print();

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[25%] bg-white border-r border-gray-200 no-print">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center p-6">
        <div className="w-[750px] min-h-[1250px] mx-auto p-10 bg-white text-black text-base leading-relaxed space-y-4 shadow-md undertaking-printable">
          {/* print styles to make sure only the undertaking content prints */}
          <style>{`
            @media print{
              /* hide any element marked no-print */
              .no-print{display:none !important}

              /* reset visibility then only show printable area */
              body *{visibility:hidden}
              .undertaking-printable, .undertaking-printable *{visibility:visible}

              /* make printable area use full page width and desktop-like layout */
              .undertaking-printable{
                position:static !important;
                left:unset !important;
                top:unset !important;
                width:100% !important;
                max-width:unset !important;
                margin:0 !important;
                padding:0.5in !important;
                box-sizing:border-box !important;
              }

              /* nicer print appearance */
              .undertaking-printable { font-size:12pt !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .undertaking-printable input, .undertaking-printable textarea { border:none !important; }

              /* ensure interactive controls do not print */
              .no-print, button, input[type=file], label[for] {display:none !important}
            }

            /* preview mode: make the printable area fullscreen inside the same page */
            .undertaking-preview-open .no-print{display:none !important}
            .undertaking-preview-open .undertaking-printable{
              position:fixed !important;
              left:0 !important;
              top:0 !important;
              width:100% !important;
              height:100% !important;
              overflow:auto !important;
              background:#fff !important;
              z-index:9999 !important;
              padding:18px !important;
              box-shadow:0 0 0 9999px rgba(0,0,0,0.4) !important;
            }
          `}</style>


          {/* Toolbar (no-print) */}
          <div className="flex justify-end gap-2 no-print mb-2 items-center">
            <div className="flex items-center gap-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Search name / passport / eNo / visaID / eNumberID"
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
              disabled={isFetching || saving}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={printDoc}
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
              value={candidate?.name || ""}
              onChange={(e) => setCandidateField("name", e.target.value)}
              className="outline-none w-[135px] inline-block placeholder-black font-bold text-black"
            />{" "}
            S/O{" "}
            <input
              type="text"
              placeholder="FATHER NAME"
              value={candidate?.fatherName || ""}
              onChange={(e) => setCandidateField("fatherName", e.target.value)}
              className="outline-none w-[180px] inline-block placeholder-black font-bold text-black"
            />{" "}
            Passport No.{" "}
            <input
              type="text"
              value={candidate?.passport || ""}
              onChange={(e) => setCandidateField("passport", e.target.value)}
              placeholder="GW0767311"
              className="outline-none w-[90px] inline-block placeholder-black font-bold text-black"
            />{" "}
            is proceeding to Saudi Arabia on visa No.{" "}
            <input
              type="text"
              value={candidate?.eNo || ""}
              onChange={(e) => setCandidateField("eNo", e.target.value)}
              placeholder="1304977335"
              className="outline-none w-[90px] inline-block placeholder-black font-bold text-black"
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

          {/* Table */}
          <table className="w-full text-left border border-black mt-2">
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
                    value={candidate?.name || ""}
                    onChange={(e) => setCandidateField("name", e.target.value)}
                    className="outline-none inline-block placeholder-black font-bold text-black"
                  />
                </td>
                <td className="p-2 border-r border-black font-bold">
                  <input
                    type="text"
                    value={candidate?.passport || ""}
                    onChange={(e) =>
                      setCandidateField("passport", e.target.value)
                    }
                    className="font-bold placeholder-black text-black outline-none w-[110px] inline-block"
                  />
                </td>
                <td className="p-2 font-bold">
                  <input
                    type="text"
                    value={candidate?.eNo || ""}
                    onChange={(e) => setCandidateField("eNo", e.target.value)}
                    className="font-bold placeholder-black text-black outline-none w-[120px] inline-block"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <div className="flex justify-between mt-10">
            <div className="space-y-1">
              <p className="font-bold">TANWEER AHMED</p>
              <p className="font-bold">QURESHI BROTHERS OEP</p>
              <p className="font-bold">0696/RWP</p>
            </div>
            <div className="text-center">
              <input
                type="text"
                value={candidate?.name || ""}
                onChange={(e) => setCandidateField("name", e.target.value)}
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
