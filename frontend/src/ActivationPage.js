import React, { useEffect } from "react";
import { MdMarkEmailRead } from "react-icons/md";

export default function ActivationPage() {
  useEffect(() => { document.title = '200' }, [])
  return (
    <div className="flex flex-col h-screen items-center relative top-0 right-0 left-0 bottom-0">
      <MdMarkEmailRead size={300} color={"green"} />

      <p className="text-green-400 text-4xl font-mono">
        Your account have been activated. Enjoy!
      </p>
    </div>
  );
}
