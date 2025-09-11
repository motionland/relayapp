"use client";
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { updateReceivingState, useAppDispatch } from "@/redux";

const ArrivalTimeSelector = () => {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="date" className="text-sm font-medium">
        Arrival Date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal text-sm h-12 rounded-lg"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
              dispatch(updateReceivingState({ key: "arrivalTime", value: date?.toISOString() || null }));
            }}
            className="border-none shadow-none"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ArrivalTimeSelector;