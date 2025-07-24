import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Validation App
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          A beautiful and modern authentication system built with Next.js and Tailwind CSS.
        </p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Go to Login Page
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/pan-verification"
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              PAN Verification →
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-purple-500 hover:text-purple-600 font-medium"
            >
              View Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
