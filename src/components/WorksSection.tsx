
const WorksSection = () => {  
  
  const videos = [
    {
      id: "UwtqiPKgiJc",
      title: "Creative Video 1"
    },
    {
      id: "k-2igx8aKCc", 
      title: "Creative Video 2"
    },
    {
      id: "fsNJ9VyZc7s",
      title: "Creative Video 3"
    },
    {
      id: "cT72XKCrEjU",
      title: "Creative Short"
    }
  ];

  const photos = [
    { id: "1", src: "/photography/1.webp", alt: "Photography work 1" },
    { id: "2", src: "/photography/2.webp", alt: "Photography work 2" },
    { id: "3", src: "/photography/3.webp", alt: "Photography work 3" },
    { id: "4", src: "/photography/4.webp", alt: "Photography work 4" },
    { id: "5", src: "/photography/5.webp", alt: "Photography work 5" },
    { id: "6", src: "/photography/6.webp", alt: "Photography work 6" },
    { id: "7", src: "/photography/7.webp", alt: "Photography work 7" },
    { id: "8", src: "/photography/8.webp", alt: "Photography work 8" },
    { id: "9", src: "/photography/9.webp", alt: "Photography work 9" },
    { id: "10", src: "/photography/10.webp", alt: "Photography work 10" }
  ];

  return (
    <section id="work" className="section-navy py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Our Creative Work
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
           A look at the stories we've told through strategy, visuals, and content.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorksSection;
