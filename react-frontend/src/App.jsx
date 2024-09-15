import React from "react";
import { motion } from "framer-motion";

import { FaAnglesDown } from "react-icons/fa6";
import { RiSupabaseLine } from "react-icons/ri";
import { SiPostgresql } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { SiGooglesheets } from "react-icons/si";
import { FaReact } from "react-icons/fa";

const tools = [
  { name: "Supabase", icon: RiSupabaseLine },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Node.js", icon: FaNodeJs },
  { name: "Google Sheets", icon: SiGooglesheets },
  { name: "React", icon: FaReact },
];

const steps = [
  "Sign up for the app",
  "Connect your tools",
  "Monitor and Sync data",
  "Customize your settings",
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
            className="w-full h-screen flex flex-col justify-center items-center bg-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl font-bold text-gray-200 mb-4">
              {index + 1}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center px-4">
              {step}
            </h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default App;
