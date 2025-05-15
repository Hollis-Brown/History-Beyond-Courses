import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CourseCard from "@/components/CourseCard";
import { useCart } from "@/lib/context/CartContext";
import { Course } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { courses, isLoading } = useCart();

  // Only show the first 2 courses on the home page
  const featuredCourses = courses.slice(0, 2);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div
          className="w-full h-[500px] bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.imgur.com/ieImTcM.png')" }}
        >
          <div className="absolute inset-0 bg-neutral-dark opacity-50"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight mb-4">
              The U.S. Story — Explained for International Minds
            </h1>
            <Link href="/catalog">
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-sans font-bold text-neutral-dark mb-4">About</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-neutral-dark mb-6">
              Kyli Brown is an experienced educator specializing in U.S. History, Political Science, and American foreign policy.. With a Master's degree in International Policy Studies focusing on Terrorism Studies and French Studies, she is dedicated to helping British and European professionals gain an in-depth understanding of the United States..
            </p>
            <p className="text-lg text-neutral-dark mb-6">
              Kyli Brown is an experienced educator specializing in U.S. History, Political Science, and American foreign policy.. With a Master's degree in International Policy Studies focusing on Terrorism Studies and French Studies, she is dedicated to helping British and European professionals gain an in-depth understanding of the United States.
            </p>
            <p className="text-lg text-neutral-dark">
              Her thematic, seminar-based courses in U.S. History and American foreign policy emphasize critical thinking and global awareness. </p>
            <br />
            <p className="text-lg text-neutral-dark">
              Today, we live in unprecedented times where understanding history, politics, and culture has never been more critical. Her goal is to empower international learners to see beyond news headlines and social media narratives, offering deeper insights into American history and culture and how it directly affects the UK and Europe.            </p>
            <br />
            <p className="text-lg text-neutral-dark">
              Outside the classroom, she volunteers with Ukrainian refugees settled in the United States, assisting them with language skills and cultural adaptation.
            </p>
            <br />
            <p className="text-lg text-neutral-dark italic">
              Join her to explore American history in a fresh, insightful, and transformative way!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-sans font-bold text-neutral-dark text-center mb-4">Featured Courses</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
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
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
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
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/catalog">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white py-2 px-6">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-4">NOTE:</h2>
              <p className="text-lg text-neutral-dark">
                For non-native English speakers, a minimum English proficiency of C1 (Common European Framework of Reference for Languages - CEFR) is recommended to comfortably enjoy and participate in the course. You can check your proficiency with this quick online test: <a href="https://www.efset.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">EF SET English Test</a> unless you have TOEFL scores of 23–30 (Reading), 22–30 (Listening), and 24–30 (Speaking).
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-4">EXEMPTIONS</h2>
              <p className="text-lg text-neutral-dark">
                This company supports Ukraine. Ukrainian citizens may enroll in either course free of charge upon providing proof of citizenship.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
