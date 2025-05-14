import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/context/CartContext";

export default function Catalog() {
  const { courses, isLoading } = useCart();
  
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 flex-grow">
                    <Skeleton className="h-7 w-4/5 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6 mb-4" />
                    <div className="flex space-x-4 mb-6">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="px-6 pb-6 mt-auto">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
