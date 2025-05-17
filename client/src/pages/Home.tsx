import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CourseCard from "@/components/CourseCard";
import { useCart } from "@/lib/context/CartContext";

export default function Home() {
    const { courses } = useCart();

    // Only show the first 2 courses on the home page
    const featuredCourses = courses.slice(0, 2);

    return (
        <div>
            {/* Hero Section */}
            <div className="relative w-full">
                <div
                    className="w-full h-[700px] bg-cover bg-center"
                    style={{ backgroundImage: "url('https://i.imgur.com/ieImTcM.png')" }}
                >
                    <div className="absolute inset-0 bg-neutral-dark opacity-50"></div>
                    <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-sans font-bold text-white leading-tight mb-4">
                            The U.S. Story — Explained for International Minds
                        </h1>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-sans font-bold text-neutral-dark text-center mb-4">About the Instructor</h2>
                        <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>

                        <div className="flex flex-col md:flex-row items-center justify-center text-center gap-8">
  <div className="w-full md:w-3/3">
    <p className="text-lg text-neutral-dark mb-4">
      Kyli Brown is a passionate educator with a deep understanding of American history and its global impact. With years of experience teaching international students, she brings a unique perspective to historical events and their relevance in today's world.
    </p>
    <p className="text-lg text-neutral-dark">
      For 20 years, she has taught extensively both in California and internationally—including New Zealand, Georgia, Turkey, Italy, and Mexico. Her professional experiences living in France, Iceland, and the United Kingdom have significantly shaped her global perspective and teaching style.
    </p>
    <br />
    <p className="text-lg text-neutral-dark">
      Her thematic, seminar-based courses in U.S. History and American foreign policy emphasize critical thinking and global awareness.
    </p>
    <b />
    <p className="text-lg text-neutral-dark">
      Today, we live in unprecedented times where understanding history, politics, and culture has never been more critical. Her goal is to empower international learners to see beyond news headlines and social media narratives, offering deeper insights into American history and culture and how it directly affects the UK and Europe.
    </p>
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

                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-sans font-bold text-neutral-dark text-center mb-4">Featured Courses</h2>
                    <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {featuredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
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

            {/* Notes Section */}
            <section className="py-16 bg-neutral-light">
                <div className="container mx-auto px-4">
                    <div className="w-full">
                        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 w-full">
                            <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-4">NOTE:</h2>
                            <p className="text-lg text-neutral-dark">
                                For non-native English speakers, a minimum English proficiency of C1 (Common European Framework of Reference for Languages - CEFR) is recommended to comfortably enjoy and participate in the course. You can check your proficiency with this quick online test: <a href="https://www.efset.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">EF SET English Test</a> unless you have TOEFL scores of 23–30 (Reading), 22–30 (Listening), and 24–30 (Speaking).
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full">
                            <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-4">EXEMPTIONS:</h2>
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