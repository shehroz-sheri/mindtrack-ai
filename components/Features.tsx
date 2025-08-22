export default function Features() {
  const features = [
    {
      title: "Intelligent Mood Analysis",
      description: "Advanced AI algorithms analyze your journal entries to identify emotional patterns, mood fluctuations, and potential triggers.",
      benefits: ["Real-time sentiment analysis", "Emotion categorization", "Trigger identification", "Pattern recognition"]
    },
    {
      title: "Comprehensive Trend Tracking",
      description: "Visualize your mental health journey with detailed charts, graphs, and insights that show your progress over time.",
      benefits: ["Weekly and monthly reports", "Visual mood charts", "Progress indicators", "Historical comparisons"]
    },
    {
      title: "Personalized Coping Strategies",
      description: "Receive tailored recommendations and evidence-based coping techniques based on your unique emotional patterns.",
      benefits: ["Custom recommendations", "Evidence-based techniques", "Adaptive suggestions", "Goal-oriented strategies"]
    },
    {
      title: "Privacy & Security First",
      description: "Your mental health data is protected with enterprise-grade security, end-to-end encryption, and complete privacy controls.",
      benefits: ["End-to-end encryption", "HIPAA compliant", "Data ownership", "Anonymous processing"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to understand, track, and improve your mental wellbeing
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="border border-gray-200 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}