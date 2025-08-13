import { FaStar, FaStarHalf } from "react-icons/fa6";

interface IRatingStarsProps {
  rating: number;
  noOfReviews: number;
}

export default function RatingStars(props: IRatingStarsProps) {
  return (
    <div className="flex items-start gap-2 select-none">
      {/* Gray Stars */}
      <div className="flex gap-1 relative w-[96px] z-10 mt-[1px]">
        <div className="absolute inset-0 flex gap-1 -z-10">
          {[...Array(5)].map((_, i) => (
            <FaStar className="text-neutral-300 text-base" key={i} />
          ))}
        </div>

        {[...Array(5)].map((_, i) =>
          props.rating >= i + 1 ? (
            <FaStar className="text-base text-yellow-500" key={i} />
          ) : props.rating >= i + 1 - 0.5 ? (
            <FaStarHalf className="text-base text-yellow-500" key={i} />
          ) : null,
        )}
      </div>

      <p className="text-[#898989]">({props.noOfReviews})</p>
    </div>
  );
}
