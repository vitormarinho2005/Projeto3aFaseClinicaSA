export default function Alert({ type = "error", message }) {
    const bgColor = type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800";
    return (
      <div className={`${bgColor} p-3 rounded mb-4 w-full max-w-2xl text-center`}>
        {message}
      </div>
    );
  }
  