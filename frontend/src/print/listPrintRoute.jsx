import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListPrintView from "./listPrintView";
import { getListById } from "../db/indexedDB";

export default function ListPrintRoute() {debugger;
  const { id } = useParams();
  const [list, setList] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getListById(id);
      setList(data);
    }
    load();
  }, [id]);

  if (!list?.id) return <p style={{ padding: 20 }}>Loading preview…</p>;

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      {/* ACTION BAR (hidden during print) */}
      <div className="print-actions no-print">
        <button onClick={() => window.print()}>
          🖨 Print
        </button>
        <button onClick={() => window.history.back()}>
          ← Back
        </button>
      </div>

      {/* PRINT CONTENT */}
      {list?.id && <ListPrintView list={list} />}
    </div>
  );
}