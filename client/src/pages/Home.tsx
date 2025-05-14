import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CourseCard from "@/components/CourseCard";
import { useCart } from "@/lib/context/CartContext";
import { Course } from "@/lib/types";

export default function Home() {
  const { courses } = useCart();
  
  // Only show the first 2 courses on the home page
  const featuredCourses = courses.slice(0, 2);
  
  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="w-full h-[500px] bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}
        >
          <div className="absolute inset-0 bg-neutral-dark opacity-50"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight mb-4">
              History Beyond Headlines
            </h1>
            <p className="text-xl text-white max-w-3xl mb-8">
              Dive deeper into history with our expert-guided courses that go beyond what textbooks teach.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="py-3 px-8 text-base">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-sans font-bold text-neutral-dark mb-4">About History Beyond Headlines</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-neutral-dark mb-6">
              We believe history education shouldn't stop at memorizing dates and events. Our courses dive deep into historical contexts, exploring the nuances and untold stories that shaped our world today.
            </p>
            <p className="text-lg text-neutral-dark mb-6">
              Led by expert historians and researchers, our curriculum provides a comprehensive understanding of historical events, cultures, and societal developments that continue to influence contemporary issues.
            </p>
            <p className="text-lg text-neutral-dark">
              Whether you're a curious mind, a history enthusiast, or a student looking to enhance your knowledge, our courses offer engaging content, primary sources, and interactive learning experiences.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-sans font-bold text-neutral-dark text-center mb-4">Featured Courses</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-neutral-medium">Loading courses...</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/catalog">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white py-2 px-6">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
