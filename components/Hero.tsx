import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            MindTrack AI
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
            Your AI-Powered Mental Health Companion
          </p>

          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Log your daily thoughts, receive intelligent mood analysis, track
            emotional patterns over time, and discover personalized coping
            strategies tailored to your unique mental health journey.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={"/journal"}>
              <button className="bg-gray-900 text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors">
                Start Your Journal
              </button>
            </Link>
            <button disabled className="cursor-not-allowed border-2 border-gray-300 text-gray-900 px-8 py-4 text-lg font-medium hover:border-gray-400 transition-colors">
              Learn More
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Free to start • No credit card required • Privacy-first approach
          </p>
        </div>
      </div>
    </section>
  );
}
