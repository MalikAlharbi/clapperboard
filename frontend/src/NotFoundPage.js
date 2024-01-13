import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col h-screen items-center relative top-0 right-0 left-0 bottom-0">
      <AiFillCloseCircle size={300} color={"red"} />

      <p className="text-red-600 text-4xl font-mono">Invalid link (404)</p>
    </div>
  );
}
