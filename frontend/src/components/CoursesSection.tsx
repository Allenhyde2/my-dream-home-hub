import { useState } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { COURSE_LEVELS, LEVEL_DESCRIPTIONS, getCoursesByLevel, type CourseLevel } from "@/data/courses";

const CoursesSection = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel>("초보");

  const filteredCourses = getCoursesByLevel(selectedLevel);
  const levelInfo = LEVEL_DESCRIPTIONS[selectedLevel];

  return (
    <section className="py-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground">부동산 강의</h2>
        <p className="text-muted-foreground mt-1">레벨별 맞춤 강의로 부동산 투자를 배워보세요</p>
      </div>

      <div className="flex gap-2 mb-6">
        {COURSE_LEVELS.map((level) => (
          <Button
            key={level}
            variant={selectedLevel === level ? "default" : "outline"}
            onClick={() => setSelectedLevel(level)}
            className="gap-2"
            data-testid={`level-tab-${level}`}
          >
            <span className={`w-2 h-2 rounded-full ${LEVEL_DESCRIPTIONS[level].color}`} />
            {level}
          </Button>
        ))}
      </div>

      <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${levelInfo.color} flex items-center justify-center`}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{levelInfo.title}</h3>
              <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.slice(0, 5).map((course) => (
          <Card 
            key={course.id} 
            className="hover-elevate cursor-pointer overflow-hidden"
            onClick={() => navigate(`/course/${course.id}`)}
            data-testid={`course-card-${course.id}`}
          >
            <div className={`h-32 ${LEVEL_DESCRIPTIONS[course.level].color} flex items-center justify-center`}>
              <BookOpen className="w-12 h-12 text-white/80" />
            </div>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {course.level}
                </Badge>
                {course.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold line-clamp-2 mb-2" data-testid={`course-title-${course.id}`}>
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {course.studentCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {course.totalDuration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{course.price.toLocaleString()}원</span>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {course.originalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
                {course.originalPrice > course.price && (
                  <Badge variant="destructive" className="text-xs">
                    {Math.round((1 - course.price / course.originalPrice) * 100)}% 할인
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
