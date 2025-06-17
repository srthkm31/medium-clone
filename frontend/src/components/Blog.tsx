import { useEffect, useState } from "react";
import Appbar from "./Appbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Blog = () => {
  const [blogs, setBlogs] = useState<blog[]>([]);
  const [loading, setLoading] = useState(true); // <-- loading state
  const navigate = useNavigate();

  interface blog {
    id: number;
    title: string;
    content: string;
    date: string;
    author: {
      name: string;
    };
  }
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API}/api/v1/blog/bulk`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  const dummySkeletons = Array(3).fill(null); // show 3 loading cards

  return (
    <div>
      <Appbar />
      <div className="2 p-5 pt-0 flex items-center flex-col">
        {(loading ? dummySkeletons : blogs).map((blog: any, index: number) => (
          <div
            key={blog?.id || index}
            className="3 flex-row pb-10 border-t-1 border-neutral-300 pt-7 cursor-pointer"
            onClick={() => {
              if (!loading) navigate(`/clickedBlog/${blog.id}`);
            }}
          >
            <div className="p-1.5 flex flex-row justify-start items-center gap-3 pb-2">
              <div className="w-7 h-7 rounded-full bg-neutral-200 pt-1 text-center font-semibold text-sm">
                {loading ? (
                  <Skeleton circle width={28} height={28} />
                ) : (
                  blog.author.name[0]
                )}
              </div>
              <p className="text-sm">
                {loading ? <Skeleton width={80} /> : blog.author.name}
              </p>
              <span className="font-bold text-neutral-600">&middot;</span>
              <p className="text-semibold text-xs text-neutral-600">
                {loading ? <Skeleton width={60} /> : blog.date.split("T")[0]}
              </p>
            </div>
            <div className="lg:w-[800px]">
              <p className="text-2xl font-bold pl-1.5">
                {loading ? <Skeleton count={2} /> : blog.title}
              </p>
              <p className="text-justify pl-2 pt-3 text-neutral-600">
                {loading ? (
                  <Skeleton count={3} />
                ) : (
                  blog.content.slice(0, 200) + "..."
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
