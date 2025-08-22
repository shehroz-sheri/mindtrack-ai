export default function WhyItMatters() {
  const stats = [
    {
      number: "1 in 5",
      label: "Adults experience mental health issues annually"
    },
    {
      number: "70%",
      label: "Improvement with early intervention and tracking"
    },
    {
      number: "3x",
      label: "Better outcomes with consistent self-monitoring"
    }
  ];

  const reasons = [
    {
      title: "Early Detection",
      description: "Identify mental health patterns before they become overwhelming. AI-powered analysis helps spot trends that might go unnoticed, enabling proactive care."
    },
    {
      title: "Evidence-Based Insights",
      description: "Make informed decisions about your wellbeing with data-driven insights. Track what works, understand triggers, and build effective coping strategies."
    },
    {
      title: "Accessible Mental Health Care",
      description: "Bridge the gap between therapy sessions with continuous support. Get professional-grade insights and recommendations available 24/7."
    },
    {
      title: "Personal Growth",
      description: "Transform journaling from a simple practice into a powerful tool for self-understanding, emotional intelligence, and personal development."
    }
  ];

  return (
    <section id="why-it-matters" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Mental Health Tracking Matters</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding your mental health patterns is crucial for wellbeing, recovery, and personal growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white p-8 border border-gray-200">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Mental health is not a destination, but a journey of continuous self-awareness and growth.
          </p>
          <button className="bg-gray-900 text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors">
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}