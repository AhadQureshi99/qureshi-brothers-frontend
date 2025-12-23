import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../Sidebar/Sidebar";
const logo = "/alliedform_banklogo.png";

const AlliedForm = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem("alliedCandidates");
        const storedIdx = parseInt(
          localStorage.getItem("alliedCandidateIndex") || "0",
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
          // fallback to fetching a single candidate
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
        console.error("Failed to load alliedCandidates", e);
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
          localStorage.setItem("alliedCandidates", JSON.stringify(copy));
        } catch (e) {}
      }
      return updated;
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    const raw = localStorage.getItem("alliedCandidates");
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
      localStorage.setItem("alliedCandidates", JSON.stringify(results));
      localStorage.setItem("alliedCandidateIndex", "0");
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
      localStorage.setItem("alliedCandidates", JSON.stringify(list));
      localStorage.setItem("alliedCandidateIndex", String(nextIndex));
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
      localStorage.setItem("alliedCandidates", JSON.stringify(list));
      localStorage.setItem("alliedCandidateIndex", String(prevIndex));
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
          localStorage.setItem("alliedCandidates", JSON.stringify(copy));
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
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-[20%] border-r border-gray-300 no-print">
          <Sidebar />
        </div>

        {/* Main Form Content */}
        <div className="w-[80%] p-8 m-2 text-sm border border-black allied-printable">
          <style>{`
            @media print{
              .no-print{display:none !important}
              body *{visibility:hidden}
              .allied-printable, .allied-printable *{visibility:visible}
              .allied-printable{position:static !important; left:unset !important; top:unset !important; width:100% !important; max-width:unset !important; margin:0 !important; padding:0.5in !important; box-sizing:border-box !important}
              .allied-printable { font-size:12pt !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .allied-printable input, .allied-printable textarea { border:none !important; }
              .no-print, button, input[type=file], label[for] {display:none !important}
            }

            .allied-preview-open .no-print{display:none !important}
            .allied-preview-open .allied-printable{position:fixed !important; left:0 !important; top:0 !important; width:100% !important; height:100% !important; overflow:auto !important; background:#fff !important; z-index:9999 !important; padding:18px !important; box-shadow:0 0 0 9999px rgba(0,0,0,0.4) !important}
          `}</style>

          {/* Header and Toolbar */}
          <div className="flex justify-between items-center gap-2 mb-6 no-print">
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
                  value={candidate?.name || ""}
                  onChange={(e) => setCandidateField("name", e.target.value)}
                  className="w-full bg-transparent outline-none text-center px-2 py-1"
                />
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black text-center px-2 py-1">
                  S/O
                </p>
                <input
                  type="text"
                  value={candidate?.fatherName || ""}
                  onChange={(e) =>
                    setCandidateField("fatherName", e.target.value)
                  }
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
                  value={candidate?.contact || ""}
                  onChange={(e) => setCandidateField("contact", e.target.value)}
                  className="w-full bg-transparent outline-none text-center px-2 py-1"
                />
              </div>
              <div className="grid grid-cols-2">
                <p className="border-r border-black text-center px-2 py-1">
                  ID Number*
                </p>
                <input
                  type="text"
                  value={candidate?.idNumber || ""}
                  onChange={(e) =>
                    setCandidateField("idNumber", e.target.value)
                  }
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
              value={candidate?.name || ""}
              onChange={(e) => setCandidateField("name", e.target.value)}
              className="border-r border-b border-black bg-transparent outline-none px-2 py-1"
            />
            <p className="border-r border-b border-black flex items-center justify-center px-2 py-1">
              S/O
            </p>
            <input
              type="text"
              value={candidate?.fatherName || ""}
              onChange={(e) => setCandidateField("fatherName", e.target.value)}
              className="border-b border-black bg-transparent outline-none px-2 py-1"
            />

            {/* Row 2 */}
            <p className="border-r border-b border-black flex items-center justify-center px-2 py-1">
              Contact Number
            </p>
            <input
              type="text"
              value={candidate?.contact || ""}
              onChange={(e) => setCandidateField("contact", e.target.value)}
              className="border-r border-b border-black bg-transparent outline-none px-2 py-1"
            />
            <p className="border-r border-b border-black flex items-center justify-center px-2 py-1">
              ID Number*
            </p>
            <input
              type="text"
              value={candidate?.idNumber || ""}
              onChange={(e) => setCandidateField("idNumber", e.target.value)}
              className="border-b border-black bg-transparent outline-none px-2 py-1"
            />
            <p className="border-r border-black flex items-center justify-center px-2 py-1"></p>
            <input
              type="text"
              value={candidate?.address || ""}
              onChange={(e) => setCandidateField("address", e.target.value)}
              className="col-span-3 bg-transparent outline-none px-2 py-1 w-full"
              style={{ borderBottom: "1px solid black" }} // Optional if you want bottom border
            />

            {/* Row 3 & 4 combined: Address spans two rows (cols 1 and 2), Passport Number on right */}
            <p className="border-r border-black flex items-center justify-center px-2 py-1 row-span-2">
              Address
            </p>
            <input
              type="text"
              value={candidate?.address || ""}
              onChange={(e) => setCandidateField("address", e.target.value)}
              className="border-r border-black bg-transparent outline-none px-2 py-1 row-span-2"
            />
            <p className="border-r border-black flex items-center justify-center px-2 py-1">
              Passport Number
            </p>
            <input
              type="text"
              value={candidate?.passport || ""}
              onChange={(e) => setCandidateField("passport", e.target.value)}
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
                    value={candidate?.companyNameEnglish || ""}
                    onChange={(e) =>
                      setCandidateField("companyNameEnglish", e.target.value)
                    }
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
