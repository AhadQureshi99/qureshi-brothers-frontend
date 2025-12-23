import React from "react";

const BarcodeHeader = ({ label1 = "Form ID", label2 = "Unique No", value1, value2 }) => {
  return (
    <div className="flex justify-between items-center gap-3 mb-6">
      <div className="flex flex-col items-center flex-1 min-w-0">
        <p className="text-xs font-bold mb-1 text-center uppercase">{label1}</p>
        <p className="font-bold text-xs mb-2 text-center px-1 py-0.5 w-full truncate">{value1}</p>
      </div>

      <div className="flex flex-col items-center flex-1 min-w-0">
        <p className="text-xs font-bold mb-1 text-center uppercase">{label2}</p>
        <p className="font-bold text-xs mb-2 text-center px-1 py-0.5 w-full truncate">{value2}</p>
      </div>
    </div>
  );
};

export default BarcodeHeader;
