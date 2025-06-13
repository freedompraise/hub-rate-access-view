
const ServicesSection = () => {
  const services = [
    {
      icon: "�",
      title: "Marketing & Campaign Strategy",
      description: "We build marketing roadmaps that align with your goals, connect with your audience, and deliver measurable results.",
      investment: "Minimum Investment: ₦300,000 / $250"
    },
    {
      icon: "📱",
      title: "Social Media Management",
      description: "We handle your day-to-day content planning, posting, engagement, and growth strategy to keep your brand consistent and relevant online.",
      investment: "Minimum Investment: ₦750,000 / $700"
    },
    {
      icon: "🎬",
      title: "Reel Production & Strategy",
      description: "We create high-performing, attention-grabbing short-form video content (Reels) that aligns with your brand voice and marketing goals.",
      investment: "Minimum Investment: ₦500,000 / $400"
    },
    {
      icon: "🎨",
      title: "Template Kit Package",
      description: "A strategic, fully-branded visual system (templates for social, flyers, etc.) designed for self-managed brands who want to stay consistent and professional.",
      investment: "Minimum Investment: ₦300,000 / $250"
    },
    {
      icon: "📷",
      title: "Videography & Photography Campaign Shoot",
      description: "From brand shoots to campaign visuals — we plan, shoot, and deliver content that tells your story beautifully and effectively.",
      investment: "Minimum Investment: ₦500,000 / $500"
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
