"use client";

import { useEffect, useState } from "react";
import Picker from "react-mobile-picker";

export type WheelPickerProps<T> = {
  data: T[];
  currentIndex: number;
  onChange: (newIndex: number, item: T) => void;
  renderLabel?: (item: T, index: number) => string;
  height?: number;
  itemHeight?: number;
  visibleItemCount?: number;
  containerClassName?: string;
};

export function PerfectWheelPicker<T>({
  data,
  currentIndex,
  onChange,
  renderLabel = (item) => String(item),
  height = 260,
  itemHeight = 56,
  visibleItemCount = 5,
  containerClassName = "",
}: WheelPickerProps<T>) {
  const [pickerValue, setPickerValue] = useState({
    value: renderLabel(data[currentIndex], currentIndex),
  });

  // Mise à jour de pickerValue quand currentIndex change
  useEffect(() => {
    const newValue = renderLabel(data[currentIndex], currentIndex);
    setPickerValue((prev) => {
      if (prev.value !== newValue) {
        return { value: newValue };
      }
      return prev;
    });
  }, [currentIndex, data, renderLabel]);

  // Remove default mask/separator lines injected by react-mobile-picker
  useEffect(() => {
    const pickerContainer = document.querySelector(".picker-wrapper .picker");
    if (pickerContainer) {
      Array.from(pickerContainer.children).forEach((child) => {
        if (child.getAttribute("style")?.includes("pointer-events:none")) {
          pickerContainer.removeChild(child);
        }
      });
    }
  }, []);

  return (
    <div
      className={`relative w-full max-w-md h-64 overflow-hidden bg-transparent  rounded-3xl shadow-picker ${containerClassName}`}
      style={{
        perspective: "1000px",
        height,
        borderRadius: "12px",
      }}
    >
      {/* Top & Bottom selection bars to hide picker separators */}
      <div
        className="absolute inset-x-0 h-[1px] bg-indigo-500 z-20 pointer-events-none"
        style={{ top: `calc(50% - ${itemHeight / 2}px)` }}
      />
      <div
        className="absolute inset-x-0 h-[1px] bg-pink-500 z-20 pointer-events-none"
        style={{ top: `calc(50% + ${itemHeight / 2}px)` }}
      />
      {/* Composant Picker avec styles personnalisés */}
      <div className="picker-wrapper">
        <Picker
          className="picker"
          value={pickerValue}
          onChange={(newValue, key) => {
            setPickerValue(newValue);
            const idx = data.findIndex(
              (item) => renderLabel(item, 0) === newValue.value
            );
            if (idx !== -1) {
              onChange(idx, data[idx]);
            }
          }}
          wheelMode="natural"
          height={height}
          itemHeight={itemHeight}
        >
          <Picker.Column name="value">
            {data.map((item, i) => {
              const label = renderLabel(item, i);
              return (
                <Picker.Item key={i} value={label}>
                  {({ selected }) => (
                    <div
                      className="flex items-center justify-center cursor-pointer w-full"
                      style={{
                        height: itemHeight,
                        transformStyle: "preserve-3d",
                        transform: selected
                          ? "rotateX(0deg) translateZ(0px)"
                          : "rotateX(15deg) translateZ(-20px)",
                      }}
                    >
                      <span
                        style={
                          selected
                            ? {
                                boxShadow:
                                  "0px 2px 4px rgba(0,0,0,0.4), 0px 7px 13px -3px rgba(0,0,0,0.3), 0px -3px 0px inset rgba(0,0,0,0.2)",
                              }
                            : {}
                        }
                        className={`transition-all duration-200 text-center w-full py-2 ${
                          selected
                            ? "bg-gradient-to-t from-pink-500 to-blue-600 py-4 rounded-sm text-white font-bold text-2xl font-fredoka z-30"
                            : "text-white/50 text-lg font-quicksand"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )}
                </Picker.Item>
              );
            })}
          </Picker.Column>
        </Picker>
      </div>
    </div>
  );
}
