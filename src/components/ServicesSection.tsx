
const ServicesSection = () => {
  const services = [
    {
      icon: "📱",
      title: "Social Media Strategy",
      description: "Audience targeting, content themes, engagement playbooks"
    },
    {
      icon: "💡",
      title: "Digital Marketing Strategy", 
      description: "SEO, email marketing, Google ads & full-funnel campaigns"
    },
    {
      icon: "🤝",
      title: "Social Media Management",
      description: "Daily execution across Instagram & TikTok with reporting"
    },
    {
      icon: "🎬",
      title: "Reel Production & Strategy",
      description: "Scroll-stopping video content — shot, edited, delivered"
    },
    {
      icon: "🎨",
      title: "Templates + Design Kits",
      description: "Branded visual packs to keep your feed looking premium"
    },
    {
      icon: "📷",
      title: "Campaign Photography & Video",
      description: "End-to-end execution: concept, shoot, edit, delivery"
    }
  ];

  return (
    <section id="services" className="section-white py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
            What We Do Best
          </h2>
          <p className="text-lg text-black/80 max-w-2xl mx-auto">
            From strategy to social, video to campaigns — you're in expert hands.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg border border-border shadow-md hover-scale hover:border-tkh-yellow transition-all duration-300"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-serif font-semibold text-black mb-3">
                {service.title}
              </h3>
              <p className="text-black/70">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
