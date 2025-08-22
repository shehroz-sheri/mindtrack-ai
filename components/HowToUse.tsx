export default function HowToUse() {
  const steps = [
    {
      number: "01",
      title: "Daily Check-in",
      description: "Write about your thoughts, feelings, and experiences in a secure, private space designed for reflection."
    },
    {
      number: "02", 
      title: "AI Analysis",
      description: "Our advanced AI analyzes your entries to identify mood patterns, emotional triggers, and mental health trends."
    },
    {
      number: "03",
      title: "Track Progress",
      description: "View detailed insights and visualizations of your emotional journey over days, weeks, and months."
    },
    {
      number: "04",
      title: "Personalized Support",
      description: "Receive tailored coping strategies, wellness tips, and actionable recommendations based on your unique patterns."
    }
  ];

  return (
    <section id="how-to-use" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Use MindTrack AI</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Four simple steps to better understand and improve your mental wellbeing
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-8 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-300 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}