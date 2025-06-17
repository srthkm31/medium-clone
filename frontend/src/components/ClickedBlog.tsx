import { useEffect, useState } from "react";
import Appbar from "./Appbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ClickedBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    date: "",
    author: {
      name: "",
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8787/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setBlogData(response.data);
      } catch (err) {
        console.error("Error fetching blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <div>
      <Appbar />
      <div className="2 p-5 pt-0 flex items-center flex-col">
        <div className="3  flex pb-10 border-t-1 border-neutral-300 pt-7">
          <div className=" lg:w-[800px]">
            <p className="text-3xl font-bold pl-1.5">
              {loading ? <Skeleton /> : blogData.title}
            </p>
            <div className="flex justify-start pt-6 items-center gap-3 pb-4 pl-1.5">
              <div className="w-7 h-7 rounded-full bg-neutral-200 pt-1 text-center text-sm font-medium">
                {loading ? (
                  <Skeleton circle width={28} height={28} />
                ) : (
                  blogData.author.name[0]
                )}
              </div>
              <p className="text-sm">
                {loading ? <Skeleton width={80} /> : blogData.author.name}
              </p>
              <span className="font-bold text-neutral-600">&middot;</span>
              <p className="text-semibold text-xs text-neutral-600">
                {loading ? (
                  <Skeleton width={60} />
                ) : (
                  blogData.date.split("T")[0]
                )}
              </p>
            </div>
            <pre className="pl-2 pt-3 font-medium text-neutral-700 overflow-x-hidden flex-wrap text-wrap font-sans">
              {loading ? <Skeleton count={10} /> : blogData.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickedBlog;
