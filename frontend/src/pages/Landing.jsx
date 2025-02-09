import { Button } from "@/components/ui/button";
import Typewriter from "typewriter-effect";
import Model from "./model/Model";

function Landing() {
  return (
    <div className="min-h-screen bg-[#EDE7DB]">
      {/* <BackgroundBeamsWithCollision /> */}
      <section className="h-screen w-full rounded-md !overflow-visible relative flex flex-col items-center antialiased justify-center ">
        <Button
          size={"lg"}
          className="p-8 mb-24 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full bg-[#fff] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-600  md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black">
            Helping employees succeed
          </span>
        </Button>
        <h1 className="max-w-5xl text-center text-5xl md:text-8xl bg-gradient-to-r from-blue-900 via-blue-500 to-blue-300 bg-clip-text text-transparent font-sans font-bold">
          ThryVe (Thrive + AI)
        </h1>
        <div className=" w-full h-24 flex justify-center items-center absolute bottom-20">
          <div className="text-3xl font-semibold lg:text-2xl text-black">
            <Typewriter
              options={{
                strings: [
                  "AI HR Manager",
                  "Schedule Meetings",
                  "Smart Assistant",
                  "Automate and Suceed",
                ],
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
                delay: 80,
                cursor: "|",
              }}
            />
          </div>
        </div>
      </section>

      {/* <div className="w-full h-screen bg-[#EDE7DB]">
        <Model />
      </div> */}
    </div>
  );
}

export default Landing;
