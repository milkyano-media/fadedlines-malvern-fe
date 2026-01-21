import loadingAnimation from "@/assets/loading/fadedlines-animation.gif";

const Spinner = () => (
    <div className="flex justify-center items-center p-4 md:p-12">
        <img
            src={loadingAnimation}
            alt="Loading..."
            className="h-24 w-24 md:h-32 md:w-32 object-contain"
        />
    </div>
);

export default Spinner;