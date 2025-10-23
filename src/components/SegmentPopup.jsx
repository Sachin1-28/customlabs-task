
import React, { useState } from "react";
import { toast, Toaster } from "sonner";

const schemaOptions = [
    { label: "First Name", value: "first_name", type: "user" },
    { label: "Last Name", value: "last_name", type: "user" },
    { label: "Gender", value: "gender", type: "user" },
    { label: "Age", value: "age", type: "user" },
    { label: "Account Name", value: "account_name", type: "group" },
    { label: "City", value: "city", type: "user" },
    { label: "State", value: "state", type: "user" },
];

const WEBHOOK_URL = "https://webhook.site/91dbf76f-7244-41b5-a35c-a5b535dbaa89";

export default function SegmentPopup({ onClose }) {
    const [segmentName, setSegmentName] = useState("");
    const [selectedSchemas, setSelectedSchemas] = useState([]);
    const [currentSelection, setCurrentSelection] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddSchema = () => {
        if (!currentSelection) return;
        setSelectedSchemas([...selectedSchemas, currentSelection]);
        setCurrentSelection("");
    };

    const handleRemoveSchema = (index) => {
        const newSchemas = selectedSchemas.filter((_, idx) => idx !== index);
        setSelectedSchemas(newSchemas);
    };

    const handleSave = async () => {
        setLoading(true);
        const payload = {
            segment_name: segmentName,
            schema: selectedSchemas.map((value) => {
                const label = schemaOptions.find((o) => o.value === value)?.label;
                return { [value]: label };
            }),
        };

        try {
            await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                mode: "no-cors",
            });
            // alert("Segment saved successfully!");
            toast.success("Segment saved successfully!");
            onClose();
        } catch (err) {
            console.error(err);
            // alert(`Failed to save segment. ${err}`);
            toast.error(`Failed to save segment. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const availableOptions = schemaOptions.filter(
        (opt) => !selectedSchemas.includes(opt.value)
    );

    const getSchemaType = (value) => {
        return schemaOptions.find((opt) => opt.value === value)?.type || "user";
    };

    return (
        <div className="fixed inset-0 flex">
            <div className="flex-1 bg-gray-400 flex items-center justify-center">
                <button
                    onClick={onClose}
                    className="absolute top-6 cursor-pointer left-6 text-white text-2xl"
                >
                    ←
                </button>
                <h2 className="text-white text-xl">Save segment</h2>
            </div>


            <div className="w-[500px] bg-white flex flex-col">
                <div className="bg-teal-500 text-white p-4 flex items-center">
                    <button onClick={onClose} className="mr-3 cursor-pointer text-xl">
                        ←
                    </button>
                    <h2 className="text-lg font-medium">Saving Segment</h2>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Enter the Name of the Segment
                    </label>
                    <input
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full mb-6"
                        placeholder="Name of the segment"
                    />

                    <p className="text-xs text-gray-600 mb-3">
                        To save your segment, you need to add the schemas to build the query
                    </p>

                    <div className="flex items-center gap-3 mb-2 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>User Traits</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Group Traits</span>
                        </div>
                    </div>

                    <div className="border-2 border-blue-400 rounded-lg p-3 mb-3 min-h-[100px]">
                        {selectedSchemas.map((schema, idx) => {
                            const schemaType = getSchemaType(schema);
                            const dotColor = schemaType === "user" ? "bg-green-500" : "bg-red-500";

                            return (
                                <div key={idx} className="flex items-center gap-2 mb-2">
                                    <div className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`}></div>
                                    <select
                                        value={schema}
                                        onChange={(e) => {
                                            const newSchemas = [...selectedSchemas];
                                            newSchemas[idx] = e.target.value;
                                            setSelectedSchemas(newSchemas);
                                        }}
                                        className="border cursor-pointer border-gray-300 px-2 py-1.5 text-sm rounded flex-1"
                                    >
                                        {schemaOptions
                                            .filter(
                                                (opt) =>
                                                    !selectedSchemas.includes(opt.value) ||
                                                    opt.value === schema
                                            )
                                            .map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        onClick={() => handleRemoveSchema(idx)}
                                        className="text-gray-400 cursor-pointer hover:text-gray-600 text-lg flex-shrink-0 w-6"
                                    >
                                        −
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {availableOptions.length > 0 && (
                        <>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 flex-shrink-0"></div>
                                <select
                                    value={currentSelection}
                                    onChange={(e) => setCurrentSelection(e.target.value)}
                                    className="border cursor-pointer border-gray-300 px-2 py-1.5 text-sm rounded flex-1"
                                >
                                    <option value="">Add schema to segment</option>
                                    {availableOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="w-6 flex-shrink-0"></div>
                            </div>

                            <button
                                onClick={handleAddSchema}
                                className="text-teal-600 cursor-pointer text-xs underline"
                            >
                                + Add new schema
                            </button>
                        </>
                    )}
                </div>

                <div className="p-6 border-t flex justify-start gap-3">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
                    >
                        {loading ? "Saving..." : "Save the Segment"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded cursor-pointer text-red-500 hover:bg-red-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}