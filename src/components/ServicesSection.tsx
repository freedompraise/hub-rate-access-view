
const ServicesSection = () => {
  const services = [
    {
      icon: "�",
      title: "Marketing & Campaign Strategy",
      description: "We build marketing roadmaps that match your goals, connect with your audience, and deliver measurable results.",
      investment: "Minimum Investment: ₦500,000 / $400"
    },
    {
      icon: "📱",
      title: "Social Media Marketing",
      description: "We handle your day-to-day content planning, posting, engagement, and growth strategy to keep your brand consistent and relevant online.",
      investment: "Minimum Investment: ₦750,000 / $1000"
    },
    {
      icon: "🎬",
      title: "Reel Production & Strategy",
      description: "We create engaging, high-performing short-form video content (Reels) that complements your brand voice and marketing goals.",
      investment: "Minimum Investment: ₦500,000 / $400"
    },
    {
      icon: "✨",
      title: "Kreator Activation Service",
      description: "We manage the entire creator campaign process—from strategy and scouting to execution and reporting—connecting your brand with vetted creators to produce authentic, high-performing content that drives real engagement.",
      investment: "Packages: ₦1M - ₦1.5M (Starter) | ₦3M - ₦5M (Growth) | ₦10M+ (Premium)"
    },
    {
      icon: "🎨",
      title: "Template Kit Package",
      description: "A strategic, fully-branded content and design system for self-managed brands who want to show up consistently, professionally, and with ease. This package includes both the visuals and the strategy - giving you everything you need to plan, design, and post confidently.",
      investment: "Minimum Investment: ₦300,000 / $250"
    },
    {
      icon: "📷",
      title: "Videography & Photography Campaign Shoot",
      description: "From brand shoots to campaign visuals — we plan, shoot, and deliver content that tells your story beautifully and effectively.",
      investment: "Minimum Investment: ₦500,000 / $500"
    },
    {
      icon: "🤝",
      title: "Work with TKH kREATORS",
      description: "Looking to collaborate with beginner or early-stage trained creatives such as content creators or social media managers? This package connects you with vetted kREATORS ready to support your brand.",
      investment: "Content Creation: Starting at ₦100,000 | Social Media Marketing: Starting at ₦250,000"
    }
  ];

  return (    <section id="services" className="section-white py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
            Our Services & Packages
          </h2>
          <p className="text-lg text-black/80 max-w-2xl mx-auto">
           From strategy to execution, we offer everything your brand needs to thrive.

          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg border border-border shadow-md hover-scale hover:border-tkh-yellow transition-all duration-300"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-serif font-semibold text-black mb-3">
                {service.title}
              </h3>
              <p className="text-black/70 mb-4">
                {service.description}
              </p>
              <p className="text-sm font-semibold text-tkh-orange mt-auto">
                {service.investment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
