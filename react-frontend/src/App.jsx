import React from "react";
import { motion } from "framer-motion";

import { FaAnglesDown } from "react-icons/fa6";
import { RiSupabaseLine } from "react-icons/ri";
import { SiPostgresql } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { SiGooglesheets } from "react-icons/si";
import { FaReact } from "react-icons/fa";

import step1 from "./assets/steps/step-1.png";
import step2 from "./assets/steps/step-2.png";
import step3 from "./assets/steps/step-3.png";
import step4 from "./assets/steps/step-4.png";
import step5 from "./assets/steps/step-5.png";

const tools = [
  { name: "Supabase", icon: RiSupabaseLine },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Node.js", icon: FaNodeJs },
  { name: "Google Sheets", icon: SiGooglesheets },
  { name: "React", icon: FaReact },
];

const steps = [
  {
    number: "01",
    title: "Setup essential scripts",
    description:
      "Head over to Extension > Apps Script in the toolbar in your sheet and insert the .gs files provided in the repository.",
    image: step1,
  },
  {
    number: "02",
    title: "Add service account",
    description:
      "Invite the service account email mentioned in the README to your Google Sheet and give it the editor permissions.",
    image: step2,
  },
  {
    number: "03",
    title: "Refresh your Sheet & Run the script",
    description:
      "After refreshing your sheet, you can run the script by clicking clicking on Permission > Authorize and Run. It will ask for permission, Don't worry its safe.",
    image: step3,
  },
  {
    number: "04",
    title: "And that's it!",
    description:
      "Once notified that the sync is ready you are free to use the sheet as you like, and we will take care of the rest.",
    image: step4,
  },
  {
    number: "05",
    title: "View all logs for changes made to your sheet",
    description:
      "Check out the Logs page to see all the changes made to your sheet since you have synced. From insertions to deletions, we have got you covered.",
    image: step5,
  },
];

const App = () => {
  return (
    <div className="w-screen min-h-screen overflow-x-hidden bg-gray-100 text-gray-800">
      {/* Section 1: Header */}
      <motion.div
        className="h-screen w-full flex flex-col justify-center items-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          Sync Smarter, Not Harder.
        </h1>
        <p className="text-lg md:text-xl text-center mb-8 px-4 max-w-2xl">
          A powerful platform to seamlessly integrate and synchronize your
          Google Sheets with PostgreSQL.
        </p>
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <FaAnglesDown className="w-12 h-12 text-gray-400 animate-bounce" />
        </motion.div>
      </motion.div>

      {/* Section 2: Tools Used */}
      <div className="min-h-screen w-full bg-gray-50 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Tools Used
        </h2>
        <div className="max-w-3xl mx-auto px-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center"
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-100 rounded-full p-3 mr-4">
                <tool.icon size={48} />
              </div>
              <h3 className="text-2xl font-semibold">{tool.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section 3: How to Use */}
      <div className="w-full">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="w-full h-screen flex flex-col md:flex-row justify-center items-center bg-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`w-full md:w-1/2 p-4 md:p-0 ${
                index % 2 === 0 ? "md:order-1" : "md:order-2"
              }`}
            >
              <img
                src={step.image}
                alt={`Step ${step.number}`}
                className="w-full max-w-md md:max-w-xl mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div
              className={`w-full md:w-1/2 mt-8 md:mt-0 px-10 md:p-0 ${
                index % 2 === 0 ? "md:order-2" : "md:order-1"
              }`}
            >
              <div className="max-w-md mx-auto">
                <div className="text-5xl md:text-8xl font-bold text-gray-200 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl md:text-3xl font-bold mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default App;
