import { Button } from "@/components/ui/button";
import { Course } from "../lib/types";
import { Clock, User, Calendar, MapPin } from "lucide-react";
import { useCart } from "../lib/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { addToCart, isItemInCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    addToCart(course.id);
    toast({
      title: "Added to cart",
      description: `${course.title} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <img 
        src={course.imageUrl} 
        alt={course.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-sans font-bold text-neutral-dark">{course.title}</h3>
          <span className="bg-primary text-white text-sm font-semibold py-1 px-3 rounded-full">
            ${course.price.toFixed(2)}
          </span>
        </div>
        <p className="text-neutral-dark mb-4 line-clamp-3">
          {course.description}
        </p>
        <div className="space-y-2 text-sm text-neutral-medium mb-6">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" /> {course.duration}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" /> {course.instructor}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" /> {course.dayOfWeek}s, {course.startDate} - {course.endDate}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" /> {course.startTime} {course.timeZone}
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 mt-auto">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          variant={isItemInCart(course.id) ? "secondary" : "default"}
        >
          {isItemInCart(course.id) ? "Already in Cart" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
