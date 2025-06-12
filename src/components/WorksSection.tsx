
const WorksSection = () => {
  const videos = [
    {
      id: "UwtqiPKgiJc",
      title: "Creative Video 1"
    },
    {
      id: "k-2igx8aKCc", 
      title: "Creative Video 2"
    }
  ];

  return (
    <section id="work" className="section-navy py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Our Creative in Action
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            A few stories told in frames.
          </p>
        </div>
        
        {/* Videography Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-serif font-semibold text-white mb-8 text-center">
            Videography
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <div key={index} className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Photography Section */}
        <div>
          <h3 className="text-2xl font-serif font-semibold text-white mb-8 text-center">
            Photography
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder for Google Drive images */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="aspect-square bg-white/10 rounded-lg flex items-center justify-center"
              >
                <span className="text-white/60 text-sm">Photo {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorksSection;
