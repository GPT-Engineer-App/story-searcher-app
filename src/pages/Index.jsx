import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);
  const storyPromises = top100Ids.map(async (id) => {
    const storyResponse = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return storyResponse.json();
  });
  return Promise.all(storyPromises);
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <SkeletonLoader />
      ) : error ? (
        <div>Error loading stories</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

const StoryCard = ({ story }) => (
  <Card>
    <CardHeader>
      <CardTitle>{story.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{story.score} upvotes</p>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Read more
      </a>
    </CardContent>
  </Card>
);

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 10 }).map((_, index) => (
      <Skeleton key={index} className="h-24 w-full" />
    ))}
  </div>
);

export default Index;