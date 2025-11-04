import React from "react";
import Sidebar from "../Sidebar/Sidebar";
const logo = "/visaform_logo.png";
import { FaEye } from "react-icons/fa";

const VisaForm = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block w-[25%] bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white p-4 md:p-6 overflow-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-2">
          {/* Photo Box */}
          <div className="w-40 h-40 border border-green-500 flex flex-col items-center justify-center text-xs text-gray-500 md:mb-0 leading-snug text-center relative">
            <p className="text-sm text-gray-600 mb-1">صورة</p>
            <p>Paste Photo Here</p>
            <button className="absolute -bottom-3 right-0 text-white px-2 py-1 bg-green-600 rounded-md">
              <FaEye size={14} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Saudi Logo"
              className="w-40 h-40 object-contain"
            />
          </div>

          {/* Embassy Text */}
          <div className="text-center md:text-right md:mt-0 md:mr-12">
            <p className="text-green-500 border-b border-green-500 py-2 mb-4">
              سفارة المملكة العربية السعودية
            </p>
            <h3 className="text-green-500 text-sm md:text-base">
              EMBASSY OF SAUDI ARABIA
            </h3>
            <p className="text-green-500 text-xs md:text-sm">
              CONSULAR SECTION
            </p>
          </div>
        </div>

        {/* Main Form Border */}
        <div className="border border-green-700 text-xs md:text-sm">
          {/* Full Name */}
          <div className="flex border-b border-green-700">
            {/* Left label */}
            <div className="w-[20%] font-semibold p-2">FULL NAME</div>

            {/* Middle input */}
            <p className="flex items-center justify-center flex-grow px-6 py-1">
              <input
                type="text"
                placeholder="WAJAHAT MALIK S/O MUNIR AHMED MALIK"
                className="bg-transparent outline-none placeholder-black text-center w-full"
              />
            </p>

            {/* Right Arabic label */}
            <div className="w-[20%] p-2 text-right pr-4">:الاسم الكامل</div>
          </div>

          {/* DOB / Place of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF BIRTH column */}
            <div className="flex py-2 border-r border-green-700 items-center">
              {/* Left label */}
              <div className="w-[20%] font-semibold px-2">DATEOFBIRTH:</div>

              {/* Middle input */}
              <div className="flex-grow px-4">
                <input
                  type="text"
                  placeholder="05-06-1990 (45) YEARS"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>

              {/* Right Arabic label */}
              <div className="w-[20%] text-right pr-4">:تاريخ الولادة</div>
            </div>

            {/* PLACE OF BIRTH column */}
            <div className="flex items-center">
              {/* Left label */}
              <div className="w-[20%] font-semibold px-2">PLACEOFBIRTH:</div>

              {/* Middle input */}
              <div className="flex-grow px-4">
                <input
                  type="text"
                  placeholder="RAWALPINDI, PAK"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>

              {/* Right Arabic label */}
              <div className="w-[20%] text-right pr-4">:محل الولادة</div>
            </div>
          </div>

          {/* Previous & Present Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* PREVIOUS NATIONALITY */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-[20%] font-semibold p-2">
                PREVIOUSNATIONALITY:
              </div>
              <div className="flex items-center justify-center flex-grow px-4 py-1">
                <input
                  type="text"
                  placeholder="PAKISTAN"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div
                className="w-[25%] p-2 text-right pr-4 whitespace-nowrap"
                dir="rtl"
              >
                الجنسية السابقة:
              </div>
            </div>

            {/* PRESENT NATIONALITY */}
            <div className="flex items-center">
              <div className="w-[20%] font-semibold p-2">
                PRESENTNATIONALITY:
              </div>
              <div className="flex items-center justify-center flex-grow px-4 py-1">
                <input
                  type="text"
                  placeholder="PAKISTAN"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div
                className="w-[25%] p-2 text-right pr-4 whitespace-nowrap"
                dir="rtl"
              >
                الجنسية الحالية:
              </div>
            </div>
          </div>

          {/* Gender & Marital Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* Gender column */}
            <div className="grid grid-cols-4 border-r border-green-700 text-center">
              {/* GENDER label */}
              <div className="border-r border-green-700 p-2 font-semibold flex flex-col justify-center">
                <span className="text-sm">{/* Arabic */}</span>
                <span>GENDER</span>
              </div>

              {/* FEMALE */}
              <div className="border-r border-green-700 p-2 flex flex-col justify-center">
                <span className="text-sm">أنثى</span>
                <span>FEMALE</span>
              </div>

              {/* MALE */}
              <div className="border-r border-green-700 p-2 flex flex-col justify-center">
                <span className="text-sm">ذكر</span>
                <span>MALE</span>
              </div>

              {/* Empty Arabic column */}
              <div className="p-2 flex flex-col justify-center">
                <span className="text-sm">:جنس</span>
              </div>
            </div>

            {/* Marital Status column */}
            <div className="flex items-center">
              <div className="w-1/4 font-semibold p-2">MARITALSTATUS</div>

              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder="MARRIED"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>

              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                الحالة الاجتماعية:{" "}
              </div>
            </div>
          </div>

          {/* Religion & Sect */}
          {/* Sect & Religion */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* SECT column */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/4 font-semibold p-2">SECT:</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder="SUNNI"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                المذهب:
              </div>
            </div>

            {/* RELIGION column */}
            <div className="flex items-center">
              <div className="w-1/4 font-semibold p-2">RELIGION</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder="ISLAM"
                  className="bg-transparent outline-none placeholder-black text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                الديانة:
              </div>
            </div>
          </div>

          {/* Qualification & Profession */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* QUALIFICATION */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/4 font-semibold p-2">QUALIFICATION:</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  placeholder=""
                  className="bg-transparent outline-none text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                الموهل العلمي:
              </div>
            </div>

            {/* PROFESSION */}
            <div className="flex items-center">
              <div className="w-1/4 font-semibold p-2">PROFESSION</div>
              <div className="flex-grow p-2">
                <input
                  type="text"
                  defaultValue="عامل تصنيع"
                  className="bg-transparent outline-none text-center w-full"
                />
              </div>
              <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
                المهنة:
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="flex border-b border-green-700 items-center">
            {/* English Label */}
            <div className="w-1/4 font-semibold p-2">HOME ADDRESS & PHONE:</div>

            {/* Input Field */}
            <div className="flex-grow p-2">
              <textarea
                placeholder="House No. P/138, Street No. 1, MHALLAH IMAMBARHA, Rawalpindi&#10;0300-1234567"
                className="bg-transparent outline-none text-center w-full resize-none placeholder-black"
                rows={2}
              ></textarea>
            </div>

            {/* Arabic Label */}
            <div className="w-1/4 p-2 text-right whitespace-nowrap" dir="rtl">
              عنوان المنزل ورقم التلفون:
            </div>
          </div>

          <div className="flex border-b border-green-700 items-center">
            {/* English Label */}
            <div className="w-1/3 font-semibold p-2">
              BUSINESS ADDRESS & PHONE:
            </div>

            {/* Input Field */}
            <div className="w-1/3 p-2">
              <textarea
                placeholder=""
                className="bg-transparent outline-none text-center w-full resize-none placeholder-black"
                rows={2}
              ></textarea>
            </div>

            {/* Arabic Label */}
            <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
              عنوان محل العمل ورقم التلفون:
            </div>
          </div>

          <div className="border-b border-green-700 p-2">
            <div className="flex items-center">
              {/* Left English label */}
              <span className="whitespace-nowrap mr-2">Purpose of Travel:</span>

              {/* 7 columns with reduced width */}
              <div className="grid grid-cols-7 gap-0 flex-1">
                {[
                  { en: "WORK", ar: "عمل" },
                  { en: "TRANSIT", ar: "ترانمرور" },
                  { en: "VISIT", ar: "زيارة" },
                  { en: "UMRAH", ar: "عمرة" },
                  { en: "RESIDENCE", ar: "إقامة" },
                  { en: "HAJJ", ar: "حج" },
                  { en: "DIPLOMACY", ar: "دبلوماسية" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-green-700 p-2 flex flex-col justify-center text-center"
                  >
                    <span className="text-xs">{item.ar}</span>
                    <span>{item.en}</span>
                  </div>
                ))}
              </div>

              {/* Right Arabic label */}
              <span className="whitespace-nowrap ml-2">:غرض السفر</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF ISSUE */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF ISSUE:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="12/09/2022"
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ الإصدار:
              </div>
            </div>

            {/* PASSPORT NO */}
            <div className="flex items-center">
              <div className="w-1/3 font-semibold p-2">PASSPORT NO:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="GW123456789"
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                رقم جوازالسفر:
              </div>
            </div>
          </div>

          {/* Date of Expiry & Place of Issue */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF EXPIRY */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF EXPIRY:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="24/05/2028"
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ الإنتھاء:{" "}
              </div>
            </div>

            {/* PLACE OF ISSUE */}
            <div className="flex items-center">
              <div className="w-1/3 font-semibold p-2">PLACE OF ISSUE:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder="PAKISTAN"
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                محل الإصدار:
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* DATE OF ARRIVAL */}
            <div className="flex border-r border-green-700 items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF ARRIVAL:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder=""
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ الوصول:{" "}
              </div>
            </div>

            {/* DATE OF DEPARTURE */}
            <div className="flex items-center">
              <div className="w-1/3 font-semibold p-2">DATE OF DEPARTURE:</div>
              <div className="w-1/3 p-2">
                <input
                  type="text"
                  placeholder=""
                  className="bg-transparent outline-none text-center w-full placeholder-black"
                />
              </div>
              <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
                تاريخ المغادرة:
              </div>
            </div>
          </div>

          {/* Duration of Stay in the Kingdom */}
          <div className="flex border-b border-green-700 items-center">
            <div className="w-2/3 font-semibold p-2">
              DURATION OF STAY IN THE KINGDOM:
            </div>
            <div className="w-1/3 p-2">
              <input
                type="text"
                placeholder="2 YEARS"
                className="bg-transparent outline-none text-center w-full placeholder-black"
              />
            </div>
            <div className="w-1/3 p-2 text-right whitespace-nowrap" dir="rtl">
              مدة الإقامة بالمملكة:
            </div>
          </div>

          {/* Payment Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-6 border-b border-green-700 text-right">
            {/* Date */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:تاريخ</div>
                <div className="font-semibold">DATE</div>
              </div>
            </div>

            {/* Slip No */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder=""
                  className="bg-transparent outline-none text-left w-1/2 placeholder-black"
                />
                <button className="text-white px-2 py-1 bg-green-600 rounded-md">
                  <FaEye size={14} />
                </button>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm">:ايصال رقم</div>
                <div className="font-semibold">SLIP NO</div>
              </div>
            </div>

            {/* Cheque No */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:بیشيك رقم</div>
                <div className="font-semibold">CHEQUE NO</div>
              </div>
            </div>

            {/* Cash */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:نقدا</div>
                <div className="font-semibold">CASH</div>
              </div>
            </div>

            {/* Free */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none text-left w-1/2 placeholder-black"
              />
              <div className="flex flex-col items-end">
                <div className="text-sm">:مجاملة</div>
                <div className="font-semibold">FREE</div>
              </div>
            </div>

            {/* Mode of Payment */}
            <div className="border-green-700 p-2 flex items-center justify-between">
              <div className="flex flex-col items-end">
                <div className="text-sm">:طريق الدفع</div>
                <div className="font-semibold">MODE OF PAYMENT</div>
              </div>
            </div>
          </div>

          {/* Relationship Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* First Column - Relationship */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="font-semibold">RELATIONSHIP:</span>
              </div>

              <input
                type="text"
                className="bg-transparent outline-none  w-40 text-center"
                placeholder=""
              />

              <div className="flex flex-col items-end">
                <span className="text-sm">:صلة</span>
              </div>
            </div>

            {/* Second Column - Arabic Only */}
            <div className="p-2 text-right">
              <div className="text-sm">:اسم المحرم</div>
            </div>
          </div>

          {/* Destination & Carrier's Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* First Column - Destination */}
            <div className="border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">DESTINATION:</span>
                <input
                  type="text"
                  placeholder="AL RIYADH, KYC"
                  className="bg-transparent outline-none placeholder-black px-1 py-[2px] text-sm"
                />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm">:جهة الوصول</span>
              </div>
            </div>

            {/* Second Column - Carrier's Name */}
            <div className="p-2 flex justify-between items-center">
              <div className="font-semibold">CARRIER'S NAME:</div>
              <div className="flex flex-col items-end">
                <span className="text-sm">:اسم الشركة الناقلة</span>
              </div>
            </div>
          </div>

          {/* Dependents Traveling Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-green-700">
            {/* First Column - English text on left */}
            <div className="border-r border-green-700 p-2 flex items-center justify-start">
              <span className="font-semibold">
                DEPENDENTS TRAVELING IN THE SAME PASSPORT
              </span>
            </div>

            {/* Second Column - Arabic text on left */}
            <div className="p-2 flex items-center justify-start">
              <span className="text-sm">
                إيضاحات تخص أفراد العائلة (المضافين) علي نفس جوازالسفر
              </span>
            </div>
          </div>
          {/* Relationship, Date of Birth, Sex, Full Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-green-700">
            {/* Column 1 - Relationship */}
            <div className="border-r border-green-700 p-2 flex justify-between items-center">
              <span className="font-semibold">RELATIONSHIP</span>
              <span className="text-sm">نوع الصلة</span>
            </div>

            {/* Column 2 - Date of Birth */}
            <div className="border-r border-green-700 p-2 flex justify-between items-center">
              <span className="font-semibold">DATE OF BIRTH</span>
              <span className="text-sm">تاريخ الولادة</span>
            </div>

            {/* Column 3 - Sex */}
            <div className="border-r border-green-700 p-2 flex justify-between items-center">
              <span className="font-semibold">SEX</span>
              <span className="text-sm">الجنس</span>
            </div>

            {/* Column 4 - Full Name */}
            <div className="p-2 flex justify-between items-center">
              <span className="font-semibold">FULL NAME</span>
              <span className="text-sm">الاسم الكامل</span>
            </div>
          </div>
          {/* Empty 4-column Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-green-700">
            {/* Column 1 */}
            <div className="border-r border-green-700 ">
              <input
                type="text"
                className="w-full bg-transparent outline-none  px-1 "
                placeholder=""
              />
            </div>

            {/* Column 2 */}
            <div className="border-r border-green-700 ">
              <input
                type="text"
                className="w-full bg-transparent outline-none px-2 "
                placeholder=""
              />
            </div>

            {/* Column 3 */}
            <div className="border-r border-green-700 ">
              <input
                type="text"
                className="w-full bg-transparent outline-none  px-2 "
                placeholder=""
              />
            </div>

            {/* Column 4 */}
            <div className="p-3">
              <input
                type="text"
                className="w-full bg-transparent outline-none  px-2"
                placeholder=""
              />
            </div>
          </div>

          {/* Name and Address of Company/Individual Row */}
          <div className="border-b border-green-700 p-2 flex justify-between items-center">
            <span className="font-semibold">
              Name and Address of Company/Individual in the Kingdom
            </span>
            <span className="text-right font-semibold">
              شركة جنى للخدمات البحرية شركة الشخص الواحد
            </span>
          </div>
          {/* Empty Row */}
          <div className="p-3 border-b border-green-700">
            <input
              type="text"
              className="w-full bg-transparent outline-none "
              placeholder=""
            />
          </div>

          {/* Declaration Row */}
          <div className="flex border-b border-green-700">
            {/* English Text */}
            <div className="w-2/3 p-2">
              <span className="text-sm font-medium">
                The undersigned hereby clarify that all the information I have
                provided are correct. I'll abide by the laws of the Kingdom
                during the period of my residence in it.
              </span>
            </div>

            {/* Arabic Placeholder */}
            <div className="w-1/3 p-2 text-sm font-medium text-right">
              ناالموقع ادناه اقربان كل المعلومات اللتي دونتها صحيصة وساكون
              ملتزمابقوانين المملكة اثناء فترة وجودي بها
            </div>
          </div>
          {/* Signature Row */}
          <div className="flex border-b border-green-700">
            {/* Date Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder=""
                  className="bg-transparent outline-none px-2 py-1 w-24"
                />
                <button className="text-white px-2 py-1 bg-green-600 rounded-md">
                  <FaEye size={14} />
                </button>
              </div>
              <div className="flex flex-col text-right text-sm">
                <div>:التاريخ</div>
                <div className="font-medium">Date:</div>
              </div>
            </div>

            {/* Signature Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none px-2 py-1 w-24"
              />
              <div className="flex flex-col text-right text-sm">
                <div>:التوقيع</div>
                <div className="font-medium">Signature:</div>
              </div>
            </div>

            {/* Name Column */}
            <div className="w-1/3 p-2 flex items-center justify-between">
              <input
                type="text"
                placeholder="Wajahat Malik"
                className="bg-transparent outline-none placeholder-black px-2 py-1 w-40 text-right"
              />
              <div className="flex flex-col text-right text-sm">
                <div>:الإسم</div>
                <div className="font-medium">Name:</div>
              </div>
            </div>
          </div>

          {/* Office Use Only Row */}
          <div className="bg-gray-400 border-b border-green-700  p-2">
            <div className="flex flex-col items-center">
              للإستعمال الرسمي فقط
              <div className="text-sm">{/* Arabic text placeholder */}</div>
              {/* English text below */}
              <div className="text-sm font-medium">For Office Use Only</div>
            </div>
          </div>
          {/* Date & Authorization Row */}
          <div className="flex border-b border-green-700">
            {/* First Column - Date */}
            <div className="w-1/2 border-r border-green-700 p-2 flex items-center justify-between">
              <div className="text-sm font-medium">Date</div>
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none px-2 py-1 w-40 mx-2"
              />
              <div className="text-sm">:تاريخه</div>
            </div>

            {/* Second Column - Authorization */}
            <div className="w-1/2 p-2 flex items-center justify-between">
              <div className="text-sm font-medium">Authorization</div>
              <input
                type="text"
                placeholder=""
                className="bg-transparent outline-none px-2 py-1 w-40 mx-2"
              />
              <div className="text-sm">
                :رقم الامر المعتمد عليه في اعطاء التاشيرة
              </div>
            </div>
          </div>

          {/* Visit/Work For Row */}
          <div className="flex border-b border-green-700">
            {/* First Column - Small Width */}
            <div className="w-1/6 border-r border-green-700 p-2 flex flex-col items-start">
              <div className="text-sm font-medium">Visit/Work For</div>
            </div>

            {/* Middle Column - Input Field */}
            <div className="w-4/6 border-r border-green-700 p-2 flex items-center">
              <input
                type="text"
                className="w-full bg-transparent outline-none px-2 py-1"
                placeholder=""
              />
            </div>

            {/* Third Column - Small Width */}
            <div className="w-1/6 p-2 flex flex-col items-start">
              <div className="text-sm">:لزيارة - العمل لدي</div>
            </div>
          </div>

          {/* Date & Visa Number Row */}
          <div className="flex border-b border-green-700">
            {/* Date Column */}
            <div className="w-1/2 border-r border-green-700 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Date:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                style={{ border: "none" }}
              />
              <span className="text-sm">:وتاريخ</span>
            </div>

            {/* Visa Number Column */}
            <div className="w-1/2 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Visa Number:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                style={{ border: "none" }}
              />
              <span className="text-sm">:شرله برقم</span>
            </div>
          </div>

          {/* Fee Collected, Type & Duration Row */}
          <div className="flex border-b border-green-700">
            {/* Fee Collected Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Fee Collected:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                style={{ border: "none" }}
              />
              <span className="text-sm">:المبلغ المحصل</span>
            </div>

            {/* Type Column */}
            <div className="w-1/3 border-r border-green-700 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Type:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                style={{ border: "none" }}
              />
              <span className="text-sm">:نوعها</span>
            </div>

            {/* Duration Column */}
            <div className="w-1/3 p-2 flex items-center justify-between">
              <span className="text-sm font-medium">Duration:</span>
              <input
                type="text"
                className="bg-transparent outline-none text-center w-1/3"
                placeholder=""
                style={{ border: "none" }}
              />
              <span className="text-sm">:مدتها</span>
            </div>
          </div>

          {/* Head of Consular Section & Checked By Row */}
          <div className="flex border-b border-green-700 h-20">
            {/* Head of Consular Section Column */}
            <div className="w-1/2 border-r border-green-700 flex flex-col items-center justify-center">
              <span className="text-sm">رئيس القسم القنصلي</span>
              <span className="text-sm font-medium">
                Head of Consular Section
              </span>
            </div>

            {/* Checked By Column */}
            <div className="w-1/2 flex flex-col items-center justify-center">
              <span className="text-sm">مدقق البيانات</span>
              <span className="text-sm font-medium">Checked By</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaForm;
