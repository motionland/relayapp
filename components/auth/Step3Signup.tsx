"use client";

import FloatingInput from "../floating-input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateRegisterState } from "@/redux/feature/authentication";

const Step3Signup = () => {
  const registerState = useAppSelector((state) => state.register.registerState);
  const dispatch = useAppDispatch();

  const handleContinue = () => {
    dispatch(updateRegisterState({key: "registerStep", value: 4}));
  };

  return (
    <>
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-1 text-xs text-gray-500">
          <span>Step 3 of 4</span>
          <span>Set Full Name and Password</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>

      <div className="space-y-1 w-full max-w-md text-black">
        <h1 className="text-2xl font-semibold">Set Full Name and Password</h1>
        <p className="text-gray-600 text-sm">
          Your password must be at least 8 characters long.
        </p>
      </div>

      <div className="space-y-4 my-8 w-full max-w-md text-black">
        <FloatingInput
          id="fullname"
          type="text"
          label="Full Name"
          value={registerState.full_name || ""}
          onChange={(e) => dispatch(updateRegisterState({key: "full_name", value: e.target.value}))}
          autoComplete="name"
        />

        <FloatingInput
          id="password"
          type="password"
          label="Password"
          value={registerState.password || ""}
          onChange={(e) => dispatch(updateRegisterState({key: "password", value: e.target.value}))}
          autoComplete="new-password"
        />

        <FloatingInput
          id="confirm_password"
          type="password"
          label="Confirm password"
          value={registerState.confirm_password || ""}
          onChange={(e) =>
            dispatch(updateRegisterState({key: "confirm_password", value: e.target.value}))
          }
          autoComplete="new-password"
        />

        {registerState.password !== registerState.confirm_password &&
          registerState.confirm_password && (
            <p className="text-red-500 text-sm">Passwords don't match</p>
          )}

        <Button
          className="w-full rounded-[16px] bg-black hover:bg-gray-900 py-6 font-medium text-white mt-4"
          onClick={handleContinue}
          disabled={
            !registerState.password ||
            !registerState.full_name ||
            registerState.password !== registerState.confirm_password
          }
        >
          Continue
        </Button>
      </div>
    </>
  );
};

export default Step3Signup;
