import {
  Shirt, FileText, Zap, Pill, User, MoreHorizontal,
} from "lucide-react";

export const API_BASE = "http://localhost:3000";

export const PACKING_CATEGORIES = ["Clothes", "Documents", "Electronics", "Medicine", "Personal", "Other"];

export const PACKING_CATEGORY_ICON = {
  Clothes:     <Shirt          size={18} />,
  Documents:   <FileText       size={18} />,
  Electronics: <Zap            size={18} />,
  Medicine:    <Pill           size={18} />,
  Personal:    <User           size={18} />,
  Other:       <MoreHorizontal size={18} />,
};

export const INDIGO = "oklch(51.1% 0.262 276.966)";

export const DEFAULT_FILTERS = {
  categories: [],
  status:     "all",
  required:   "all",
  qtyMin:     "",
  qtyMax:     "",
};

export const STATUS_PILLS = [
  { value: "all",      label: "All"        },
  { value: "packed",   label: "Packed"     },
  { value: "unpacked", label: "Not Packed" },
];

export const PRIORITY_PILLS = [
  { value: "all",      label: "All"      },
  { value: "Required", label: "Required" },
  { value: "Optional", label: "Optional" },
];
