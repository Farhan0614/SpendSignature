import { useState, useEffect, useRef } from "react";
import CountrySelector from "./CountrySelector";
import LoaderMini from "../../ui/LoaderMini";
import { HiCamera } from "react-icons/hi2";
import countryToCurrency from "country-to-currency";

import { useUser } from "../authentication/useUser";
import { useUpdateUser } from "../authentication/useUpdateUser";
import { useProfile } from "./useProfile";
import { useCurrency } from "../../context/CurrencyContext";
import { useUpdateProfile } from "./useUpdateProfile";

function UpdateOptions() {
  const { user } = useUser();
  const { profile } = useProfile();

  // GLOBAL STATE: We read this ONLY to set the initial value
  const { country: globalCountry, currency: globalCurrency } = useCurrency();

  // Mutations
  const { updateUser, isUpdating: isUpdatingAuth } = useUpdateUser();
  const { updateProfile, isUpdating: isUpdatingProfile } = useUpdateProfile();

  // --- LOCAL STATE ---
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);

  // New: Local state for the dropdown. This is isolated from the rest of the app until saved.
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef(null);
  const isWorking = isUpdatingAuth || isUpdatingProfile;

  // 1. SYNC STATE: Load initial data from Profile & Global Context
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }

    if (globalCountry) setSelectedCountry(globalCountry);
    if (globalCurrency) setSelectedCurrency(globalCurrency);
  }, [profile, globalCountry, globalCurrency]);

  // 2. DETECT CHANGES
  const isNameChanged = (fullName || "") !== (profile?.full_name || "");
  // Compare LOCAL currency selection vs DATABASE currency
  const isCurrencyChanged = selectedCurrency !== (profile?.currency || "USD");
  const isAvatarChanged = avatar !== null;

  const isModified = isNameChanged || isCurrencyChanged || isAvatarChanged;

  // --- HANDLERS ---

  function handleCountryChange(val) {
    // 1. Update the dropdown UI
    setSelectedCountry(val);

    // 2. Calculate the new currency code
    const newCurrencyCode = countryToCurrency[val.value] || "USD";

    // 3. Update the Preview Text (Local State)
    setSelectedCurrency(newCurrencyCode);

    // NOTE: We do NOT call setCurrency() from context here.
    // That ensures the rest of the app stays the same until we save.
  }

  function handleAvatarClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  }

  function handleProfileUpdate() {
    if (!isModified) return;

    updateProfile(
      {
        id: user.id,
        full_name: fullName,
        currency: selectedCurrency, // Send the NEW local currency
        avatarFile: avatar,
        old_avatar_url: profile?.avatar_url,
      },
      {
        onSuccess: () => setAvatar(null),
      },
    );
  }

  function handlePasswordUpdate(e) {
    e.preventDefault();
    if (!password) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    updateUser(
      { password },
      {
        onSuccess: () => {
          setPassword("");
          setConfirmPassword("");
        },
      },
    );
  }

  // Helper for Avatar Preview
  const avatarPreview = avatar
    ? URL.createObjectURL(avatar)
    : profile?.avatar_url || "/default-user.jpg";

  return (
    <div className="space-y-8">
      {/* ==============================
          1. IDENTITY SECTION
      =============================== */}
      <div className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <h2 className="mb-6 text-lg font-bold text-slate-800">
          Profile Details
        </h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* AVATAR AREA */}
          <div className="group relative">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-24 w-24 rounded-full border-4 border-slate-50 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
            />

            <button
              onClick={handleAvatarClick}
              disabled={isWorking}
              className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-all hover:scale-110 hover:bg-indigo-700 active:scale-95"
              title="Change Photo"
            >
              <HiCamera className="h-4 w-4" />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* NAME INPUT */}
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-semibold text-slate-600">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              placeholder={user?.email?.split("@")[0]}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isWorking}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ==============================
          2. REGION SECTION
      =============================== */}
      <div className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Currency & Region
        </h2>
        <div className="max-w-xs">
          <CountrySelector
            value={selectedCountry}
            onChange={handleCountryChange}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Selected Currency:{" "}
          <span className="font-bold text-slate-600">{selectedCurrency}</span>.
          Click save to apply changes.
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleProfileUpdate}
        disabled={!isModified || isWorking}
        className={`flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all duration-300 ${
          !isModified || isWorking
            ? "cursor-not-allowed bg-slate-200 text-slate-400"
            : "cursor-pointer bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
        }`}
      >
        {isWorking ? <LoaderMini /> : "Save Profile Changes"}
      </button>

      {/* ==============================
          3. PASSWORD SECTION
      =============================== */}
      <form
        onSubmit={handlePasswordUpdate}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
      >
        <h2 className="mb-6 text-lg font-bold text-slate-800">Security</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-600">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-600">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!password || isWorking}
            className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
              !password
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-slate-900 text-white shadow-lg hover:bg-slate-800 hover:shadow-xl active:scale-95"
            }`}
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateOptions;
