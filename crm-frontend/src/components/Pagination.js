import React from "react";

export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPrevious,
  onNext,
}) {

  const start = totalElements === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <div style={{ fontSize: "14px", color: "#666" }}>
        Showing {start}-{end} of {totalElements}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <button
          className="btn btn-outline"
          disabled={page === 0}
          onClick={onPrevious}
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          className="btn btn-outline"
          disabled={page >= totalPages - 1}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}