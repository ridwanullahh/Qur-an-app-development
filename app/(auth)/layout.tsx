import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2" dir="rtl">
            {/* Visual Side */}
            <div className="hidden lg:flex flex-col bg-primary text-primary-foreground p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                <div className="relative z-10 flex items-center gap-2 mb-10">
                    <h1 className="text-2xl font-bold font-amiri">القرآن الكريم</h1>
                </div>
                <div className="relative z-10 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-amiri leading-loose">
                            &ldquo;وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ&rdquo;
                        </p>
                        <footer className="text-sm opacity-80">سورة الإسراء - آية 82</footer>
                    </blockquote>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="lg:hidden flex items-center gap-2 font-bold font-amiri text-primary text-xl">
                        القرآن الكريم
                    </Link>
                    <Button variant="ghost" asChild className="gap-2 mr-auto">
                        <Link href="/">
                            العودة للرئيسية
                            <ArrowRight className="h-4 w-4 rotate-180" />
                        </Link>
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-sm space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
