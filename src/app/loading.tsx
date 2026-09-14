export default function GlobalLoading() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4">
      <div className="flex flex-col items-center space-y-4 max-w-sm w-full">
        {/* Animated Spinner & Brand Pulse */}
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
        </div>

        {/* Text */}
        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold text-slate-800">Loading Vexlora...</p>
          <p className="text-xs text-slate-400">Connecting to Vexlora marketplace</p>
        </div>

        {/* Skeleton Bars */}
        <div className="w-full space-y-2 pt-4">
          <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse" />
          <div className="h-2 w-3/4 bg-slate-100 rounded-full animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
