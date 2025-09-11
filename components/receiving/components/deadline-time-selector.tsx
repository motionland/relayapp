"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";
import { format } from "date-fns";

const DeadlineTimeSelector = () => {
  const receivingState = useAppSelector((state) => state.receiving);
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);

  // Determine the minimum date: use arrivalTime if available, otherwise use today
  const arrivalTime = receivingState.arrivalTime
    ? new Date(receivingState.arrivalTime)
    : null;
  const minDate =
    arrivalTime && !isNaN(arrivalTime.getTime())
      ? new Date(
          arrivalTime.getFullYear(),
          arrivalTime.getMonth(),
          arrivalTime.getDate()
        )
      : new Date(); // Default to today if arrivalTime is invalid or unavailable

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      dispatch(updateReceivingState({ key: "deadlineTime", value: null }));
      setOpen(false);
      return;
    }

    // If selecting the same date as arrivalTime, ensure time is not before arrivalTime
    if (
      arrivalTime &&
      selectedDate.toDateString() === arrivalTime.toDateString()
    ) {
      selectedDate.setHours(
        arrivalTime.getHours(),
        arrivalTime.getMinutes(),
        arrivalTime.getSeconds()
      );
    }

    setDate(selectedDate);
    dispatch(updateReceivingState({ key: "deadlineTime", value: selectedDate.toISOString() }));
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="date" className="text-sm font-medium">
        Deadline Time
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal text-sm h-12 rounded-lg"
          >
            {date ? format(date, "PPP") : "Select date"}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={{ before: minDate }}
            className="border-none shadow-none"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DeadlineTimeSelector;
