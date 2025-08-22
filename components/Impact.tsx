import Link from "next/link";

export default function Impact() {
  const testimonials = [
    {
      quote:
        "MindTrack AI helped me recognize patterns in my anxiety that I never noticed before. The personalized coping strategies have been life-changing.",
      author: "Sarah M.",
      role: "Teacher",
    },
    {
      quote:
        "As someone managing depression, having AI-powered insights into my daily mood patterns has made therapy sessions much more productive.",
      author: "Michael R.",
      role: "Software Engineer",
    },
    {
      quote:
        "The trend tracking feature showed me how my stress levels correlated with work deadlines. Now I can prepare better coping strategies in advance.",
      author: "Jessica L.",
      role: "Marketing Director",
    },
  ];

  const benefits = [
    "Improved self-awareness and emotional intelligence",
    "Better communication with mental health professionals",
    "Proactive mental health management and prevention",
    "Reduced symptoms through pattern recognition",
    "Enhanced coping skills and resilience building",
    "Greater sense of control over mental wellbeing",
  ];

  return (
    <section id="impact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Impact on Real Lives
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how MindTrack AI is helping people better understand and improve
            their mental health
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 border border-gray-200">
              <div className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Benefits Reported by Users
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of people who are taking control of their mental
            health with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={"/journal"}>
              <button className="bg-gray-900 text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors">
                Get Started Free
              </button>
            </Link>
            <button
              disabled
              className="cursor-not-allowed border-2 border-gray-300 text-gray-900 px-8 py-4 text-lg font-medium hover:border-gray-400 transition-colors"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
