export default function FeatureSection() {
  const features = [
    {
      icon: '🌸',
      title: 'Cycle Tracking',
      description: 'Effortlessly track your menstrual cycle with our intuitive calendar. Get predictions and insights about your phases.',
      gradient: 'from-pink-400 to-rose-400'
    },
    {
      icon: '✨',
      title: 'Personalized Wellness',
      description: 'Receive tailored nutrition, exercise, and self-care recommendations based on your current cycle phase.',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      icon: '💕',
      title: 'Symptom Logging',
      description: 'Track symptoms and moods to identify patterns and better understand your body\'s unique rhythm.',
      gradient: 'from-primary-400 to-secondary-400'
    },
    {
      icon: '🌙',
      title: 'Phase Insights',
      description: 'Learn about each phase of your cycle and how to optimize your lifestyle for maximum wellbeing.',
      gradient: 'from-secondary-400 to-accent-400'
    },
    {
      icon: '🌺',
      title: 'Community Support',
      description: 'Connect with a supportive community of women sharing their experiences and tips.',
      gradient: 'from-accent-400 to-pink-400'
    },
    {
      icon: '📊',
      title: 'Health Analytics',
      description: 'Visualize your cycle patterns with beautiful charts and gain deeper insights into your health.',
      gradient: 'from-pink-400 to-purple-400'
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blush/30 to-white"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Features</span> Made For You
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to understand and embrace your cycle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}