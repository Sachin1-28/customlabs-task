import React, { useState } from "react";
// import { motion } from "framer-motion";
import SegmentPopup from "./components/SegmentPopup";
import { Toaster } from "sonner";

export default function App() {
   const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <button
                onClick={() => setShowPopup(true)}
                className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
            >
                Save segment
            </button>

            {showPopup && <SegmentPopup onClose={() => setShowPopup(false)} />}
             <Toaster position="top-right" richColors />

        </div>
    );
}
