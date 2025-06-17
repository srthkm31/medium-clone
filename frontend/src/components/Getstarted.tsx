import Appbar from "./Appbar";
import homepageMe from "../images/homepageMe.jpg";
import { useNavigate } from "react-router-dom";

const Getstarted = () => {
  const navigate = useNavigate();
  const onClickHandler = () => {
    const auth = localStorage.getItem("token");
    if (auth) {
      navigate("/blog");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-between items-center h-[700px]">
        <div className="flex-col items-center 2xl:pl-70 pl-10">
          <p className=" text-6xl md:text-8xl font-semibold text-neutral-800/90">
            Human <br />
            stories & ideas
          </p>
          <p className="text-2xl pt-10 pb-10">
            A place to read, write and deepen your understanding
          </p>
          <button
            onClick={() => {
              onClickHandler();
            }}
            className="bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-full  pr-8 pl-8 pt-2 pb-2 text-lg"
          >
            Start Reading
          </button>
        </div>
        <img
          src={homepageMe}
          alt="HomepageLogo.jpg"
          className="hidden lg:flex w-120"
        ></img>
      </div>
    </div>
  );
};

export default Getstarted;
