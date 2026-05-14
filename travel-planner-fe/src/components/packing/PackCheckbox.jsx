import { Check } from "lucide-react";
import { INDIGO } from "./packingConstants";

export function PackCheckbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={checked ? { backgroundColor: INDIGO, borderColor: INDIGO } : {}}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
        ${!checked ? "border-gray-300 hover:border-indigo-400 bg-white" : ""}`}
    >
      {checked && <Check size={11} className="text-white" strokeWidth={3} />}
    </button>
  );
}