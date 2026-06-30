import React from "react";

export default function GlossaryPopover({ term, glossary, position, onClose }) {
  const entry = glossary[term];

  const left = Math.min(position.x + 8, window.innerWidth - 340);
  const top = Math.min(position.y + 8, window.innerHeight - 200);

  return (
    <div className="popover-overlay" onClick={onClose}>
      <div
        className="popover"
        style={{ left, top }}
        onClick={(e) => e.stopPropagation()}
      >
        {entry ? (
          <>
            <div className="popover-term">{entry.term}</div>
            <div className="popover-short">{entry.short}</div>
            {entry.long && <div className="popover-long">{entry.long}</div>}
            {entry.seeAlso?.length > 0 && (
              <div className="popover-see-also">
                {"See also: " + entry.seeAlso.join(", ")}
              </div>
            )}
          </>
        ) : (
          <div>{`Term not found: ${term}`}</div>
        )}
      </div>
    </div>
  );
}
