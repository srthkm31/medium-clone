import { Link, useParams } from "react-router-dom";
import Appbar from "./Appbar";
import { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Yourblog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    author: {
      name: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API}/api/v1/blog/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
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
        <p className="text-2xl font-medium p-7 ">Your blog</p>
        <div className="3  flex pb-10 border-t-1 border-neutral-300 pt-7">
          <div className=" lg:w-[800px]">
            <p className="text-3xl font-bold pl-1.5">
              {loading ? <Skeleton /> : blogData.title}
            </p>
            <p className="text-justify pl-2 pt-3 font-medium text-neutral-700 white-space: pre-wrap">
              {loading ? <Skeleton count={5} /> : blogData.content}
            </p>
          </div>
        </div>
        <Link
          to="/blog"
          className="pt-10 text-sm text-blue-700 underline font-medium"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Yourblog;
