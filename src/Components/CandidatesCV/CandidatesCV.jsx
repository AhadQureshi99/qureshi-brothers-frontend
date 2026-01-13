import React, { useState, useRef } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { IoIosArrowBack } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { BsPrinter } from "react-icons/bs";
const userImg = "/candidatescv_profile.png";
import { GoPaperclip } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";

const CandidatesCV = () => {
  // Form state
  const [form, setForm] = useState({});
  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const showToast = (message, type = "info", duration = 2500) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), duration);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Profile picture
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(userImg);
  const profileInputRef = useRef();

  // Overlay modal state
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayFiles, setOverlayFiles] = useState([]); // array of {name, type}

  const onProfileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setOverlayFiles([{ name: file.name, type: file.type }]);
    setOverlayOpen(true);
    try {
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
    } catch (err) {
      setProfilePreview(userImg);
    }
  };

  // Documents list
  const documentTitles = [
    "Waqala Papers",
    "Company’s Agreement",
    "Driving Lic.",
    "Degree’s copies",
    "Agency’s Undertaking",
    "Agency’s valid License copy",
    "Police character certificate",
    "FIR & Newspaper",
    "Degree’s copies (2)",
  ];

  // State for document uploads (the main documents list)
  const [docs, setDocs] = useState(() => documentTitles.map(() => null));
  const docFileInputRefs = useRef(documentTitles.map(() => React.createRef()));
  // Per-document done/passed toggles
  const [documentDone, setDocumentDone] = useState(() =>
    documentTitles.map(() => false)
  );
  const [documentPassed, setDocumentPassed] = useState(() =>
    documentTitles.map(() => false)
  );

  // Example processing steps state (Done / Passed)
  const exampleSteps = [
    "Medical Test",
    "NAVTTC Test",
    "POLICE CHARACTER CERTIFICATE.",
  ];
  const [stepsStatus, setStepsStatus] = useState(() =>
    exampleSteps.map(() => ({ done: false, passed: false }))
  );

  // Separate state for files attached to example steps (so titles don't mix)
  const [stepDocs, setStepDocs] = useState(() => exampleSteps.map(() => null));
  const stepFileInputRefs = useRef(exampleSteps.map(() => React.createRef()));

  const toggleStep = (index, field) => {
    setStepsStatus((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: !copy[index][field] };
      return copy;
    });
  };

  const attachDocFile = (index) => {
    const ref = docFileInputRefs.current[index];
    if (ref && ref.current) ref.current.click();
  };
  const attachStepFile = (index) => {
    const ref = stepFileInputRefs.current[index];
    if (ref && ref.current) ref.current.click();
  };

  const onDocChange = (index, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setDocs((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
    setOverlayFiles([{ name: file.name, type: file.type }]);
    setOverlayOpen(true);
  };

  const onStepDocChange = (index, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setStepDocs((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
    setOverlayFiles([{ name: file.name, type: file.type }]);
    setOverlayOpen(true);
  };

  // navigate to candidates page after successful save
  const navigate = useNavigate();

  const removeDoc = (index) => {
    setDocs((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
    // reset done/passed for that doc
    setDocumentDone((prev) => {
      const copy = [...prev];
      copy[index] = false;
      return copy;
    });
    setDocumentPassed((prev) => {
      const copy = [...prev];
      copy[index] = false;
      return copy;
    });
  };

  const removeStepDoc = (index) => {
    setStepDocs((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
  };

  const viewFile = (file) => {
    if (!file) {
      showToast("No file attached", "error");
      return;
    }
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();
    const hasFiles = profileFile || docs.some(Boolean);
    if (!hasFiles) {
      showToast("No files selected to upload", "error");
      return;
    }

    // CNIC validation: must be 13 digits, all numbers
    const cnic = form.cnic || "";
    if (!/^[0-9]{13}$/.test(cnic)) {
      showToast("CNIC must be exactly 13 digits (Pakistan format)", "error");
      return;
    }

    const formData = new FormData();
    if (profileFile) formData.append("profilePicture", profileFile);

    // Build ordered uploads list: stepDocs first (with titles from exampleSteps), then docs
    const uploadMeta = []; // array of { title, file, done, passed }

    // step docs
    stepDocs.forEach((f, i) => {
      if (f) {
        uploadMeta.push({
          title: `${exampleSteps[i]}-${f.name}`,
          file: f,
          done: stepsStatus[i]?.done || false,
          passed: stepsStatus[i]?.passed || false,
        });
      }
    });

    // main documents
    docs.forEach((f, i) => {
      if (f) {
        uploadMeta.push({
          title: `${documentTitles[i]}-${f.name}`,
          file: f,
          done: documentDone[i] || false,
          passed: documentPassed[i] || false,
        });
      }
    });

    // Append files and collect metadata arrays for backend
    const metadata = uploadMeta.map((m) => ({
      title: m.title,
      done: m.done,
      passed: m.passed,
    }));
    uploadMeta.forEach((m) => formData.append("documents", m.file, m.title));
    formData.append("documentsMeta", JSON.stringify(metadata));
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Add stepsStatus (done/passed for each step)
    stepsStatus.forEach((step, idx) => {
      formData.append(`step${idx}_done`, step.done);
      formData.append(`step${idx}_passed`, step.passed);
    });

    try {
      const token = localStorage.getItem("token");
      const apiUrl = "https://api.cloudandroots.com";
      const res = await fetch(apiUrl + "/api/candidates/", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || "Upload failed");
      }
      const data = await res.json();
      showToast("Candidate saved successfully", "success");
      setForm({});
      setDocs(documentTitles.map(() => null));
      setProfileFile(null);
      setProfilePreview(userImg);
      console.log("created candidate", data.candidate);
      // navigate to Candidate list and pass the created candidate so it shows immediately
      if (data && data.candidate) {
        navigate("/candidate", { state: { newCandidate: data.candidate } });
      }
    } catch (err) {
      console.error(err);
      showToast("Upload failed: " + (err.message || err), "error");
    }
  };
  // Toast component
  const Toast = ({ show, message, type }) => {
    if (!show) return null;
    let bg = "bg-gray-800";
    if (type === "error") bg = "bg-red-600";
    if (type === "success") bg = "bg-green-600";
    return (
      <div
        className={`fixed top-6 right-6 z-[100] px-4 py-2 rounded text-white shadow-lg ${bg} animate-fade-in`}
        style={{ minWidth: 180, maxWidth: 320 }}
      >
        {message}
      </div>
    );
  };

  // Overlay modal component
  const OverlayModal = ({ open, files, onClose }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 min-w-[260px] max-w-[90vw]">
          <h3 className="text-lg font-bold mb-4">File Uploaded</h3>
          <ul className="mb-4">
            {files.map((f, i) => (
              <li
                key={i}
                className="text-sm text-gray-800 truncate max-w-xs"
                title={f.name}
              >
                <span className="font-medium">{f.name}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      <OverlayModal
        open={overlayOpen}
        files={overlayFiles}
        onClose={() => setOverlayOpen(false)}
      />
      <div className="flex min-h-screen">
        <div className="w-[20%]">
          <Sidebar />
        </div>

        <div className="w-[80%] p-6 space-y-6">
          <div className="w-full">
            <div className="flex items-center">
              <IoIosArrowBack className="text-3xl text-black cursor-pointer mr-4" />
              <div className="flex-1">
                <div className="w-full bg-gray-300 h-3 rounded-full relative">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-700 mt-1">
              Progress Completed 30%
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-start justify-between"
          >
            <div className="w-[50%] space-y-4">
              <h2 className="text-xl font-bold text-black mb-4">
                Candidate Details
              </h2>

              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Father Name", name: "fatherName", type: "text" },
                { label: "Profession", name: "profession", type: "text" },
                { label: "Qualification", name: "qualification", type: "text" },
                { label: "Place of Birth", name: "placeOfBirth", type: "text" },
                { label: "CNIC No.", name: "cnic", type: "text" },
                { label: "Passport No.", name: "passport", type: "text" },
                { label: "Address", name: "address", type: "text" },
                { label: "City", name: "city", type: "text" },
                { label: "State", name: "state", type: "text" },
                { label: "Country", name: "country", type: "text" },
                {
                  label: "Contact No. (Residence)",
                  name: "contact",
                  type: "text",
                },
                {
                  label: "Marital Status",
                  name: "maritalStatus",
                  type: "text",
                },
                { label: "Salary", name: "salary", type: "text" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block mb-1">{f.label}:</label>
                  <input
                    name={f.name}
                    value={form[f.name] || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-green-200 rounded-md"
                    type={f.type}
                  />
                </div>
              ))}

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label>Gender:</label>
                  <select
                    name="gender"
                    value={form.gender || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-green-200 rounded-md"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label>Age:</label>
                  <input
                    name="age"
                    value={form.age || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-green-200 rounded-md"
                    type="number"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label>PP Issue Date:</label>
                  <input
                    name="ppIssue"
                    value={form.ppIssue || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-green-200 rounded-md"
                    type="date"
                  />
                </div>
                <div className="w-1/2">
                  <label>PP Expiry Date:</label>
                  <input
                    name="ppExpiry"
                    value={form.ppExpiry || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-green-200 rounded-md"
                    type="date"
                  />
                </div>
              </div>
            </div>

            <div className="w-[35%] flex flex-col items-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">CV # 01</h3>

              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onProfileChange}
              />
              <div className="flex flex-col items-center">
                <img
                  src={profilePreview}
                  alt="Candidate"
                  className="w-40 h-40 object-fill rounded-md border-2 border-blue-300 shadow-md mb-2"
                />
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2">
                    {profileFile ? profileFile.name : "No profile attached"}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() =>
                        profileInputRef.current &&
                        profileInputRef.current.click()
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Attach
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        profileFile
                          ? viewFile(profileFile)
                          : alert("No profile picture attached")
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileFile(null);
                        setProfilePreview(userImg);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-base font-medium text-black">CV Approved By</p>
              <h4 className="bg-green-200 px-10 text-center py-1 rounded text-black font-bold">
                Voco Hotel
              </h4>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                <BsPrinter />
                <span>Print</span>
              </button>

              <div className="space-y-4 w-full">
                {/* Visa Processing Steps removed as requested */}

                {/* Example steps with Done / Passed toggles + attach/view */}
                {exampleSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between space-x-2"
                  >
                    <span className="w-1/3">{step}</span>

                    <div className="text-center">
                      <p className="text-xs">Done</p>
                      <label className="inline-flex items-center cursor-pointer relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={stepsStatus[idx]?.done || false}
                          onChange={() => toggleStep(idx, "done")}
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition duration-300"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="text-center">
                      <p className="text-xs">Passed</p>
                      <label className="inline-flex items-center cursor-pointer relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={stepsStatus[idx]?.passed || false}
                          onChange={() => toggleStep(idx, "passed")}
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition duration-300"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => attachStepFile(idx)}
                        className="text-white px-3 py-2 bg-green-600 rounded-md"
                      >
                        <GoPaperclip size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => viewFile(stepDocs[idx])}
                        className="text-white px-3 py-2 bg-green-600 rounded-md"
                      >
                        <FaEye size={16} />
                      </button>
                      <div
                        className="text-xs text-gray-600 truncate max-w-[120px]"
                        title={stepDocs[idx]?.name}
                      >
                        {stepDocs[idx] ? stepDocs[idx].name : "No file"}
                      </div>
                      <input
                        ref={stepFileInputRefs.current[idx]}
                        type="file"
                        className="hidden"
                        onChange={(e) => onStepDocChange(idx, e)}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between space-x-4">
                  <div className="w-1/2">
                    <h5 className="font-semibold">Status</h5>
                    <select
                      name="status"
                      value={form.status || ""}
                      onChange={handleInputChange}
                      className="w-full bg-green-200 text-black p-2 rounded"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <h5 className="font-semibold">Receive Date</h5>
                    <input
                      name="receiveDate"
                      value={form.receiveDate || ""}
                      onChange={handleInputChange}
                      type="date"
                      className="w-full p-2 bg-green-200 text-black rounded"
                    />
                  </div>
                </div>

                {documentTitles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-md"
                  >
                    <h5 className="text-sm font-semibold text-gray-700">
                      {title}
                    </h5>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => attachDocFile(index)}
                        className="text-white px-3 py-2 bg-green-600 rounded-md"
                      >
                        <GoPaperclip size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => viewFile(docs[index])}
                        className="text-white px-3 py-2 bg-green-600 rounded-md"
                      >
                        <FaEye size={16} />
                      </button>
                      <div
                        className="text-xs text-gray-600 truncate max-w-[140px]"
                        title={docs[index]?.name}
                      >
                        {docs[index] ? docs[index].name : "No file"}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDoc(index)}
                        className="text-white px-3 py-2 bg-red-500 rounded-md"
                      >
                        Remove
                      </button>
                      <input
                        ref={docFileInputRefs.current[index]}
                        type="file"
                        className="hidden"
                        onChange={(e) => onDocChange(index, e)}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-center mt-4 gap-4">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded"
                  >
                    Save / Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({});
                      setDocs(documentTitles.map(() => null));
                      setProfileFile(null);
                      setProfilePreview(userImg);
                    }}
                    className="flex items-center space-x-2 bg-gray-400 text-black px-6 py-2 rounded"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidatesCV;
