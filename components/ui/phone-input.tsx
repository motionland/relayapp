"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateLoginState } from "@/redux/feature/authentication";

const countryCodes = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
];

export default function PhoneInput() {
  const loginState = useAppSelector((state) => state.login.loginState);
  const dispatch = useAppDispatch();
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (loginState.phone) {
      setPhoneNumber(loginState.phone);
    }
    if (loginState.countryCode) {
      const country =
        countryCodes.find((c) => c.code === loginState.countryCode) ||
        countryCodes[0];
      setSelectedCountry(country);
    }
  }, [loginState.phone, loginState.countryCode]);

  const isFloating = isFocused || phoneNumber.length > 0;

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    dispatch(updateLoginState({ key: "phone", value }));
  };

  const handleCountryChange = (country: (typeof countryCodes)[0]) => {
    setSelectedCountry(country);
    dispatch(updateLoginState({ key: "countryCode", value: country.code }));
  };

  return (
    <div className="space-y-1.5">
      <label
        htmlFor="phone"
        className={`block text-sm transition-all duration-150 ${
          isFloating ? "text-black" : "text-gray-500"
        }`}
      >
        Mobile number
      </label>
      <div
        className={`flex w-full rounded-[16px] overflow-hidden border transition-all duration-150 ${
          isFloating ? "border-black border-2" : "border-gray-300 border"
        }`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-12 px-3 py-2 flex items-center gap-2 rounded-l-[16px] border-r border-gray-200 bg-white hover:bg-gray-50 z-20"
            >
              <span className="text-base text-black">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-black">
                {selectedCountry.code}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            {countryCodes.map((country) => (
              <DropdownMenuItem
                key={country.name}
                onClick={() => handleCountryChange(country)}
                className="flex items-center gap-2 py-2.5"
              >
                <span className="text-base">{country.flag}</span>
                <span>{country.name}</span>
                <span className="text-muted-foreground ml-auto">
                  {country.code}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="text-black flex-1 h-12 px-4 border-0 focus:ring-0 focus:outline-none rounded-r-[16px] bg-transparent"
          aria-label="Phone number"
        />
      </div>
    </div>
  );
}
