import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfile(null);
      setImageBaseUrl("");
      return;
    }

    setIsLoading(true);
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_WEBSITE_USERS}/view-profile`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.data?._status === true) {
        setProfile(result.data._data ?? null);
        setImageBaseUrl(result.data._image_path ?? "");
      } else {
        setProfile(null);
        setImageBaseUrl("");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const profileImageUrl = useMemo(() => {
    if (!imageBaseUrl || !profile?.image) return "";
    return `${imageBaseUrl}/${profile.image}`;
  }, [imageBaseUrl, profile]);

  const value = useMemo(
    () => ({
      profile,
      imageBaseUrl,
      profileImageUrl,
      isLoading,
      refreshProfile,
      setProfile,
      setImageBaseUrl,
    }),
    [profile, imageBaseUrl, profileImageUrl, isLoading, refreshProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

