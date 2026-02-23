import { useRef, useState, useMemo } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { creators, CREATOR_TAGS, type CreatorTag } from "@/data/creators";

const CreatorsList = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState<CreatorTag>("전체");

  const filteredCreators = useMemo(() => {
    if (selectedTag === "전체") return creators;
    return creators.filter((creator) => creator.tags.includes(selectedTag));
  }, [selectedTag]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCreatorClick = (creatorId: number) => {
    navigate(`/creator/${creatorId}`);
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">추천 크리에이터</h2>
          <p className="text-muted-foreground mt-1">부동산 전문가들의 인사이트를 만나보세요</p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} data-testid="button-scroll-left">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} data-testid="button-scroll-right">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {CREATOR_TAGS.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(tag)}
            className="shrink-0"
            data-testid={`tag-${tag}`}
          >
            {tag}
          </Button>
        ))}
      </div>

      {filteredCreators.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          해당 태그의 크리에이터가 없습니다.
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="flex flex-col items-center min-w-[140px] p-4 rounded-lg bg-card border border-border hover-elevate cursor-pointer group snap-start"
              data-testid={`creator-card-${creator.id}`}
              onClick={() => handleCreatorClick(creator.id)}
            >
              <div className="relative mb-3">
                <Avatar className="w-16 h-16 ring-2 ring-border group-hover:ring-primary transition-all">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className={`${creator.color} text-white font-bold`}>
                    {creator.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {creator.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-foreground text-sm text-center line-clamp-1">
                {creator.name}
              </h3>
              <Badge variant="secondary" className="mt-1 text-xs">
                {creator.specialty}
              </Badge>
              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                {creator.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground text-xs">
                <Users className="w-3 h-3" />
                <span>{(creator.followers / 1000).toFixed(1)}K</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CreatorsList;
