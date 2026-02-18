export default function Grid() {
  return (
    <div className="flex items-center justify-center">
      <div className="image-grid grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 w-full text-gray-700">
        <div className="bg-blue-100 pb-[66.67%] relative w-full">
          <img
            alt="1"
            className="absolute left-0 top-0 max-w-full"
            src="/images/grid/143-1024x683.jpg"
          />
        </div>
        <div className="bg-blue-100 pb-[66.67%] relative w-full">
          <img
            alt="2"
            className="absolute left-0 top-0 max-w-full"
            src="/images/grid/302-1024x683.jpg"
          />
        </div>
        <div className="bg-blue-100 pb-[66.67%] relative w-full">
          <img
            alt="3"
            className="absolute left-0 top-0 max-w-full"
            src="/images/grid/513-1024x683.jpg"
          />
        </div>
        <div className="bg-blue-100 pb-[66.67%] relative w-full">
          <img
            alt="4"
            className="absolute left-0 top-0 max-w-full"
            src="/images/grid/757-1024x683.jpg"
          />
        </div>
        <div className="bg-blue-100 pb-[66.67%] relative w-full">
          <img
            alt="5"
            className="absolute left-0 top-0 max-w-full"
            src="/images/grid/966-1024x683.jpg"
          />
        </div>
        <div className="bg-blue-100 pb-[66.67%] relative w-full">
          <img
            alt="6"
            className="absolute left-0 top-0 max-w-full"
            src="/images/grid/1044-1024x683.jpg"
          />
        </div>
      </div>
    </div>
  );
}
