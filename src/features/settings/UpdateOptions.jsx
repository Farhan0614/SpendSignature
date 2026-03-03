import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form"; // <-- IMPORT THIS
import CountrySelector from "./CountrySelector";
import LoaderMini from "../../ui/LoaderMini";
import { HiCamera } from "react-icons/hi2";
import countryToCurrency from "country-to-currency";
import toast from "react-hot-toast";

import { useUser } from "../authentication/useUser";
import { useUpdateUser } from "../authentication/useUpdateUser";
import { useProfile } from "./useProfile";
import { useCurrency } from "../../context/CurrencyContext";
import { useUpdateProfile } from "./useUpdateProfile";
import Logout from "./Logout";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

function UpdateOptions() {
  const { user } = useUser();
  const { profile } = useProfile();
  const { country: globalCountry, currency: globalCurrency } = useCurrency();

  const { updateUser, isUpdating: isUpdatingAuth } = useUpdateUser();
  const { updateProfile, isUpdating: isUpdatingProfile } = useUpdateProfile();

  // --- PROFILE STATE ---
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatar, setAvatar] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(globalCountry || null);
  const [selectedCurrency, setSelectedCurrency] = useState(
    globalCurrency || "USD",
  );

  const fileInputRef = useRef(null);
  const isWorking = isUpdatingAuth || isUpdatingProfile;

  // --- PASSWORD FORM SETUP ---
  const {
    register,
    handleSubmit,
    reset,
    getValues, // Used to check if passwords match
    formState: { errors, submitCount },
  } = useForm();

  // 1. SYNC PROFILE STATE
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
    if (globalCountry) setSelectedCountry(globalCountry);
    if (globalCurrency) setSelectedCurrency(globalCurrency);
  }, [profile, globalCountry, globalCurrency]);

  // 2. PASSWORD ERROR TOASTS
  useEffect(() => {
    if (submitCount > 0) {
      if (errors?.password?.message) {
        toast.error(errors.password.message, { id: "pass" });
      } else if (errors?.confirmPassword?.message) {
        toast.error(errors.confirmPassword.message, { id: "conf-pass" });
      }
    }
  }, [errors, submitCount]);

  // 3. DETECT PROFILE CHANGES
  const isNameChanged = (fullName || "") !== (profile?.full_name || "");
  const isCurrencyChanged = selectedCurrency !== (profile?.currency || "USD");
  const isAvatarChanged = avatar !== null;
  const isModified = isNameChanged || isCurrencyChanged || isAvatarChanged;

  const isFullNameValid = fullName.trim().length > 0;

  // --- HANDLERS ---
  function handleCountryChange(val) {
    setSelectedCountry(val);
    setSelectedCurrency(countryToCurrency[val.value] || "USD");
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
        currency: selectedCurrency,
        avatarFile: avatar,
        old_avatar_url: profile?.avatar_url,
      },
      { onSuccess: () => setAvatar(null) },
    );
  }

  // Hook Form handles the submit natively now!
  function onPasswordSubmit(data) {
    updateUser(
      { password: data.password },
      { onSuccess: () => reset() }, // Clears inputs automatically on success
    );
  }

  const avatarPreview = avatar
    ? URL.createObjectURL(avatar)
    : profile?.avatar_url || "/default-user.jpg";

  return (
    <div className="space-y-8">
      {/* ==============================
          1. IDENTITY SECTION
      =============================== */}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
        <h2 className="mb-6 text-lg font-bold text-slate-800 dark:text-white">
          Profile Details
        </h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* AVATAR AREA */}
          <div className="group relative">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-24 w-24 rounded-full border-4 border-slate-50 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-slate-800"
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
            <FormInput
              id="fullName"
              label="Full Name"
              type="text"
              value={fullName}
              placeholder={user?.email?.split("@")[0]}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isWorking}
              error={!isFullNameValid ? "Full Name cannot be empty" : ""}
            />
          </div>
        </div>
      </div>

      {/* ==============================
          2. REGION SECTION
      =============================== */}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
        <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">
          Currency & Region
        </h2>
        <div className="max-w-xs">
          <CountrySelector
            value={selectedCountry}
            onChange={handleCountryChange}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Selected Currency:{" "}
          <span className="font-bold text-slate-600 dark:text-slate-300">
            {selectedCurrency}
          </span>
          . Click save to apply changes.
        </p>
      </div>

      {/* Save Button */}
      <Button
        variant="primary"
        onClick={handleProfileUpdate}
        // UPDATE THE DISABLED PROP:
        disabled={!isModified || isWorking || !isFullNameValid}
        className="w-full py-3.5"
      >
        {isWorking ? <LoaderMini /> : "Save Profile Changes"}
      </Button>

      {/* ==============================
          3. PASSWORD SECTION (Now uses react-hook-form)
      =============================== */}
      <form
        onSubmit={handleSubmit(onPasswordSubmit)}
        noValidate
        className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50"
      >
        <h2 className="mb-6 text-lg font-bold text-slate-800 dark:text-white">
          Security
        </h2>

        <div className="space-y-4">
          <FormInput
            id="password"
            label="New Password"
            type="password"
            disabled={isWorking}
            register={register("password", {
              required: "Please enter a new password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            disabled={isWorking}
            register={register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => {
                const newPassword = getValues("password");
                // 1. Ensure the new password actually meets the length requirement first
                if (!newPassword || newPassword.length < 6) {
                  return "Please enter a valid New Password first";
                }
                // 2. Then check if they match
                return value === newPassword || "Passwords do not match";
              },
            })}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" disabled={isWorking}>
            {isWorking ? <LoaderMini /> : "Update Password"}
          </Button>
        </div>
      </form>

      <Logout />
    </div>
  );
}

export default UpdateOptions;
