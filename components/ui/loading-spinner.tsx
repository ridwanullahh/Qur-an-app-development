// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Loading Spinner Component

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-muted-foreground arabic-text text-lg">جاري التحميل...</p>
      <p className="text-sm text-muted-foreground">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
    </div>
  )
}
