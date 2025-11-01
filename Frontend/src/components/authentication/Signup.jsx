
import React, { useState, useRef } from "react";

/* ---------- Reusable Input Components ---------- */
function InputField({ label, id, type = "text", value, onChange, required = false, placeholder = "", className = "" }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm ${className}`}
      />
    </label>
  );
}

function TextAreaField({ label, id, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
      />
    </label>
  );
}

/* ---------- Main Signup Page Component ---------- */
export default function Signup() {
  const [role, setRole] = useState("doctor"); // 'doctor' | 'patient'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  /* Doctor form state */
  const [doctor, setDoctor] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    address: "",
    profilePic: null, // File
    profilePicPreview: null, // Data URL
    licenseNo: "",
    issuingCouncil: "",
    specialization: "",
    degrees: "",
    university: "",
    graduationYear: "",
    yearsExperience: "",
    hospitalAffiliation: "",
    hospitalAddress: "",
    consultationFee: "",
  });

  /* Patient form state */
  const [patient, setPatient] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    pronouns: "",
    address: "",
    hpi: "",
    currentMedications: "",
    allergies: "",
    password: "",
  });

  /* ---------- Helpers ---------- */
  const handleDoctorChange = (field) => (e) => {
    const value = e.target.value;
    setDoctor((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientChange = (field) => (e) => {
    const value = e.target.value;
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (p) => /^[0-9]{7,15}$/.test(p.replace(/\D/g, ""));

  const validateDoctor = () => {
    const err = {};
    if (!doctor.fullName.trim()) err.fullName = "Full name is required";
    if (!validateEmail(doctor.email)) err.email = "Valid email required";
    if (!validatePhone(doctor.phone)) err.phone = "Valid phone number required (digits only)";
    if (!doctor.password || doctor.password.length < 6) err.password = "Password must be 6+ chars";
    if (!doctor.licenseNo.trim()) err.licenseNo = "License number required";
    if (!doctor.specialization.trim()) err.specialization = "Specialization required";
    if (!doctor.degrees.trim()) err.degrees = "Degree(s) required";
    // consultation fee optional but if set must be number
    if (doctor.consultationFee && isNaN(Number(doctor.consultationFee))) err.consultationFee = "Enter a valid fee";
    return err;
  };

  const validatePatient = () => {
    const err = {};
    if (!patient.fullName.trim()) err.fullName = "Full name is required";
    if (!validateEmail(patient.email)) err.email = "Valid email required";
    if (!validatePhone(patient.phone)) err.phone = "Valid phone number required (digits only)";
    if (!patient.password || patient.password.length < 6) err.password = "Password must be 6+ chars";
    return err;
  };

  /* ---------- File handling (profile pic) ---------- */
  const handleDoctorPic = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setDoctor((prev) => ({ ...prev, profilePic: null, profilePicPreview: null }));
      return;
    }
    setDoctor((prev) => ({ ...prev, profilePic: file }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDoctor((prev) => ({ ...prev, profilePicPreview: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  /* ---------- Submit handlers (currently console.log) ---------- */
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const err = validateDoctor();
    if (Object.keys(err).length) {
      setErrors(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLoading(true);
    try {
      // Prepare payload. Replace this with your API integration.
      const payload = { ...doctor };
      // If you will upload using Cloudinary or your API, send the file accordingly.
      console.log("Doctor sign-up payload", payload);
      // Example: await api.post('/auth/register/doctor', formData)
      alert("Doctor form validated. Replace console.log with API call.");
    } catch (error) {
      console.error(error);
      alert("Server error (replace with API).");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const err = validatePatient();
    if (Object.keys(err).length) {
      setErrors(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLoading(true);
    try {
      const payload = { ...patient };
      console.log("Patient sign-up payload", payload);
      alert("Patient form validated. Replace console.log with API call.");
    } catch (error) {
      console.error(error);
      alert("Server error (replace with API).");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Small UI helpers ---------- */
  const TabButton = ({ label, activeRole, onClick }) => (
    <button
      onClick={onClick}
      className={`flex-1 text-sm font-medium py-2 rounded-md transition ${
        role === activeRole ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-700 border border-gray-200"
      }`}
      aria-pressed={role === activeRole}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header / branding */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome to <span className="text-blue-600">WeCare</span></h1>
          <p className="text-sm text-gray-600 mt-1">Create your account — choose Doctor or Patient</p>
        </div>

        {/* Tab toggle */}
        <div className="bg-gray-100 rounded-lg p-1 mb-6">
          <div className="flex gap-1">
            <TabButton label="Doctor" activeRole="doctor" onClick={() => setRole("doctor")} />
            <TabButton label="Patient" activeRole="patient" onClick={() => setRole("patient")} />
          </div>
        </div>

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Please fix the highlighted fields before submitting.
          </div>
        )}

        {/* Forms container */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          {role === "doctor" ? (
            <form onSubmit={handleDoctorSubmit}>
              {/* Grid layout: 1-col mobile, 2-col md */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <InputField
                    label="Full Legal Name (Title included)"
                    id="doctor-fullname"
                    value={doctor.fullName}
                    onChange={handleDoctorChange("fullName")}
                    required
                    placeholder="Dr. Rahul Sharma"
                  />
                  {errors.fullName && <div className="text-xs text-red-600 mt-1">{errors.fullName}</div>}
                </div>

                <div>
                  <InputField label="Email Address" id="doctor-email" type="email" value={doctor.email} onChange={handleDoctorChange("email")} required placeholder="you@example.com" />
                  {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
                </div>

                <div>
                  <InputField label="Mobile Phone Number" id="doctor-phone" value={doctor.phone} onChange={handleDoctorChange("phone")} required placeholder="98765xxxxx" />
                  {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
                </div>

                <div>
                  <InputField label="Password" id="doctor-password" type="password" value={doctor.password} onChange={handleDoctorChange("password")} required placeholder="Min 6 characters" />
                  {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
                </div>

                <div>
                  <InputField label="Date of Birth" id="doctor-dob" type="date" value={doctor.dob} onChange={handleDoctorChange("dob")} />
                </div>

                <div>
                  <InputField label="Current Address" id="doctor-address" value={doctor.address} onChange={handleDoctorChange("address")} placeholder="City, State, Country" />
                </div>

                {/* Profile picture upload */}
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Profile Picture</span>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-24 h-24 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {doctor.profilePicPreview ? (
                          <img src={doctor.profilePicPreview} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500">No image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleDoctorPic} className="text-sm" />
                        <p className="text-xs text-gray-500 mt-1">Upload a professional headshot (jpg, png). Max 5MB recommended.</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Medical credentials */}
                <div>
                  <InputField label="Medical Registration Number (License No.)" id="doctor-license" value={doctor.licenseNo} onChange={handleDoctorChange("licenseNo")} required />
                  {errors.licenseNo && <div className="text-xs text-red-600 mt-1">{errors.licenseNo}</div>}
                </div>

                <div>
                  <InputField label="Issuing Council / Authority" id="doctor-council" value={doctor.issuingCouncil} onChange={handleDoctorChange("issuingCouncil")} placeholder="e.g., Maharashtra Medical Council" />
                </div>

                <div>
                  <InputField label="Primary Specialization" id="doctor-specialization" value={doctor.specialization} onChange={handleDoctorChange("specialization")} required placeholder="Pediatrics, Cardiology..." />
                  {errors.specialization && <div className="text-xs text-red-600 mt-1">{errors.specialization}</div>}
                </div>

                <div>
                  <InputField label="Medical Degree(s)" id="doctor-degrees" value={doctor.degrees} onChange={handleDoctorChange("degrees")} required placeholder="MBBS, MD" />
                  {errors.degrees && <div className="text-xs text-red-600 mt-1">{errors.degrees}</div>}
                </div>

                <div>
                  <InputField label="University / Institution" id="doctor-university" value={doctor.university} onChange={handleDoctorChange("university")} placeholder="Name of college/university" />
                </div>

                <div>
                  <InputField label="Year of Graduation" id="doctor-gradyear" value={doctor.graduationYear} onChange={handleDoctorChange("graduationYear")} placeholder="e.g., 2015" />
                </div>

                <div>
                  <InputField label="Years of Experience" id="doctor-exp" value={doctor.yearsExperience} onChange={handleDoctorChange("yearsExperience")} placeholder="e.g., 6" />
                </div>

                <div>
                  <InputField label="Hospital / Clinic Affiliation (Name)" id="doctor-hospital" value={doctor.hospitalAffiliation} onChange={handleDoctorChange("hospitalAffiliation")} placeholder="Primary practice name" />
                </div>

                <div>
                  <InputField label="Hospital / Clinic Address" id="doctor-hospital-address" value={doctor.hospitalAddress} onChange={handleDoctorChange("hospitalAddress")} placeholder="Address of practice" />
                </div>

                <div className="md:col-span-2">
                  <InputField label="Consultation Fee (optional)" id="doctor-fee" value={doctor.consultationFee} onChange={handleDoctorChange("consultationFee")} placeholder="e.g., 500" />
                  {errors.consultationFee && <div className="text-xs text-red-600 mt-1">{errors.consultationFee}</div>}
                </div>
              </div>

              {/* Submit */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="text-sm text-gray-500">Already have an account? <button type="button" className="text-blue-600 font-medium">Login</button></div>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                  {loading ? "Submitting..." : "Create Doctor Account"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePatientSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <InputField label="Full Legal Name" id="patient-fullname" value={patient.fullName} onChange={handlePatientChange("fullName")} required placeholder="First Middle Last" />
                  {errors.fullName && <div className="text-xs text-red-600 mt-1">{errors.fullName}</div>}
                </div>

                <div>
                  <InputField label="Email Address" id="patient-email" type="email" value={patient.email} onChange={handlePatientChange("email")} required placeholder="you@example.com" />
                  {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
                </div>

                <div>
                  <InputField label="Mobile Phone Number" id="patient-phone" value={patient.phone} onChange={handlePatientChange("phone")} required placeholder="98765xxxxx" />
                  {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
                </div>

                <div>
                  <InputField label="Password" id="patient-password" type="password" value={patient.password} onChange={handlePatientChange("password")} required placeholder="Min 6 characters" />
                  {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
                </div>

                <div>
                  <InputField label="Date of Birth" id="patient-dob" type="date" value={patient.dob} onChange={handlePatientChange("dob")} />
                </div>

                <div>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Gender / Pronouns</span>
                    <select value={patient.gender || ""} onChange={handlePatientChange("gender")} className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                <div>
                  <InputField label="Residential Address" id="patient-address" value={patient.address} onChange={handlePatientChange("address")} placeholder="City, State, Country" />
                </div>

                <div className="md:col-span-2">
                  <TextAreaField label="History of Present Illness (HPI)" id="patient-hpi" value={patient.hpi} onChange={handlePatientChange("hpi")} placeholder="Describe current symptoms, onset, severity" rows={4} />
                </div>

                <div className="md:col-span-2">
                  <TextAreaField label="Current Medications (name, dose, frequency)" id="patient-meds" value={patient.currentMedications} onChange={handlePatientChange("currentMedications")} placeholder="E.g., Metformin 500mg twice daily" rows={3} />
                </div>

                <div className="md:col-span-2">
                  <TextAreaField label="Allergies" id="patient-allergies" value={patient.allergies} onChange={handlePatientChange("allergies")} placeholder="Drug, food, environmental allergies" rows={2} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="text-sm text-gray-500">Are you a doctor? <button onClick={() => setRole("doctor")} type="button" className="text-blue-600 font-medium">Switch to Doctor signup</button></div>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                  {loading ? "Submitting..." : "Create Patient Account"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
