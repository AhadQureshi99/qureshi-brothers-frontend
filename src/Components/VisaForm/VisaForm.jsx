import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import { generateBarcode } from "../../utils/barcodeGenerator";
const logo = "/visaform_logo.png";
import { FaEye } from "react-icons/fa";

const VisaForm = () => {
  // Get user from Redux
  const { user } = useSelector((state) => state.user);

  // state to hold multiple candidates (when opened from Initial Registration table)
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidate, setCandidate] = useState(null);
  // Check if user has edit permission for visaForm
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formID, setFormID] = useState("");
  const [uniqueNo, setUniqueNo] = useState("");
  const printRef = useRef(null);

  // Set editing based on user permissions
  useEffect(() => {
    if (!user) {
      setEditing(false);
      return;
    }

    // Superadmin can always edit
    if (user.role === "superadmin") {
      setEditing(true);
      return;
    }

    // Check role-based permissions
    const canEdit = user.permissions?.forms?.visaForm?.edit === true;

    setEditing(canEdit);
  }, [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("visaCandidates");
      const idx = parseInt(
        localStorage.getItem("visaCandidateIndex") || "0",
        10
      );
      if (raw) {
        const list = JSON.parse(raw);
        setCandidates(list || []);
        if (!isNaN(idx) && idx >= 0 && idx < (list || []).length) {
          setCurrentIndex(idx);
          setCandidate(list[idx]);
          // Populate IDs from candidate initial registration fields
          setFormID(list[idx]?.visaId || "");
          setUniqueNo(list[idx]?.eNo || "");
        }
      } else {
        // fallback: if no local list but URL has ?id=... try fetching that candidate
        try {
          const params = new URLSearchParams(window.location.search);
          const id = params.get("id");
          if (id) {
            axios
              .get(`/api/candidates/${id}`)
              .then((res) => {
                const c = res.data;
                setCandidates([c]);
                setCandidate(c);
                setCurrentIndex(0);
                // Populate IDs from candidate initial registration fields
                setFormID(c?.visaId || "");
                setUniqueNo(c?.eNo || "");
              })
              .catch((err) =>
                console.error("Could not load candidate by id", err)
              );
          } else {
            // if no id, attempt to get initial registration candidates and show first
            axios
              .get(`/api/candidates/`)
              .then((res) => {
                const list = res.data?.candidates || res.data || [];
                const initial = (list || []).filter((c) =>
                  (c.status || "").toLowerCase().includes("initial")
                );
                if (initial.length > 0) {
                  setCandidates(initial);
                  setCurrentIndex(0);
                  setCandidate(initial[0]);
                  // Populate IDs from candidate initial registration fields
                  setFormID(initial[0]?.visaId || "");
                  setUniqueNo(initial[0]?.eNo || "");
                }
              })
              .catch((err) => console.error("Could not load candidates", err));
          }
        } catch (err) {
          console.error("URL parse error or axios missing", err);
        }
      }
    } catch (err) {
      console.error("Failed to parse visaCandidates from localStorage", err);
    }
  }, []);

  // Populate IDs from candidate when candidate changes
  useEffect(() => {
    if (candidate) {
      setFormID(candidate?.visaId || "");
      setUniqueNo(candidate?.eNo || "");
    }
  }, [candidate]);

  // Generate barcodes when IDs change
  useEffect(() => {
    generateBarcode("formIDBarcode", formID);
    generateBarcode("uniqueNoBarcode", uniqueNo);
  }, [formID, uniqueNo]);

  // helper to sync candidate updates into localStorage list
  const setCandidateField = (field, value) => {
    setCandidate((prev) => {
      const updated = { ...(prev || {}), [field]: value };
      // update list copy and persist
      const copy = [...candidates];
      if (copy && copy.length > 0 && currentIndex < copy.length) {
        copy[currentIndex] = { ...copy[currentIndex], ...updated };
        setCandidates(copy);
        localStorage.setItem("visaCandidates", JSON.stringify(copy));
      }
      return updated;
    });
  };

  const formatDisplayDate = (isoDate) => {
    if (!isoDate) return "";
    try {
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return isoDate;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    } catch (e) {
      return isoDate;
    }
  };

  const saveCandidate = async () => {
    if (!candidate || !candidate._id) {
      toast.error("No candidate selected to save");
      return;
    }

    // Check if user has permission to edit
    if (!editing) {
      toast.error("You do not have permission to edit this form");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      // send the whole candidate object (except _id) so all editable fields are persisted
      const payload = { ...candidate };
      delete payload._id;

      const res = await axios.put(`/api/candidates/${candidate._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res?.data?.message || "Candidate saved");
      // update local list and localStorage with saved candidate from server if present
      const saved = res?.data?.candidate || candidate;
      setCandidate(saved);
      const copy = [...candidates];
      if (copy && copy.length > 0 && currentIndex < copy.length) {
        copy[currentIndex] = saved;
        setCandidates(copy);
        try {
          localStorage.setItem("visaCandidates", JSON.stringify(copy));
        } catch (e) {
          console.error("Could not persist visaCandidates to localStorage", e);
        }
      }
    } catch (err) {
      console.error("Failed to save candidate", err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const printVisa = () => {
    // Print the current page (visa form). Browser print dialog will appear.
    try {
      window.print();
    } catch (err) {
      console.error("Print failed", err);
      toast.error("Print failed");
    }
  };

  const goNext = () => {
    const next = currentIndex + 1;
    if (next >= candidates.length) {
      toast("No more candidates in the list");
      return;
    }
    setCurrentIndex(next);
    setCandidate(candidates[next]);
    localStorage.setItem("visaCandidateIndex", String(next));
    setEditing(true);
  };

  const goPrevious = () => {
    const prev = currentIndex - 1;
    if (prev < 0) {
      toast("Already at first candidate");
      return;
    }
    setCurrentIndex(prev);
    setCandidate(candidates[prev]);
    localStorage.setItem("visaCandidateIndex", String(prev));
    setEditing(true);
  };

  // toggle a body class while the preview is open so we can alter layout without duplicating markup
  useEffect(() => {
    if (previewOpen) document.body.classList.add("visa-preview-open");
    else document.body.classList.remove("visa-preview-open");
    return () => document.body.classList.remove("visa-preview-open");
  }, [previewOpen]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {previewOpen && (
        <div className="visa-preview-toolbar no-print">
          <button
            onClick={() => setPreviewOpen(false)}
            className="px-3 py-1 bg-gray-600 text-white rounded-md"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md"
          >
            Print
          </button>
        </div>
      )}
      {/* Sidebar */}
      <div className="hidden md:block w-[25%] bg-white border-r border-gray-200 no-print">
        <Sidebar />
      </div>

      {/* Form Container */}
      <div
        ref={printRef}
        className="flex-1 bg-white p-4 md:p-6 overflow-auto visa-printable"
      >
        {/* print styles to make sure only the main form content prints */}
        <style>{`
          @media print{
            /* hide any element marked no-print */
            .no-print{display:none !important}

            /* reset visibility then only show printable area */
            body *{visibility:hidden}
            .visa-printable, .visa-printable *{visibility:visible}

            /* make the printable area use full available width and desktop-like layout */
            .visa-printable{
              position:static !important;
              left:unset !important;
              top:unset !important;
              width:100% !important;
              max-width:unset !important;
              margin:0 !important;
              padding:0.5in !important; /* add some printable margins */
              box-sizing:border-box !important;
            }

            /* make text slightly larger and avoid truncation */
            .visa-printable { font-size:12pt !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .visa-printable input, .visa-printable textarea { border:none !important; }

            /* remove controls, interactive elements and icons from printing */
            .no-print, button, input[type=file], label[for="visaPhotoUpload"]{display:none !important}
          }

          /* preview mode — show visa printable area fullscreen inside the same page */
          .visa-preview-open .no-print{display:none !important}
          .visa-preview-open .visa-printable{
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
          .visa-preview-toolbar{position:fixed;right:18px;top:18px;z-index:10000;display:flex;gap:8px}
        `}</style>
        {/* Barcode and ID Section - Top of Page */}
        <div className="flex justify-between items-center gap-3 mb-6">
          {/* Left Side - Visa ID Barcode */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <p className="text-xs font-bold mb-1 text-center uppercase">
              Visa ID
            </p>
            <p className="font-bold text-xs mb-2 text-center px-1 py-0.5 w-full truncate">
              {formID}
            </p>
            <svg
              id="formIDBarcode"
              style={{ maxWidth: "100%", height: "auto" }}
            ></svg>
          </div>

          {/* Right Side - E-Number Barcode */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <p className="text-xs font-bold mb-1 text-center uppercase">
              E-Number
            </p>
            <p className="font-bold text-xs mb-2 text-center px-1 py-0.5 w-full truncate">
              {uniqueNo}
            </p>
            <svg
              id="uniqueNoBarcode"
              style={{ maxWidth: "100%", height: "auto" }}
            ></svg>
          </div>
        </div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-2">
          {/* Photo Box */}
          <div className="w-40 h-40 border border-green-500 flex flex-col items-center justify-center text-xs text-gray-500 md:mb-0 leading-snug text-center relative">
            <p className="text-sm text-gray-600 mb-1">صورة</p>
            {candidate?.profilePicture ? (
              <img
                src={
                  candidate.profilePicture.startsWith("http")
                    ? candidate.profilePicture
                    : `https://api.cloudandroots.com/Uploads/profilePictures/${candidate.profilePicture.replace(
                        /^\/+/,
                        ""
                      )}`
                }
                alt="candidate"
                className="w-36 h-36 object-cover rounded-sm"
              />
            ) : (
              <p>Paste Photo Here</p>
            )}

            <input
              id="visaPhotoUpload"
              type="file"
              accept="image/*"
              className="hidden no-print"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !candidate?._id) return;
                const fd = new FormData();
                fd.append("profilePicture", file);
                try {
                  const token = localStorage.getItem("token");
                  const res = await axios.post(
                    `/api/candidates/${candidate._id}/profile-picture`,
                    fd,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  const updated = res?.data?.candidate || res?.data;
                  setCandidate(updated);
                  // update list copy
                  const copy = [...candidates];
                  if (copy && copy.length > 0 && currentIndex < copy.length) {
                    copy[currentIndex] = updated;
                    setCandidates(copy);
                    localStorage.setItem(
                      "visaCandidates",
                      JSON.stringify(copy)
                    );
                  }
                  toast.success("Profile picture uploaded");
                } catch (err) {
                  console.error("Upload profile picture failed", err);
                  toast.error("Upload failed");
                }
              }}
            />

            <div className="absolute -bottom-4 right-0 flex gap-2 no-print">
              <label
                htmlFor="visaPhotoUpload"
                className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer text-xs"
              >
                Upload
              </label>
              <button
                onClick={() => {
                  // Preview only action: open photo in new tab
                  if (candidate?.profilePicture)
                    window.open(candidate.profilePicture, "_blank");
                }}
                className="text-white px-2 py-1 bg-gray-700 rounded-md text-xs"
              >
                <FaEye size={12} />
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Saudi Logo"
              className="w-40 h-40 object-contain"
            />
          </div>

          {/* Embassy Text */}
          {/* Right side quick editor / controls */}
          <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-80 p-4 border rounded-md bg-gray-50 no-print">
            <h4 className="font-semibold mb-2">Selected candidate</h4>
            {!candidate ? (
              <p className="text-sm text-gray-500">
                No candidate selected. Open one from Initial Registration table.
              </p>
            ) : (
              <div className="space-y-2">
                {/* Minimal read-only summary here, full editable fields are on the main form */}
                <div className="text-sm font-semibold">
                  {candidate?.name || "Unnamed"}
                </div>
                <div className="text-xs text-gray-600">
                  <div>Passport: {candidate?.passport || "—"}</div>
                  <div>Visa No: {candidate?.visaNo || "—"}</div>
                  <div>Profession: {candidate?.profession || "—"}</div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={goPrevious}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md"
                    disabled={currentIndex <= 0}
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={saveCandidate}
                    disabled={saving}
                    className="px-3 py-1 bg-green-600 text-white rounded-md disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setPreviewOpen(true)}
                    disabled={!candidate}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Preview
                  </button>
                  <button
                    onClick={printVisa}
                    disabled={!candidate}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Print
                  </button>
                  <button
                    onClick={goNext}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md ml-auto"
                    disabled={currentIndex >= candidates.length - 1}
                  >
                    Next ➜
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {candidates.length} in list · showing {currentIndex + 1}
                </div>
              </div>
            )}
          </div>
          <div className="text-center md:text-right md:mt-0 md:mr-12">
            <p className="text-green-500 border-b border-green-500 py-2 mb-4">
              سفارة المملكة العربية السعودية
            </p>
            <h3 className="text-green-500 text-sm md:text-base">
              EMBASSY OF SAUDI ARABIA
            </h3>
            <p className="text-green-500 text-xs md:text-sm">
              CONSULAR SECTION
            </p>
          </div>
        </div>

        {/* Main Form Border */}
        <div className="border border-green-700 text-xs md:text-sm">
          {/* Full Name */}
          <div className="flex border-b border-green-700">
            {/* Left label */}
            <div className="w-[20%] font-semibold p-2">FULL NAME</div>

            {/* Middle input */}
            <p className="flex items-center justify-center flex-grow px-6 py-1">
              <input
                type="text"
                value={candidate?.name || ""}
                readOnly={!editing}
                onChange={(e) => setCandidateField("name", e.target.value)}
                placeholder="WAJAHAT MALIK S/O MUNIR AHMED MALIK"
                className="bg-transparent outline-none placeholder-black text-center w-full"
              />
            </p>

            {/* Right Arabic label */}
            <div className="w-[20%] p-2 text-right pr-4">:الاسم الكامل</div>
          </div>

          {/* DOB / Place of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF BIRTH column */}
            <div className="flex py-2 border-r border-green-700 items-center">
              {/* Left label */}
              <div className="w-[20%] font-semibold px-2">DATEOFBIRTH:</div>

              {/* Middle input */}
              <div className="flex-grow px-4">
                <input
                  type="text"
                  value={
                    candidate?.dateOfBirth
                      ? formatDisplayDate(candidate.dateOfBirth)
                      : ""
                  }
                  readOnly={!editing}
                  onChange={(e) =>
                    setCandidateField("dateOfBirth", e.target.value)
                  }
                  placeholder="05-06-1990 (45) YEARS"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>

              {/* Right Arabic label */}
              <div className="w-[20%] text-right pr-4">:تاريخ الولادة</div>
            </div>

            {/* PLACE OF BIRTH column */}
            <div className="flex items-center">
              {/* Left label */}
              <div className="w-[20%] font-semibold px-2">PLACEOFBIRTH:</div>

              {/* Middle input */}
              <div className="flex-grow px-4">
                <input
                  type="text"
                  value={candidate?.placeOfBirth || ""}
                  readOnly={!editing}
                  onChange={(e) =>
                    setCandidateField("placeOfBirth", e.target.value)
                  }
                  placeholder="RAWALPINDI, PAK"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
                <input
                  type="text"
                  placeholder="Wajahat Malik"
                  className="bg-transparent outline-none placeholder-black px-2 py-1 w-40 text-right"
                  value={candidate?.name || ""}
                  readOnly={!editing}
                  onChange={(e) => setCandidateField("name", e.target.value)}
                />
              </div>

              {/* Right Arabic label */}
              <div className="w-[20%] text-right pr-4">:محل الولادة</div>
            </div>
          </div>

          {/* Previous & Present Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* PREVIOUS NATIONALITY */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-[20%] font-semibold p-2">
                PREVIOUSNATIONALITY:
              </div>
              <div className="flex items-center justify-center flex-grow px-4 py-1">
                <input
                  type="text"
                  placeholder="PAKISTAN"
                  value={candidate?.previousNationality || ""}
                  onChange={(e) =>
                    setCandidateField("previousNationality", e.target.value)
                  }
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div
                className="w-[25%] p-2 text-right pr-4 whitespace-nowrap"
                dir="rtl"
              >
                الجنسية السابقة:
              </div>
            </div>

            {/* PRESENT NATIONALITY */}
            <div className="flex items-center">
              <div className="w-[20%] font-semibold p-2">
                PRESENTNATIONALITY:
              </div>
              <div className="flex items-center justify-center flex-grow px-4 py-1">
                <input
                  type="text"
                  placeholder="PAKISTAN"
                  value={candidate?.presentNationality || ""}
                  onChange={(e) =>
                    setCandidateField("presentNationality", e.target.value)
                  }
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div
                className="w-[25%] p-2 text-right pr-4 whitespace-nowrap"
                dir="rtl"
              >
                الجنسية الحالية:
              </div>
            </div>
          </div>

          {/* Gender & Marital Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* Gender column */}
            <div className="grid grid-cols-4 border-r border-green-700 text-center">
              {/* GENDER label */}
              <div className="border-r border-green-700 p-2 font-semibold flex flex-col justify-center">
                <span className="text-sm">{/* Arabic */}</span>
                <span>GENDER</span>
              </div>

              {/* FEMALE */}
              <div className="border-r border-green-700 p-2 flex flex-col justify-center">
                <span className="text-sm">أنثى</span>
                <span>FEMALE</span>
              </div>

              {/* MALE */}
              <div className="border-r border-green-700 p-2 flex flex-col justify-center">
                <span className="text-sm">ذكر</span>
                <span>MALE</span>
              </div>

              {/* Empty Arabic column */}
              <div className="p-2 flex flex-col justify-center">
                <span className="text-sm">:جنس</span>
              </div>
            </div>

            {/* Marital Status column */}
            <div className="flex items-center">
              <div className="w-1/4 font-semibold p-2">MARITALSTATUS</div>

              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder="MARRIED"
                  value={candidate?.maritalStatus || ""}
                  onChange={(e) =>
                    setCandidateField("maritalStatus", e.target.value)
                  }
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>

              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                الحالة الاجتماعية:{" "}
              </div>
            </div>
          </div>

          {/* Religion & Sect */}
          {/* Sect & Religion */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* SECT column */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/4 font-semibold p-2">SECT:</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder="SUNNI"
                  value={candidate?.sect || ""}
                  onChange={(e) => setCandidateField("sect", e.target.value)}
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                المذهب:
              </div>
            </div>

            {/* RELIGION column */}
            <div className="flex items-center">
              <div className="w-1/4 font-semibold p-2">RELIGION</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder="ISLAM"
                  value={candidate?.religion || ""}
                  onChange={(e) =>
                    setCandidateField("religion", e.target.value)
                  }
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                الديانة:
              </div>
            </div>
          </div>

          {/* Qualification & Profession */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* QUALIFICATION */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/4 font-semibold p-2">QUALIFICATION:</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder=""
                  value={candidate?.qualification || ""}
                  onChange={(e) =>
                    setCandidateField("qualification", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                الموهل العلمي:
              </div>
            </div>

            {/* PROFESSION */}
            <div className="flex items-center">
              <div className="w-1/4 font-semibold p-2">PROFESSION</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  value={candidate?.profession || ""}
                  onChange={(e) =>
                    setCandidateField("profession", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                المهنة:
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="flex border-b border-green-700 items-center">
            {/* English Label */}
            <div className="w-1/4 font-semibold p-2">HOME ADDRESS & PHONE:</div>

            {/* Input Field */}
            <div className="flex-grow p-2">
              <textarea
                placeholder="House No. P/138, Street No. 1, MHALLAH IMAMBARHA, Rawalpindi\n0300-1234567"
                value={candidate?.address || ""}
                onChange={(e) => setCandidateField("address", e.target.value)}
                className="bg-transparent outline-none text-center w-full resize-none placeholder-black"
                rows={2}
              ></textarea>
            </div>

            {/* Arabic Label */}
            <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
              عنوان المنزل ورقم التلفون:
            </div>
          </div>

          <div className="flex border-b border-green-700 items-center">
            {/* English Label */}
            <div className="w-1/3 font-semibold p-2">
              BUSINESS ADDRESS & PHONE:
            </div>

            {/* Input Field */}
            <div className="w-1/3 p-2">
              <textarea
                placeholder=""
                value={candidate?.businessAddress || ""}
                onChange={(e) =>
                  setCandidateField("businessAddress", e.target.value)
                }
                className="bg-transparent outline-none text-center w-full resize-none placeholder-black"
                rows={2}
              ></textarea>
            </div>

            {/* Arabic Label */}
            <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
              عنوان محل العمل ورقم التلفون:
            </div>
          </div>

          <div className="border-b border-green-700 p-2">
            <div className="flex items-center">
              {/* Left English label */}
              <span className="whitespace-nowrap mr-2">Purpose of Travel:</span>

              {/* 7 columns with reduced width */}
              <div className="grid grid-cols-7 gap-0 flex-1">
                {[
                  { en: "WORK", ar: "عمل" },
                  { en: "TRANSIT", ar: "ترانمرور" },
                  { en: "VISIT", ar: "زيارة" },
                  { en: "UMRAH", ar: "عمرة" },
                  { en: "RESIDENCE", ar: "إقامة" },
                  { en: "HAJJ", ar: "حج" },
                  { en: "DIPLOMACY", ar: "دبلوماسية" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-green-700 p-2 flex flex-col justify-center text-center"
                  >
                    <span className="text-xs">{item.ar}</span>
                    <span>{item.en}</span>
                  </div>
                ))}
              </div>

              {/* Right Arabic label */}
              <span className="whitespace-nowrap ml-2">:غرض السفر</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF ISSUE */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF ISSUE:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="12/09/2022"
                  value={candidate?.dateOfIssue || ""}
                  onChange={(e) =>
                    setCandidateField("dateOfIssue", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ الإصدار:
              </div>
            </div>

            {/* PASSPORT NO */}
            <div className="flex items-center">
              <div className="w-1/3 font-semibold p-2">PASSPORT NO:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="GW123456789"
                  value={candidate?.passport || ""}
                  onChange={(e) =>
                    setCandidateField("passport", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                رقم جوازالسفر:
              </div>
            </div>
          </div>

          {/* Date of Expiry & Place of Issue */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF EXPIRY */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF EXPIRY:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="24/05/2028"
                  value={
                    candidate?.passportExpiryDate
                      ? formatDisplayDate(candidate.passportExpiryDate)
                      : candidate?.passportExpiryDate || ""
                  }
                  onChange={(e) =>
                    setCandidateField("passportExpiryDate", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ الإنتھاء:{" "}
              </div>
            </div>

            {/* PLACE OF ISSUE */}
            <div className="flex items-center">
              <div className="w-1/3 font-semibold p-2">PLACE OF ISSUE:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="PAKISTAN"
                  value={candidate?.placeOfIssue || ""}
                  onChange={(e) =>
                    setCandidateField("placeOfIssue", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                محل الإصدار:
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF ARRIVAL */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF ARRIVAL:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder=""
                  value={candidate?.dateOfArrival || ""}
                  onChange={(e) =>
                    setCandidateField("dateOfArrival", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ الوصول:{" "}
              </div>
            </div>

            {/* DATE OF DEPARTURE */}
            <div className="flex items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF DEPARTURE:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder=""
                  value={candidate?.dateOfDeparture || ""}
                  onChange={(e) =>
                    setCandidateField("dateOfDeparture", e.target.value)
                  }
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ المغادرة:
              </div>
            </div>
          </div>

          {/* Duration of Stay in the Kingdom */}
          <div className="flex border-b border-green-700 items-center">
            <div className="w-2/3 font-semibold p-2">
              DURATION OF STAY IN THE KINGDOM:
            </div>
            <div className="w-1/3 p-2">
              <input
                type="text"
                placeholder="2 YEARS"
                value={candidate?.duration || ""}
                onChange={(e) => setCandidateField("duration", e.target.value)}
                className="bg-transparent outline-none text-center w-full placeholder-black"
              />
            </div>
            <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
              مدة الإقامة بالمملكة:
            </div>
          </div>

          {/* Payment Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-6 border-b border-green-700 text-right">
            {/* Date */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                value={candidate?.paymentDate || ""}
                onChange={(e) =>
                  setCandidateField("paymentDate", e.target.value)
                }
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:تاريخ</div>
                <div className="font-semibold">DATE</div>
              </div>
            </div>

            {/* Slip No */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder=""
                  value={candidate?.slipNo || ""}
                  onChange={(e) => setCandidateField("slipNo", e.target.value)}
                  className="bg-transparent outline-none text-left w-1/2 placeholder-black"
                />
                <button className="text-white px-2 py-1 bg-green-600 rounded-md no-print">
                  <FaEye size={14} />
                </button>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm">:ايصال رقم</div>
                <div className="font-semibold">SLIP NO</div>
              </div>
            </div>

            {/* Cheque No */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                value={candidate?.chequeNo || ""}
                onChange={(e) => setCandidateField("chequeNo", e.target.value)}
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:بیشيك رقم</div>
                <div className="font-semibold">CHEQUE NO</div>
              </div>
            </div>

            {/* Cash */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                value={candidate?.cash || ""}
                onChange={(e) => setCandidateField("cash", e.target.value)}
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:نقدا</div>
                <div className="font-semibold">CASH</div>
              </div>
            </div>

            {/* Free */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                value={candidate?.free || ""}
                onChange={(e) => setCandidateField("free", e.target.value)}
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:مجاملة</div>
                <div className="font-semibold">FREE</div>
              </div>
            </div>

            {/* Mode of Payment */}
            <div className="border-green-700 p-2 flex items-center justify-between">
              <div className="flex flex-col items-end">
                <div className="text-sm">:طريق الدفع</div>
                <div className="font-semibold">MODE OF PAYMENT</div>
              </div>
            </div>
          </div>

          {/* Relationship Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* First Column - Relationship */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="font-semibold">RELATIONSHIP:</span>
              </div>

              <input
                type="text"
                className="bg-transparent outline-none  w-40 text-center"
                placeholder=""
                value={candidate?.relationship || ""}
                onChange={(e) =>
                  setCandidateField("relationship", e.target.value)
                }
              />

              <div className="flex flex-col items-end">
                <span className="text-sm">:صلة</span>
              </div>
            </div>

            {/* Second Column - Arabic Only */}
            <div className="p-2 text-right">
              <div className="text-sm">:اسم المحرم</div>
            </div>
          </div>

          {/* Destination & Carrier's Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* First Column - Destination */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">DESTINATION:</span>
                <input
                  type="text"
                  placeholder="AL RIYADH, KYC"
                  value={candidate?.destination || ""}
                  onChange={(e) =>
                    setCandidateField("destination", e.target.value)
                  }
                  className="bg-transparent outline-none placeholder-black px-1 py-[2px] text-sm"
                />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm">:جهة الوصول</span>
              </div>
            </div>

            {/* Second Column - Carrier's Name */}
            <div className="p-2 flex justify-between items-center">
              <div className="font-semibold">CARRIER'S NAME:</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={candidate?.carrierName || ""}
                  onChange={(e) =>
                    setCandidateField("carrierName", e.target.value)
                  }
                  placeholder="Carrier name"
                  className="bg-transparent outline-none text-right px-2"
                />
                <div className="flex flex-col items-end">
                  <span className="text-sm">:اسم الشركة الناقلة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dependents Traveling Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* First Column - English text on left */}
            <div className="border-r border-green-700 p-2 flex items-center justify-start">
              <span className="font-semibold">
                DEPENDENTS TRAVELING IN THE SAME PASSPORT
              </span>
            </div>

            {/* Second Column - Arabic text on left */}
            <div className="p-2 flex items-center justify-start">
              <span className="text-sm">
                إيضاحات تخص أفراد العائلة (المضافين) علي نفس جوازالسفر
              </span>
            </div>
          </div>
          {/* Relationship, Date of Birth, Sex, Full Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-green-700">
            {/* Column 1 - Relationship */}
            <div className="border-r border-green-700 p-2 flex justify-between items-center">
              <span className="font-semibold">RELATIONSHIP</span>
              <span className="text-sm">نوع الصلة</span>
            </div>

            {/* Column 2 - Date of Birth */}
            <div className="border-r border-green-700 p-2 flex justify-between items-center">
              <span className="font-semibold">DATE OF BIRTH</span>
              <span className="text-sm">تاريخ الولادة</span>
            </div>

            {/* Column 3 - Sex */}
            <div className="border-r border-green-700 p-2 flex justify-between items-center">
              <span className="font-semibold">SEX</span>
              <span className="text-sm">الجنس</span>
            </div>

            {/* Column 4 - Full Name */}
            <div className="p-2 flex justify-between items-center">
              <span className="font-semibold">FULL NAME</span>
              <span className="text-sm">الاسم الكامل</span>
            </div>
          </div>
          {/* Empty 4-column Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-green-700">
            {/* Column 1 */}
            <div className="border-r border-green-700 ">
              <input
                type="text"
                className="w-full bg-transparent outline-none  px-1 "
                placeholder=""
                value={candidate?.dependentCol1 || ""}
                onChange={(e) =>
                  setCandidateField("dependentCol1", e.target.value)
                }
              />
            </div>

            {/* Column 2 */}
            <div className="border-r border-green-700 ">
              <input
                type="text"
                className="w-full bg-transparent outline-none px-2 "
                placeholder=""
                value={candidate?.dependentCol2 || ""}
                onChange={(e) =>
                  setCandidateField("dependentCol2", e.target.value)
                }
              />
            </div>

            {/* Column 3 */}
            <div className="border-r border-green-700 ">
              <input
                type="text"
                className="w-full bg-transparent outline-none  px-2 "
                placeholder=""
                value={candidate?.dependentCol3 || ""}
                onChange={(e) =>
                  setCandidateField("dependentCol3", e.target.value)
                }
              />
            </div>

            {/* Column 4 */}
            <div className="p-3">
              <input
                type="text"
                className="w-full bg-transparent outline-none  px-2"
                placeholder=""
                value={candidate?.dependentCol4 || ""}
                onChange={(e) =>
                  setCandidateField("dependentCol4", e.target.value)
                }
              />
            </div>
          </div>

          {/* Name and Address of Company/Individual Row */}
          <div className="border-b border-green-700 p-2 flex justify-between items-center">
            <span className="font-semibold">
              Name and Address of Company/Individual in the Kingdom
            </span>
            <span className="text-right font-semibold">
              شركة جنى للخدمات البحرية شركة الشخص الواحد
            </span>
          </div>
          {/* Empty Row */}
          <div className="p-3 border-b border-green-700">
            <input
              type="text"
              className="w-full bg-transparent outline-none "
              placeholder=""
              value={candidate?.companyAddress || ""}
              onChange={(e) =>
                setCandidateField("companyAddress", e.target.value)
              }
            />
          </div>

          {/* Declaration Row */}
          <div className="flex border-b border-green-700">
            {/* English Text */}
            <div className="w-2/3 p-2">
              <span className="text-sm font-medium">
                The undersigned hereby clarify that all the information I have
                provided are correct. I'll abide by the laws of the Kingdom
                during the period of my residence in it.
              </span>
            </div>

            {/* Arabic Placeholder */}
            <div className="w-1/3 p-2 text-sm font-medium text-right">
              ناالموقع ادناه اقربان كل المعلومات اللتي دونتها صحيصة وساكون
              ملتزمابقوانين المملكة اثناء فترة وجودي بها
            </div>
          </div>
          {/* Signature Row */}
          <div className="flex border-b border-green-700">
            {/* Date Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder=""
                  value={candidate?.signatureDate || ""}
                  onChange={(e) =>
                    setCandidateField("signatureDate", e.target.value)
                  }
                  className="bg-transparent outline-none px-2 py-1 w-24"
                />
                <button className="text-white px-2 py-1 bg-green-600 rounded-md no-print">
                  <FaEye size={14} />
                </button>
              </div>
              <div className="flex flex-col text-right text-sm">
                <div>:التاريخ</div>
                <div className="font-medium">Date:</div>
              </div>
            </div>

            {/* Signature Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                value={candidate?.signature || ""}
                onChange={(e) => setCandidateField("signature", e.target.value)}
                className="bg-transparent outline-none px-2 py-1 w-24"
              />
              <div className="flex flex-col text-right text-sm">
                <div>:التوقيع</div>
                <div className="font-medium">Signature:</div>
              </div>
            </div>

            {/* Name Column */}
            <div className="w-1/3 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder="Wajahat Malik"
                className="bg-transparent outline-none placeholder-black px-2 py-1 w-40 text-right"
                value={candidate?.signatureName || candidate?.name || ""}
                onChange={(e) =>
                  setCandidateField("signatureName", e.target.value)
                }
              />
              <div className="flex flex-col text-right text-sm">
                <div>:الإسم</div>
                <div className="font-medium">Name:</div>
              </div>
            </div>
          </div>

          {/* Office Use Only Row */}
          <div className="bg-gray-400 border-b border-green-700  p-2">
            <div className="flex flex-col items-center">
              للإستعمال الرسمي فقط
              <div className="text-sm">{/* Arabic text placeholder */}</div>
              {/* English text below */}
              <div className="text-sm font-medium">For Office Use Only</div>
            </div>
          </div>
          {/* Date & Authorization Row */}
          <div className="flex border-b border-green-700">
            {/* First Column - Date */}
            <div className="w-1/2 border-r border-green-700 p-2 flex items-center justify-between">
              <div className="text-sm font-medium">Date</div>
              <input
                type="text"
                placeholder=""
                value={candidate?.authorizationDate || ""}
                onChange={(e) =>
                  setCandidateField("authorizationDate", e.target.value)
                }
                className="bg-transparent outline-none px-2 py-1 w-40 mx-2"
              />
              <div className="text-sm">:تاريخه</div>
            </div>

            {/* Second Column - Authorization */}
            <div className="w-1/2 p-2 flex items-center justify-between">
              <div className="text-sm font-medium">Authorization</div>
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none px-2 py-1 w-40 mx-2"
              />
              <div className="text-sm">
                :رقم الامر المعتمد عليه في اعطاء التاشيرة
              </div>
            </div>
          </div>

          {/* Visit/Work For Row */}
          <div className="flex border-b border-green-700">
            {/* First Column - Small Width */}
            <div className="w-1/6 border-r border-green-700 p-2 flex flex-col items-start">
              <div className="text-sm font-medium">Visit/Work For</div>
            </div>

            {/* Middle Column - Input Field */}
            <div className="w-4/6 border-r border-green-700 p-2 flex items-center">
              <input
                type="text"
                className="w-full bg-transparent outline-none px-2 py-1"
                placeholder=""
                value={candidate?.visitFor || ""}
                onChange={(e) => setCandidateField("visitFor", e.target.value)}
              />
            </div>

            {/* Third Column - Small Width */}
            <div className="w-1/6 p-2 flex flex-col items-start">
              <div className="text-sm">:لزيارة - العمل لدي</div>
            </div>
          </div>

          {/* Date & Visa Number Row */}
          <div className="flex border-b border-green-700">
            {/* Date Column */}
            <div className="w-1/2 border-r border-green-700 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Date:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                value={candidate?.visaFormDate || ""}
                onChange={(e) =>
                  setCandidateField("visaFormDate", e.target.value)
                }
                style={{ border: "none" }}
              />
              <span className="text-sm">:وتاريخ</span>
            </div>

            {/* Visa Number Column */}
            <div className="w-1/2 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Visa Number:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                value={candidate?.visaNo || ""}
                onChange={(e) => setCandidateField("visaNo", e.target.value)}
                style={{ border: "none" }}
              />
              <span className="text-sm">:شرله برقم</span>
            </div>
          </div>

          {/* Fee Collected, Type & Duration Row */}
          <div className="flex border-b border-green-700">
            {/* Fee Collected Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Fee Collected:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                value={candidate?.feeCollected || ""}
                onChange={(e) =>
                  setCandidateField("feeCollected", e.target.value)
                }
                style={{ border: "none" }}
              />
              <span className="text-sm">:المبلغ المحصل</span>
            </div>

            {/* Type Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Type:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                value={candidate?.feeType || ""}
                onChange={(e) => setCandidateField("feeType", e.target.value)}
                style={{ border: "none" }}
              />
              <span className="text-sm">:نوعها</span>
            </div>

            {/* Duration Column */}
            <div className="w-1/3 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Duration:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                value={candidate?.feeDuration || ""}
                onChange={(e) =>
                  setCandidateField("feeDuration", e.target.value)
                }
                style={{ border: "none" }}
              />
              <span className="text-sm">:مدتها</span>
            </div>
          </div>

          {/* Head of Consular Section & Checked By Row */}
          <div className="flex border-b border-green-700 h-20">
            {/* Head of Consular Section Column */}
            <div className="w-1/2 border-r border-green-700 flex flex-col items-center justify-center">
              <span className="text-sm">رئيس القسم القنصلي</span>
              <span className="text-sm font-medium">
                Head of Consular Section
              </span>
            </div>

            {/* Checked By Column */}
            <div className="w-1/2 flex flex-col items-center justify-center">
              <span className="text-sm">مدقق البيانات</span>
              <span className="text-sm font-medium">Checked By</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaForm;
