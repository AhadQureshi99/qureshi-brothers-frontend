import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { FaArrowUp, FaPlus } from 'react-icons/fa';


import bg1 from './Images/bg1.jpeg';
import bg2 from './Images/bg2.jpeg';
import visa from './Images/visa.png';
import protector from './Images/protector.png';
import active from './Images/Active.png';
import navtac from './Images/NAVTTC.png';
import profile from './Images/profile.jpeg';

const Dashboard = () => {
  const summaryCards = [
    {
      title: 'Total Candidates',
      value: 256,
      percent: '+12% from last month',
      buttonLabel: 'UPLOAD CV',
      bgImage: bg1,
      accept: '.pdf,.doc,.docx', 
    },
    {
      title: 'Monthly Expense',
      value: '256,300',
      percent: '+12% from last month',
      buttonLabel: 'ADD EXPENSE',
      bgImage: bg2,
      accept: '.xlsx,.csv',
    },
    {
      title: 'Completed Visas',
      value: 256,
      percent: '+12% from last month',
      image: visa,
    },
    {
      title: 'Pending Protector',
      value: 256,
      percent: '+12% from last month',
      image: protector,
    },
    {
      title: 'Active Cases',
      value: 256,
      percent: '+12% from last month',
      image: active,
    },
    {
      title: 'NAVTTC Tests',
      value: 256,
      percent: '+12% from last month',
      image: navtac,
    },
  ];

  const recentCases = [
    {
      name: 'Ahmed Khan',
      code: 'CN000001',
      detail: 'Visa approved for Saudi Arabia',
      time: '2 hours ago',
      status: 'Pending',
      avatar: null,
    },
    {
      name: 'Fatima Ali',
      code: 'CN000002',
      detail: 'NAVTTC test scheduled for Electrician',
      time: '4 hours ago',
      status: 'Approved',
      avatar: profile,
    },
    {
      name: 'Ahmed Khan',
      code: 'CN000003',
      detail: 'Visa approved for Saudi Arabia',
      time: '2 hours ago',
      status: 'Pending',
      avatar: profile,
    },
    {
      name: 'Fatima Ali',
      code: 'CN000004',
      detail: 'NAVTTC test scheduled for Electrician',
      time: '4 hours ago',
      status: 'REJECTED',
      avatar: profile,
    },
  ];

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`${label} file selected:`, file.name);
     
    }
  };

  return (
    <div className="flex min-h-screen">
  
      <div className="w-[25%] bg-white border-r border-gray-200">
        <Sidebar />
      </div>

    
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>

     
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {summaryCards.slice(0, 2).map((card, idx) => (
            <div
              key={idx}
              className="relative h-44 text-white rounded-xl overflow-hidden shadow-md"
              style={{
                backgroundImage: `url(${card.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                  <p className="text-sm flex items-center mt-1">
                    <FaArrowUp className="mr-1 text-green-400" />
                    {card.percent}
                  </p>
                </div>

               
                <label className="self-start mt-2 bg-white text-black text-sm font-medium px-3 py-1 rounded-full cursor-pointer flex items-center">
                  <FaPlus className="inline mr-1" />
                  {card.buttonLabel}
                  <input
                    type="file"
                    accept={card.accept}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, card.buttonLabel)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

      
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summaryCards.slice(2).map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-md font-semibold text-gray-700">{card.title}</h3>
                <p className="text-2xl font-bold text-black mt-1">{card.value}</p>
                <p className="text-green-500 text-sm mt-1">{card.percent}</p>
              </div>
              {card.image && (
                <img
                  src={card.image}
                  alt="icon"
                  className="h-12 w-12 object-contain"
                />
              )}
            </div>
          ))}
        </div>

     
     
        <div className="bg-white shadow-lg rounded-xl p-6 mt-10">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Total Candidates</h3>
          {[
            'CV Collection',
            'Medical Process',
            'NAVTTC Tests',
            'E-Number Issued',
            'Embassy Submission',
            'Visa Approved',
            'Protector Completed',
          ].map((step, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700">{step}</span>
                <span className="text-sm text-gray-700">245/245</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${90 - idx * 10}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      
      
        <div className="mt-10 bg-gradient-to-b from-green-200 to-green-100 p-4 rounded-xl shadow-md">
          <h3 className="text-md font-semibold text-green-600 mb-4">Recent Cases</h3>
          <div className="grid gap-4">
            {recentCases.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-full p-4 shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      className="w-12 h-12 rounded-full object-cover"
                      alt="user"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300" />
                  )}
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      {item.name}{' '}
                      <span className="text-xs text-gray-500 ml-2">
                        Code: {item.code}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">{item.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
                <button
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Pending'
                      ? 'bg-orange-100 text-orange-500'
                      : item.status === 'Approved'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-500'
                  }`}
                >
                  {item.status}
                </button>
              </div>
            ))}
          </div>
        </div>

       
       
        <div className="bg-green-100 p-6 rounded-xl mt-8 shadow-md">
          <h3 className="text-md font-semibold text-green-800 mb-4">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-black mb-6">
            PKR 2,450,000 <span className="text-yellow-500">🟡</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>Visa Fees</div>
            <div className="text-right">PKR 890,000</div>
            <div>Medical Fees</div>
            <div className="text-right">PKR 456,000</div>
            <div>Transport Fees</div>
            <div className="text-right">PKR 234,000</div>
            <div>Electric Bill</div>
            <div className="text-right">PKR 234,000</div>
          </div>

          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between font-semibold text-black">
            <span>Total</span>
            <span>PKR 2,450,000</span>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="flex-1 text-green-700 font-medium py-2 rounded-lg bg-white hover:bg-green-50 transition">
              Print Report
            </button>
            <button className="flex-1 bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition">
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
