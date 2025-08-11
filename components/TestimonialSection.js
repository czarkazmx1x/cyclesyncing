"use client";

export default function TestimonialSection() {
  const testimonials = [
    {
      quote: "This app has completely changed my relationship with my cycle. I now understand why I feel certain ways at different times of the month.",
      author: "Sarah T.",
      role: "Yoga Instructor",
    },
    {
      quote: "The nutrition recommendations are spot on. I've noticed more energy and fewer symptoms since I started following them.",
      author: "Jennifer M.",
      role: "Marketing Executive",
    },
    {
      quote: "As a fitness coach, I've always known that exercise should vary throughout the month. This app makes it easy to know what workouts are best each day.",
      author: "Lisa K.",
      role: "Fitness Coach",
    },
  ];

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Loved by Women Everywhere
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Hear from our users who have transformed their relationship with their menstrual cycles.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <blockquote className="flex-1">
                  <p className="text-lg text-gray-600">"{testimonial.quote}"</p>
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}