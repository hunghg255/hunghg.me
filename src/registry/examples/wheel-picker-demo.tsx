import type { WheelPickerOption } from "@/registry/wheel-picker";
import { WheelPicker, WheelPickerWrapper } from "@/registry/wheel-picker";

const createArray = (length: number, add = 0): WheelPickerOption[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add;
    return {
      label: value.toString().padStart(2, "0"),
      value: value.toString(),
    };
  });

const hourOptions = createArray(12, 1);
const minuteOptions = createArray(60);
const meridiemOptions: WheelPickerOption[] = [
  { label: "AM", value: "AM" },
  { label: "PM", value: "PM" },
];

export default function WheelPickerDemo() {
  return (
    <div className="w-56">
      <WheelPickerWrapper>
        <WheelPicker options={hourOptions} infinite />
        <WheelPicker options={minuteOptions} infinite />
        <WheelPicker options={meridiemOptions} />
      </WheelPickerWrapper>
    </div>
  );
}
