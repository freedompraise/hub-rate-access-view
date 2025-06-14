
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
    { id: "1qN-ebsOlfDjat9Ltv3W5nvzG1P7tJ9Eo" },
    { id: "1kY509BSqrz6doZ6IOgfag5q2JWKHIubD" },
    { id: "1J4yFdSYjEHApGrhrwUP84STHQeiW8Qmj" },
    { id: "14mOWC5aXHciUv-QQzfJzZals-SMmqmu-" },
    { id: "1eHn4NIOErlarZCve0KgX7dt-HEPZRZGg" },
    { id: "1yGyLNjUgpHjPuSDnkt_9vQBK9I30EO-H" },
    { id: "1bYgbAIAbCVU-gcgfl8sWQlN2S2G3ux9a" },
    { id: "1XPpDzD3zTQ0zjrtGRHw0GjprLjRTaozq" },
    { id: "1KteZgHvHskXYV_lI_zZkzbaP7cxGdsjg" }
    // { id: "1fSFMdVlk4KlWTH8eKYLH8XNH8RsLfcAD" }
  ];

  return (
    <section id="work" className="section-navy py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Our Creative Work
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
           A look at the stories we’ve told through strategy, visuals, and content.
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
            {photos.map((video, index) => (
              <div key={index} className="aspect-video">
                <iframe
                  src={`https://drive.google.com/file/d/${video.id}/preview`}
                  allow="autoplay"
                  className="w-full h-full rounded-lg"
                  allowFullScreen
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
