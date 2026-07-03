"use client"

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="btn btn--primary resume__print"
      onClick={() => window.print()}
    >
      {label}
    </button>
  )
}
