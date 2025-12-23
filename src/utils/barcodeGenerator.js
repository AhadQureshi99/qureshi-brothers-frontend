import JsBarcode from "jsbarcode";

// Generate unique IDs for a form
export const generateUniqueIDs = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  const formID = `FRM-${timestamp}-${random}`.substring(0, 24);
  const uniqueNo = `NO-${timestamp}-${Math.random()
    .toString(36)
    .substring(2, 11)}`.substring(0, 24);
  return { formID, uniqueNo };
};

// Generate barcode for an element
export const generateBarcode = (elementId, value, options = {}) => {
  const element = document.getElementById(elementId);
  if (element && value) {
    try {
      JsBarcode(element, value, {
        format: "CODE128",
        width: 0.8,
        height: 25,
        displayValue: false,
        ...options,
      });
    } catch (e) {
      console.error(`Barcode generation failed for ${elementId}:`, e);
    }
  }
};

// Generate barcodes for both IDs
export const generateBothBarcodes = (formID, uniqueNo) => {
  generateBarcode("formIDBarcode", formID);
  generateBarcode("uniqueNoBarcode", uniqueNo);
};
