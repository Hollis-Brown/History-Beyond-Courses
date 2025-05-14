import CourseCard from "@/components/CourseCard";
import { useCart } from "@/lib/context/CartContext";

export default function Catalog() {
  const { courses } = useCart();
  
  return (
    <div className="flex-grow">
      {/* Catalog Header */}
      <div className="bg-neutral-light py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-sans font-bold text-neutral-dark text-center">Course Catalog</h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
        </div>
      </div>
      
      {/* Course Catalog */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-neutral-medium">Loading courses...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
